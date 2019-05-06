const express = require("express");
const bodyParser = require('body-parser');
const cron = require("node-cron");
var assign_driver_util = require('./src/utils/assign_driver_util')
var cors = require('cors');
const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
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

