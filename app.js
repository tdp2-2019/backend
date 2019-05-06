const express = require("express");
const bodyParser = require('body-parser');
const cron = require("node-cron");
var assign_driver_util = require('./src/utils/assign_driver_util')
var cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Options, OPTIONS");
    res.header("Access-Control-Allow-Methods",  "GET, POST, PUT, OPTIONS");
    next();
});

app.get('/ping', (req, res) => {
  res.status(200).send({
    success: ':)'
  })
});

require('./src/controllers/trips')(app);
require('./src/controllers/users')(app);
require('./src/controllers/drivers')(app);

const PORT = process.env.PORT || 5000;

cron.schedule("* * * * *", function() {
      assign_driver_util.assign();
});


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});


app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    errorCode: 1,
    message: err.message
  });
});

