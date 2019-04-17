Driver = require('../models/driver')
var drivers = [];

var drivers_dao = module.exports = {
  
  create : function(body) {
    return new Promise(resolve =>{
      var id = drivers.length + 1;
      var driver = new Driver(id, body.DNI, body.name, body.lastName, body.userName,body.email,
      body.telephone,body.celphone,body.address,body.brand,body.model,body.licenseNumber,body.insurancePolicyNumber,
      body.startWorkTime,body.endWorkTime,body.carLicensePlate,body.carColour );
      drivers.push(driver);
      resolve(driver);
    });    
  },
  
  update: function(id,body) {
    return new Promise(resolve =>{
      var response = null;
      drivers.forEach(driver => {
        if (driver.id == id) {
          driver.DNI = body.DNI ? body.DNI : driver.DNI;
          driver.name = body.name ? body.name : driver.name;
          driver.lastName = body.lastName ? body.lastName : driver.lastName;
          driver.userName = body.userName ? body.userName : driver.userName;
          driver.email = body.email ? body.email : driver.email;
          driver.telephone = body.telephone ? body.telephone : driver.telephone;
          driver.celphone = body.celphone ? body.celphone : driver.celphone;
          driver.address = body.address ? body.address : driver.address;
          driver.brand = body.brand ? body.brand : driver.brand;
          driver.model = body.model ? body.model : driver.model;
          driver.licenseNumber = body.licenseNumber ? body.licenseNumber : driver.licenseNumber;
          driver.insurancePolicyNumber = body.insurancePolicyNumber ? body.insurancePolicyNumber : driver.insurancePolicyNumber;
          driver.startWorkTime = body.startWorkTime ? body.startWorkTime : driver.startWorkTime;
          driver.endWorkTime = body.endWorkTime ? body.endWorkTime : driver.endWorkTime;
          driver.carColour = body.carColour ? body.carColour : driver.carColour;
          driver.carLicensePlate = body.carLicensePlate ? body.carLicensePlate : driver.carLicensePlate;
          response = driver;
        }
      });
      resolve(response);
    });
    
  },
  
  get: function(id) {
    return new Promise(resolve =>{
      var a_driver;
      drivers.forEach(driver => {
        if (driver.id == id) {
          a_driver = driver;
        }
      });
      resolve(a_driver);
    });

    
  },
  
  get_all: function() {
    return new Promise(resolve =>{
        resolve(drivers);
    });
  },

  delete: function(id){
    return new Promise(resolve =>{
      var eliminado = drivers.splice(id - 1,1);
      resolve(eliminado.length>0?eliminado:null);
    });
  },

}