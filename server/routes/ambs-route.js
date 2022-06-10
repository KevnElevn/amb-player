const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/:ambId', (req, res, next) => {
  console.log("GET /amb/"+req.params.ambId);
  db.task (async t => {
    let ambInfo = await t.one('SELECT name, owner_id, username AS owner_name FROM ambs JOIN users ON users.id = ambs.owner_id WHERE ambs.id = $1', [req.params.ambId]);
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
  if(req.body.groupId === -1 &&
    typeof req.body.groupName === 'string' &&
    Number.isInteger(req.body.interval.from) &&
    Number.isInteger(req.body.interval.to)
  ) {
    db.one('INSERT INTO groups(amb_id, name, interval_from, interval_to) VALUES ($1, $2, $3, $4) RETURNING group_id;',
    [req.params.ambId, req.body.groupName, req.body.interval.from, req.body.interval.to])
      .then((data) => res.send({ groupId: data.group_id }))
      .catch((error) => {
        console.log(error);
        res.status(500).send("Something went wrong!");
      });
  } else {
    res.status(500).send("Something went wrong!");
  }
});

router.post('/:ambId/:groupId', (req, res, next) => {
  if(req.body.soundId === -1 &&
    typeof req.body.soundName === 'string' &&
    typeof req.body.url === 'string' &&
    Number.isInteger(req.body.volume) &&
    Number.isInteger(req.body.start) &&
    Number.isInteger(req.body.end) &&
    Number.isInteger(req.body.chain.from) &&
    Number.isInteger(req.body.chain.to)
  ) {
    db.one('INSERT INTO sounds(amb_id, group_id, name, url, volume, time_start, time_end, chain_from, chain_to) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING sound_id;',
    [req.params.ambId, req.params.groupId, req.body.soundName, req.body.url, req.body.volume, req.body.start, req.body.end, req.body.chain.from, req.body.chain.to])
      .then((data) => res.send({ soundId: data.sound_id }))
      .catch((error) => {
        console.log(error);
        res.status(500).send("Something went wrong!");
      });
  } else {
    res.status(500).send("Something went wrong!");
  }
});

module.exports = router;
