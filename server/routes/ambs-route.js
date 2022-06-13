const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/:ambId', (req, res, next) => {
  console.log("GET /amb/"+req.params.ambId);
  db.task (async t => {
    let ambInfo = await t.one('SELECT name, owner_id, username AS owner_name FROM ambs JOIN users ON users.id = ambs.owner_id WHERE ambs.id = $1;', [req.params.ambId]);
    let groupInfo = await t.any('SELECT group_id, name, interval_from, interval_to FROM groups WHERE amb_id = $1;', [req.params.ambId]);
    let soundsQueries = groupInfo.map((group) => t.any('SELECT * FROM sounds WHERE amb_id = $1 AND group_id = $2;', [req.params.ambId, group.group_id]));
    let soundsArr = await t.batch(soundsQueries);
    let groupsArr = groupInfo.map((group, index) => {
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
      console.log("Success");
      res.send(ambObj);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Something went wrong!");
    });
});

router.post('/:ambId', (req, res, next) => {
  if(req.body.userId > 0 &&
    req.body.groupId === -1 &&
    typeof req.body.groupName === 'string' &&
    Number.isInteger(req.body.interval.from) &&
    Number.isInteger(req.body.interval.to)
  ) {
    db.task(t => {
      return t.one('SELECT id, owner_id FROM ambs WHERE id = $1 AND owner_id = $2;', [req.params.ambId, req.body.userId])
        .then(owned => {
          return t.one('INSERT INTO groups(amb_id, name, interval_from, interval_to) VALUES ($1, $2, $3, $4) RETURNING group_id;',
          [req.params.ambId, req.body.groupName, req.body.interval.from, req.body.interval.to])
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner");
          res.status(500).send("Something went wrong!");
        });
    })
      .then((data) => res.send({ groupId: data.group_id }))
      .catch((error) => {
        console.log(error);
        res.status(500).send("Something went wrong!");
      });
  } else {
    console.log("bad input");
    res.status(500).send("Something went wrong!");
  }
});

router.post('/:ambId/:groupId', (req, res, next) => {
  if(req.body.userId > 0 &&
    req.body.soundId === -1 &&
    typeof req.body.soundName === 'string' &&
    typeof req.body.url === 'string' &&
    Number.isInteger(req.body.volume) &&
    Number.isInteger(req.body.start) &&
    Number.isInteger(req.body.end) &&
    Number.isInteger(req.body.chain.from) &&
    Number.isInteger(req.body.chain.to)
  ) {
    db.task(t => {
      return t.one('SELECT id, owner_id FROM ambs WHERE id = $1 AND owner_id = $2;', [req.params.ambId, req.body.userId])
        .then(owned => {
          return t.one('INSERT INTO sounds(amb_id, group_id, name, url, volume, time_start, time_end, chain_from, chain_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING sound_id;',
          [req.params.ambId, req.params.groupId, req.body.soundName, req.body.url, req.body.volume, req.body.start, req.body.end, req.body.chain.from, req.body.chain.to])
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner");
          res.status(500).send("Something went wrong!");
        });
    })
      .then((data) => res.send({ soundId: data.sound_id }))
      .catch((error) => {
        console.log(error);
        res.status(500).send("Something went wrong!");
      });
  } else {
    console.log("bad input")
    res.status(500).send("Something went wrong!");
  }
});

router.delete('/:ambId', (req, res, next) => {
  if(req.body.userId > 0 &&
    req.body.groupId > 0 &&
    req.params.ambId > 0
  ) {
    db.task(t => {
      return t.one('SELECT id, owner_id FROM ambs WHERE id = $1 AND owner_id = $2;', [req.params.ambId, req.body.userId])
        .then(owned => {
          return t.none('SELECT amb_id, group_id, sound_id FROM sounds WHERE amb_id = $1 AND group_id = $2;', [req.params.ambId, req.body.groupId])
            .then(empty => {
              return t.one('DELETE FROM groups WHERE amb_id = $1 AND group_id = $2 RETURNING amb_id, group_id;', [req.params.ambId, req.body.groupId])
            })
            .catch((error) => {
              console.log(error);
              console.log('Sound group not empty');
              res.status(500).send("Something went wrong!");
            })
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner");
          res.status(500).send("Something went wrong!");
        });
    })
      .then(result => {
        if(result) {
          const resMessage = "Deleted " + result.amb_id + ":" + result.group_id;
          console.log(resMessage);
          res.send({ message: resMessage });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Something went wrong!");
      });
  } else {
    console.log("bad input")
    res.status(500).send("Something went wrong!");
  }
});

router.delete('/:ambId/:groupId', (req, res, next) => {
  if(req.body.userId > 0 &&
    req.params.ambId > 0 &&
    req.params.groupId > 0 &&
    req.body.soundId > 0
  ) {
    db.task(t => {
      return t.one('SELECT id, owner_id FROM ambs WHERE id = $1 AND owner_id = $2;', [req.params.ambId, req.body.userId])
        .then(owned => {
          return t.one('DELETE FROM sounds WHERE amb_id = $1 AND group_id = $2 AND sound_id = $3 RETURNING amb_id, group_id, sound_id;', [req.params.ambId, req.params.groupId, req.body.soundId])
        })
        .catch((error) => {
          console.log(error);
          console.log("User not owner");
          res.status(500).send("Something went wrong!");
        });
    })
      .then(result => {
        const resMessage = "Deleted " + result.amb_id + ":" + result.group_id + ":" + result.sound_id;
        console.log(resMessage);
        res.send({ message: resMessage });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Something went wrong!");
      });
  } else {
    console.log("bad input")
    res.status(500).send("Something went wrong!");
  }
});

module.exports = router;
