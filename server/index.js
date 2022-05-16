const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

app.get("/", (req, res) => {
  console.log('GET /');
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
