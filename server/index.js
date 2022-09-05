if(process.env.NODE_ENV !== 'production')
  console.log(require('dotenv').config());
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');

const authRoute = require('./routes/auth-route.js');
const usersRoute = require('./routes/users-route.js');
const ambsRoute = require('./routes/ambs-route.js');
const directoryRoute = require('./routes/directory-route.js');
const favoritesRoute = require('./routes/favorites-route.js');

app.use(cors());
app.use(bodyParser.json());

app.use('/ambs', ambsRoute);
app.use('/users', usersRoute);
app.use('/directory', directoryRoute);
app.use('/favorites', favoritesRoute);
app.use('/auth', authRoute);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
