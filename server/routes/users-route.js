const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/', (req, res, next) => {
  console.log('GET /users');
  db.any('SELECT id, username FROM users;')
    .then((userList) => {
      if(userList) {
        res.send(userList);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: 'Something went wrong!' });
    });
});

router.get('/:userId', (req, res, next) => {
  console.log('GET /users/'+req.params.userId);
  db.task(t => {
    return t.one('SELECT id, username FROM users WHERE id = $1;', [req.params.userId])
      .then((userData) => {
        return t.any('SELECT ambs.id AS id, name, users.username AS owner_name FROM ambs JOIN users ON users.id = ambs.owner_id WHERE owner_id = $1;', [userData.id])
          .then((ambData) => {
            return {
              name: userData.username,
              ambs: ambData,
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send({ message: 'Something went wrong!' });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong!' });
      });
  })
    .then((dataObj) => {
      if(dataObj) {
        res.send(dataObj);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: 'Something went wrong!' });
    });
});

module.exports = router;
