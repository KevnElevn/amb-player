const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

router.get('/', checkJwt, (req, res, next) => {
  console.log(`GET /users/${req.auth.payload.sub}`);
  db.task(t => {
    return t.oneOrNone('SELECT id, username FROM users WHERE sub = $1', [req.auth.payload.sub])
      .then(user => {
        if(!user) {
          return t.one('INSERT INTO users (sub) VALUES ($1) RETURNING id, username', [req.auth.payload.sub])
            .then(newUser => {
              console.log('Created new user');
              return newUser;
            })
            .catch((error) => {
              console.log('Failed to create new user');
              console.log(error);
              res.status(500).send({ message: 'Something went wrong!' });
            });
        } else {
          return user;
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong!' });
      });
  })
    .then((userObj) => {
      if(userObj) {
        console.log(userObj);
        res.send(userObj);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: 'Something went wrong!' });
    });
});


module.exports = router;
