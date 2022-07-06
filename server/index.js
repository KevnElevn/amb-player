const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');

const user = require('./routes/users-route.js');
const amb = require('./routes/ambs-route.js');
const browse = require('./routes/browse-route.js');

app.use(cors());
app.use(bodyParser.json());

app.use('/user', user);
app.use('/amb', amb);
app.use('/browse', browse);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
