const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: 'https://'+process.env.AUTH0_DOMAIN,
});
//Get Amb by ID
router.get('/:ambId', (req, res, next) => {
  if(Number(req.params.ambId) > 0) {
    console.log("GET /ambs/"+req.params.ambId);
    db.task (async t => {
      let ambInfo, groupInfo, soundsQueries, soundsArr, groupsArr;
      try {
        ambInfo = await t.one('SELECT name, owner_id, username AS owner_name FROM ambs JOIN users ON users.id = ambs.owner_id WHERE ambs.id = $1;', [req.params.ambId]);
      } catch(error) {
        throw error;
      }
      try {
        groupInfo = await t.any('SELECT group_id, name, interval_from, interval_to FROM groups WHERE amb_id = $1;', [req.params.ambId]);
      } catch(error) {
        throw error;
      }
      try {
        soundsQueries = groupInfo.map((group) => t.any('SELECT * FROM sounds WHERE amb_id = $1 AND group_id = $2;', [req.params.ambId, group.group_id]));
      } catch(error) {
        throw error;
      }
      try {
        soundsArr = await t.batch(soundsQueries);
      } catch(error) {
        throw error;
      }
      groupsArr = groupInfo.map((group, index) => {
        return {
          groupName: group.name,
          groupId: group.group_id,
          interval: { from: group.interval_from, to: group.interval_to },
          sounds: soundsArr[index].map((sound) => {
            return {
              name: sound.name,
              id: sound.sound_id,
              url: sound.url,
              volume: sound.volume,
              start: sound.time_start,
              end: sound.time_end,
              chain: { from: sound.chain_from, to: sound.chain_to },
            }
          }),
        }
      });
      return ambObj = {
        ambId: req.params.ambId,
        ambName: ambInfo.name,
        ambOwner: ambInfo.owner_name,
        ambOwnerId: ambInfo.owner_id,
        ambData: groupsArr,
      };
    })
      .then((ambObj) => {
        if(ambObj) {
          console.log("Success");
          res.send(ambObj);
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong!' });
      });
    } else {
      console.log('Bad input');
      res.status(500).send({ message: 'Bad input' });
    }
});
//Create new Amb
router.post('/', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
    typeof req.body.ambName === 'string'
  ) {
    db.task(t => {
      return t.one('SELECT id FROM users WHERE id = $1 AND sub = $2;', [req.body.userId, req.auth.payload.sub])
        .then(user => {
          return t.one('INSERT INTO ambs (name, owner_id) VALUES ($1, $2) RETURNING id;', [req.body.ambName, req.body.userId])
        })
        .catch((error) => {
          console.log(error);
          console.log("Invalid user");
          res.status(500).send({ message: 'Invalid user' });
        });
    })
      .then((newAmb) => {
        if(newAmb) {
          console.log(`Created Amb ${newAmb.id} for user ${req.body.userId}`);
          res.send({ ambId: newAmb.id })
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not create new Amb');
        res.status(500).send({ message: 'Unable to create new Amb' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Create new group in Amb
router.post('/:ambId', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
    Number(req.params.ambId) > 0 &&
    typeof req.body.groupName === 'string' &&
    Number.isInteger(req.body.interval.from) &&
    req.body.interval.from >= 0 &&
    Number.isInteger(req.body.interval.to) &&
    req.body.interval.to >= req.body.interval.from
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, ambs.id AS amb_id FROM users JOIN ambs ON users.id = ambs.owner_id WHERE ambs.id = $1 AND users.id = $2 AND users.sub = $3;', [req.params.ambId, req.body.userId, req.auth.payload.sub])
        .then(ambData => {
          return t.one('INSERT INTO groups(amb_id, name, interval_from, interval_to) VALUES ($1, $2, $3, $4) RETURNING amb_id, group_id;',
          [ambData.amb_id, req.body.groupName, req.body.interval.from, req.body.interval.to])
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner or Amb not found");
          res.status(500).send({ message: 'Unable to interact with Amb' });
        });
    })
      .then((newGroup) => {
        if(newGroup) {
          console.log(`Created new group ${newGroup.group_id} in Amb ${newGroup.amb_id}`);
          res.send(newGroup);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not create new group');
        res.status(500).send({ message: 'Unable to create new group' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Create new sound in group
router.post('/:ambId/:groupId', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
    Number(req.params.ambId) > 0 &&
    Number(req.params.groupId) > 0 &&
    typeof req.body.soundName === 'string' &&
    typeof req.body.url === 'string' &&
    Number.isInteger(req.body.volume) &&
    req.body.volume >= 0 &&
    req.body.volume <= 100 &&
    Number.isInteger(req.body.start) &&
    req.body.start >= 0 &&
    Number.isInteger(req.body.end) &&
    req.body.end >= -1 &&
    Number.isInteger(req.body.chain.from) &&
    req.body.chain.from >= 0 &&
    Number.isInteger(req.body.chain.to) &&
    req.body.chain.to >= req.body.chain.from
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, ambs.id AS amb_id FROM users JOIN ambs ON users.id = ambs.owner_id WHERE ambs.id = $1 AND users.id = $2 AND users.sub = $3;', [req.params.ambId, req.body.userId, req.auth.payload.sub])
        .then(ambData => {
          return t.one('SELECT group_id FROM ambs JOIN groups ON ambs.id = groups.amb_id WHERE ambs.id = $1 AND ambs.owner_id = $2 AND groups.group_id = $3;', [ambData.amb_id, ambData.user_id, req.params.groupId])
            .then(groupData => {
              return t.one('INSERT INTO sounds(amb_id, group_id, name, url, volume, time_start, time_end, chain_from, chain_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING amb_id, group_id, sound_id;',
              [ambData.amb_id, groupData.group_id, req.body.soundName, req.body.url, req.body.volume, req.body.start, req.body.end, req.body.chain.from, req.body.chain.to])
            })
            .catch((error) => {
              console.log(error);
              console.log("Group not found");
              res.status(500).send({ message: 'Group not found' });
            });
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner or Amb not found");
          res.status(500).send({ message: 'Unable to interact with Amb' });
        });
    })
      .then((newSound) => {
        if(newSound) {
          console.log(`Created new sound ${newSound.sound_id} for group ${newSound.group_id} in Amb ${newSound.amb_id}`)
          res.send(newSound);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not create new sound');
        res.status(500).send({ message: 'Unable to create new sound' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Delete Amb
router.delete('/:ambId', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
      Number(req.params.ambId) > 0
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, ambs.id AS amb_id FROM users JOIN ambs ON users.id = ambs.owner_id WHERE ambs.id = $1 AND users.id = $2 AND users.sub = $3;', [req.params.ambId, req.body.userId, req.auth.payload.sub])
        .then((ambData) => {
          return t.none('SELECT group_id FROM groups WHERE amb_id = $1;', [ambData.amb_id])
            .then(() => {
                return t.one('DELETE FROM ambs WHERE id = $1 AND owner_id = $2 RETURNING id;', [ambData.amb_id, ambData.user_id])
            })
            .catch((error) => {
              console.log(error);
              console.log('Amb not empty');
              res.status(500).send({ message: 'Amb not empty' });
            });
        })
        .catch((error) => {
          console.log(error);
          console.log('Amb not found or user not owner');
          res.status(500).send({ message: 'Unable to interact with Amb' });
        });
    })
      .then((result) => {
        if(result) {
          console.log(`Deleted Amb ${result.id}`);
          res.send(result);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not delete Amb');
        res.status(500).send({ message: 'Unable to delete Amb' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Delete sound group in Amb
router.delete('/:ambId/:groupId', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
    Number(req.params.groupId) > 0 &&
    Number(req.params.ambId) > 0
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, ambs.id AS amb_id FROM users JOIN ambs ON users.id = ambs.owner_id WHERE ambs.id = $1 AND users.id = $2 AND users.sub = $3;', [req.params.ambId, req.body.userId, req.auth.payload.sub])
        .then(ambData => {
          return t.one('SELECT amb_id, group_id FROM groups WHERE amb_id = $1 AND group_id = $2;', [ambData.amb_id, req.params.groupId])
            .then(groupData => {
              return t.none('SELECT amb_id, group_id, sound_id FROM sounds WHERE amb_id = $1 AND group_id = $2;', [groupData.amb_id, groupData.group_id])
                .then(() => {
                  return t.one('DELETE FROM groups WHERE amb_id = $1 AND group_id = $2 RETURNING amb_id, group_id;', [groupData.amb_id, groupData.group_id])
                })
                .catch((error) => {
                  console.log(error);
                  console.log('Sound group not empty');
                  res.status(500).send({ message: 'Sound group not emtpy' });
                });
            })
            .catch((error) => {
              console.log(error);
              console.log("Group not found");
              res.status(500).send({ message: 'Group not found' });
            });
        })
        .catch((error) => {
          console.log(error);
          console.log('Amb not found or user not owner');
          res.status(500).send({ message: 'Unable to interact with Amb' });
        });
    })
      .then(result => {
        if(result) {
          console.log(`Deleted group ${result.group_id} from Amb ${result.amb_id}`)
          res.send(result);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not delete group');
        res.status(500).send({ message: 'Unable to delete group' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Delete sound from group
router.delete('/:ambId/:groupId/:soundId', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
    Number(req.params.ambId) > 0 &&
    Number(req.params.groupId) > 0 &&
    Number(req.params.soundId) > 0
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, ambs.id AS amb_id FROM users JOIN ambs ON users.id = ambs.owner_id WHERE ambs.id = $1 AND users.id = $2 AND users.sub = $3;', [req.params.ambId, req.body.userId, req.auth.payload.sub])
        .then(ambData => {
          return t.one('SELECT amb_id, group_id, sound_id FROM sounds WHERE amb_id = $1 AND group_id = $2 AND sound_id = $3', [ambData.amb_id, req.params.groupId, req.params.soundId])
            .then(soundData => {
              return t.one('DELETE FROM sounds WHERE amb_id = $1 AND group_id = $2 AND sound_id = $3 RETURNING amb_id, group_id, sound_id;', [soundData.amb_id, soundData.group_id, soundData.sound_id])
            })
            .catch((error) => {
              console.log(error);
              console.log('Sound not found');
              res.status(500).send({ message: 'Sound not found' });
            });
        })
        .catch((error) => {
          console.log(error);
          console.log('Amb not found or user not owner');
          res.status(500).send({ message: 'Unable to interact with Amb' });
        });
    })
      .then((result) => {
        if(result) {
          console.log(`Deleted sound ${result.sound_id} from group ${result.group_id} in Amb ${result.amb_id}`);
          res.send(result);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not delete sound');
        res.status(500).send({ message: 'Unable to delete sound' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Edit Amb
router.put('/:ambId', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
    Number(req.params.ambId) > 0 &&
    typeof req.body.ambName == 'string'
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, ambs.id AS amb_id FROM users JOIN ambs ON users.id = ambs.owner_id WHERE ambs.id = $1 AND users.id = $2 AND users.sub = $3;', [req.params.ambId, req.body.userId, req.auth.payload.sub])
        .then(ambData => {
          return t.one('UPDATE ambs SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING id, name;', [req.body.ambName, ambData.amb_id, ambData.user_id])
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner or Amb not found");
          res.status(500).send({ message: 'Unable to interact with Amb' });
        });
    })
      .then(result => {
        if(result) {
          console.log(`Updated Amb ${result.id} name to ${result.name}`);
          res.send(result);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not update Amb');
        res.status(500).send({ message: 'Unable to update Amb' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Edit group
router.put('/:ambId/:groupId', checkJwt, (req, res, next) => {
  if(Number(req.body.userId )> 0 &&
    Number(req.params.ambId )> 0 &&
    Number(req.params.groupId) > 0 &&
    typeof req.body.groupName === 'string' &&
    Number.isInteger(req.body.interval.from) &&
    req.body.interval.from >= 0 &&
    Number.isInteger(req.body.interval.to) &&
    req.body.interval.to >= req.body.interval.from
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, ambs.id AS amb_id FROM users JOIN ambs ON users.id = ambs.owner_id WHERE ambs.id = $1 AND users.id = $2 AND users.sub = $3;', [req.params.ambId, req.body.userId, req.auth.payload.sub])
        .then(ambData => {
          return t.one('SELECT amb_id, group_id FROM groups WHERE amb_id = $1 AND group_id = $2', [ambData.amb_id, req.params.groupId])
            .then(groupData => {
              return t.one('UPDATE groups SET name = $1, interval_from = $2, interval_to = $3 WHERE amb_id = $4 AND group_id = $5 RETURNING amb_id, group_id;',
              [req.body.groupName, req.body.interval.from, req.body.interval.to, groupData.amb_id, groupData.group_id])
            })
            .catch((error) => {
              console.log(error);
              console.log('Group not found');
              res.status(500).send({ message: 'Group not found' });
            });
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner or Amb not found");
          res.status(500).send({ message: 'Unable to interact with Amb' });
        });
    })
      .then(result => {
        if(result) {
          console.log(`Updated Group ${result.group_id} in Amb ${result.amb_id}`);
          res.send(result);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not update group');
        res.status(500).send({ message: 'unable to update group' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Edit sound
router.put('/:ambId/:groupId/:soundId', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
    Number(req.params.ambId) > 0 &&
    Number(req.params.groupId) > 0 &&
    Number(req.params.soundId) > 0 &&
    typeof req.body.soundName === 'string' &&
    typeof req.body.url === 'string' &&
    Number.isInteger(req.body.volume) &&
    req.body.volume >= 0 &&
    req.body.volume <= 100 &&
    Number.isInteger(req.body.start) &&
    req.body.start >= 0 &&
    Number.isInteger(req.body.end) &&
    req.body.end >= -1 &&
    Number.isInteger(req.body.chain.from) &&
    req.body.chain.from >= 0 &&
    Number.isInteger(req.body.chain.to) &&
    req.body.chain.to >= req.body.chain.from
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, ambs.id AS amb_id FROM users JOIN ambs ON users.id = ambs.owner_id WHERE ambs.id = $1 AND users.id = $2 AND users.sub = $3;', [req.params.ambId, req.body.userId, req.auth.payload.sub])
        .then(ambData => {
          return t.one('SELECT amb_id, group_id, sound_id FROM sounds WHERE amb_id = $1 AND group_id = $2 AND sound_id = $3;', [ambData.amb_id, req.params.groupId, req.params.soundId])
            .then(soundData => {
              return t.one('UPDATE sounds SET name = $1, url = $2, volume = $3, time_start = $4, time_end = $5, chain_from = $6, chain_to = $7 WHERE amb_id = $8 AND group_id = $9 AND sound_id = $10 RETURNING sounds.amb_id, sounds.group_id, sounds.sound_id;',
              [req.body.soundName, req.body.url, req.body.volume, req.body.start, req.body.end, req.body.chain.from, req.body.chain.to, soundData.amb_id, soundData.group_id, soundData.sound_id])
            })
            .catch((error) => {
              console.log(error);
              console.log('Sound not found');
              res.status(500).send({ message: 'Sound not found' });
            });
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner or Amb not found");
          res.status(500).send({ message: 'Unable to interact with Amb' });
        });
    })
      .then(result => {
        if(result) {
          console.log(`Updated Sound ${result.sound_id} of group ${result.group_id} in Amb ${result.amb_id}`);
          res.send(result);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not update sound');
        res.status(500).send({ message: 'Unable to update sound' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});

module.exports = router;
