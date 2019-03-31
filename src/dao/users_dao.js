User = require('../models/user')
var users = [];

var users_dao = module.exports = {
  
  create : function(body) {
    var id = users.length + 1;
    var user = new User(id, body.DNI, body.name, body.lastName, body.userName,body.email,
    body.telephone,body.celphone,body.address);
    users.push(user);
    return user;
  },
  
  update: function(body) {
    var response="error";
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
        response = "OK";
      }
    });
    return response;
  },
  
  get: function(id) {
    var a_user;
    users.forEach(user => {
      if (user.id == id) {
        a_user = user;
      }
    });
    return a_user;
  },
  
  get_all: function() {
    return users;
  },

}