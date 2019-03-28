const express = require("express");

const app = express();

app.get('/ping', (req, res) => {
  res.status(200).send({
    success: 'true'
  })
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
