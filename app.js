const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.status(200).send({
    success: ':)'
  })
});

require('./src/controllers/trips')(app);
require('./src/controllers/users')(app);
require('./src/controllers/drivers')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
