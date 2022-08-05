const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

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

router.put('/:userId', checkJwt, (req, res, next) => {
  console.log(`PUT /users/`+req.params.userId);
  db.task(t => {
    return t.one('SELECT username FROM users WHERE id = $1 AND sub = $2;', [req.params.userId, req.auth.payload.sub])
      .then((user) => {
        if(user.username == req.body.newUsername) {
          res.send(user);
        } else {
          return t.none('SELECT username FROM users WHERE username = $1;', [req.body.newUsername])
            .then(() => {
              return t.one('UPDATE users SET username = $1 WHERE id = $2 RETURNING username;', [req.body.newUsername, req.params.userId])
                .then((newUser) => {
                  if(newUser) {
                    console.log(`Updated user ${req.params.userId} username from '${user.username}' to '${newUser.username}'`);
                    res.send(newUser);
                  }
                })
                .catch((error) => {
                  console.log(error, 'Could not update');
                  res.status(500).send({ message: 'Could not update username!' });
                });
            })
            .catch((error) => {
              console.log(error, 'Could not update - username taken');
              res.status(500).send({ message: 'Could not update - username taken' });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'Not permitted!' });
      });
  });
});

module.exports = router;
