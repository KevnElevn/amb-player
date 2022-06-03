const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', (req, res, next) => {
  if(req.query.user && Number.isInteger(parseInt(req.query.user))) {
    console.log(`GET /browse/?user=${req.query.user}`);
    db.any('SELECT ambs.id, name, username AS owner_name FROM ambs JOIN users ON ambs.owner_id = users.id WHERE ambs.owner_id = $1;', [req.query.user])
      .then((ambInfo) => {
        res.send(ambInfo);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Something went wrong!");
      });
  } else {
    console.log(`GET /browse`);
    db.any('SELECT ambs.id, name, username AS owner_name FROM ambs JOIN users ON ambs.owner_id = users.id;')
      .then((ambInfo) => {
        res.send(ambInfo);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Something went wrong!");
      });
    }
});

module.exports = router;
