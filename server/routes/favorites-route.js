const express = require('express');
const router = express.Router();
const db = require('../db.js');
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: 'https://'+process.env.AUTH0_DOMAIN,
});

router.get('/:userId', (req, res, next) => {
  if(Number(req.params.userId) > 0) {
    console.log("GET favorites/"+req.params.userId);
    db.task(t => {
      return t.any('SELECT ambs.id AS id, name, username AS owner_name FROM favorites JOIN ambs ON favorites.amb_id = ambs.id JOIN users ON ambs.owner_id = users.id WHERE favorites.user_id = $1;', [req.params.userId]);
    })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong!' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});

//Create new favorite
router.post('/', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
    Number(req.body.ambId) > 0
  ) {
    db.task(t => {
      return t.one('SELECT id FROM users WHERE id = $1 AND sub = $2;', [req.body.userId, req.auth.payload.sub])
        .then(user => {
          return t.one('SELECT id FROM ambs WHERE id = $1;', [req.body.ambId])
            .then(amb => {
              return t.one('INSERT INTO favorites (user_id, amb_id) VALUES ($1, $2) RETURNING user_id, amb_id;', [user.id, amb.id]);
            })
            .catch((error) => {
              console.log(error);
              console.log("Amb not found");
              res.status(500).send({ message: 'Amb not found' });
            });
        })
        .catch((error) => {
          console.log(error);
          console.log("Invalid user");
          res.status(500).send({ message: 'Invalid user' });
        });
    })
      .then((newFavorite) => {
        if(newFavorite) {
          console.log(`User ${newFavorite.user_id} favorited Amb ${newFavorite.amb_id}`);
          res.send(newFavorite);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not create favorite');
        res.status(500).send({ message: 'Unable to save favorite' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});
//Delete favorite
router.delete('/', checkJwt, (req, res, next) => {
  if(Number(req.body.userId) > 0 &&
      Number(req.body.ambId) > 0
  ) {
    db.task(t => {
      return t.one('SELECT users.id AS user_id, favorites.amb_id AS amb_id FROM users JOIN favorites ON users.id = favorites.user_id WHERE favorites.amb_id = $1 AND users.id = $2 AND users.sub = $3;', [req.body.ambId, req.body.userId, req.auth.payload.sub])
        .then((favData) => {
          return t.one('DELETE FROM favorites WHERE user_id = $1 AND amb_id = $2 RETURNING user_id, amb_id;', [favData.user_id, favData.amb_id]);
        })
        .catch((error) => {
          console.log(error);
          console.log('Amb not found or user not owner');
          res.status(500).send({ message: 'Unable to unfavorite' });
        });
    })
      .then((result) => {
        if(result) {
          console.log(`Deleted favorite with user ${result.user_id} and Amb ${result.amb_id}`);
          res.send(result);
        }
      })
      .catch((error) => {
        console.log(error);
        console.log('Could not unfavorite');
        res.status(500).send({ message: 'Unable to unfavorite' });
      });
  } else {
    console.log("Bad input");
    res.status(500).send({ message: 'Bad input' });
  }
});

module.exports = router;
