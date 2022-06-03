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

module.exports = router;
