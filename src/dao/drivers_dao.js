Driver = require('../models/driver')
var drivers = [];

var drivers_dao = module.exports = {
  
  create : function(body) {
    var id = drivers.length + 1;
    var driver = new Driver(id, body.DNI, body.name, body.lastName, body.userName,body.email,
    body.telephone,body.celphone,body.address,body.brand,body.model,body.licenseNumber,body.insurancePolicyNumber,
    body.startWorkTime,body.endWorkTime);
    drivers.push(driver);
    return driver;
  },
  
  update: function(body) {
    
  },
  
  get: function(id) {
    var a_driver;
    drivers.forEach(driver => {
      if (driver.id == id) {
        a_driver = driver;
      }
    });
    return a_driver;
  },
  
  get_all: function() {
    return drivers;
  },

}