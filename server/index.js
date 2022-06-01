const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");

const amb = require('./routes/ambs-route.js');

app.use(cors());

app.get("/", (req, res  ) => {
  console.log('GET /');
  res.send('Hello World!');
});

app.use('/amb', amb);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
