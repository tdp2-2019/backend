const express = require("express");

const app = express();

app.get('/ping', (req, res) => {
  res.status(200).send({
    success: 'true'
  })
});

require('./src/controllers/trips')(app);
require('./src/controllers/users')(app);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
