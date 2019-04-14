User = require('../models/user')
var users = [];

var users_dao = module.exports = {
  
  create : function(body) {
    return new Promise(resolve => {
      var id = users.length + 1;
      var user = new User(id, body.DNI, body.name, body.lastName, body.userName,body.email,
      body.telephone,body.celphone,body.address);
      users.push(user);
      resolve(user);
    });
  },
  
  update: function(id,body) {
    return new Promise(resolve => {
      var response;
      users.forEach(user => {
        if (user.id == id) {
          user.DNI = body.DNI ? body.DNI : user.DNI;
          user.name = body.name ? body.name : user.name;
          user.lastName = body.lastName ? body.lastName : user.lastName;
          user.userName = body.userName ? body.userName : user.userName;
          user.email = body.email ? body.email : user.email;
          user.telephone = body.telephone ? body.telephone : user.telephone;
          user.celphone = body.celphone ? body.celphone : user.celphone;
          user.address = body.address ? body.address : user.address;
          response = user;
        }
      });
      resolve(response);
    });
   
  },
  
  get: function(id) {
    return new Promise(resolve => {
      var a_user;
      users.forEach(user => {
        if (user.id == id) {
          a_user = user;
        }
      });
      resolve(a_user);
    });    
  },
  
  get_all: function() {
    return new Promise(resolve => {
      resolve(users);
    });
  },

  delete: function(id){
    return new Promise(resolve => {
      var eliminado = users.splice(id - 1,1);
      resolve(eliminado.length>0?eliminado:null);
    });

  },

}