const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', (req, res, next) => {
  if(req.query.user && Number.isInteger(parseInt(req.query.user))) {
    console.log(`GET /directory/?user=${req.query.user}`);
    db.any('SELECT ambs.id, name, username AS owner_name FROM ambs JOIN users ON ambs.owner_id = users.id WHERE ambs.owner_id = $1;', [req.query.user])
      .then((ambInfo) => {
        console.log('Success');
        res.send(ambInfo);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ message: 'Something went wrong!' });
      });
  } else {
    console.log(`GET /directory`);
    db.any('SELECT ambs.id, name, username AS owner_name FROM ambs JOIN users ON ambs.owner_id = users.id;')
      .then((ambInfo) => {
        console.log('Success');
        res.send(ambInfo);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ message: 'Something went wrong!' });
      });
    }
});

module.exports = router;
