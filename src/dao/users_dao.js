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