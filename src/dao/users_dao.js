User = require('../models/user')
const connect = require('../utils/database');
var SqlString = require('sqlstring');

var users = [];

var users_dao = module.exports = {
  
  create : function(body) {
    return new Promise(resolve => {
      connect().
      query('INSERT INTO users (name, dni, lastname, email, telephone, celphone, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [body.name, body.dni, body.lastname, body.email, body.telephone, body.celphone, body.address], (err, res) =>{
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(null);
        }
        if (res) {
          if (res.rows.length > 0){
            resolve(res.rows[0]);
          } else {
            resolve([]);
          }
        }
      });
    });
  },
   
  update: function(id, body) {
    return new Promise(resolve => {
      var sql = SqlString.format('UPDATE users SET ? WHERE id = ?', [body, id]);
      sql = sql.replace(/`/g, "") + 'RETURNING *';
      connect().query(sql, (err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(err);
        } else if (res) {
          if (res.rows.length > 0){
            resolve(res.rows[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  },
  
  get: function(id) {
    return new Promise(resolve => {
      connect().query('SELECT * FROM users WHERE id = $1', [id], (err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(err);
        } else if (res) {
          if (res.rows.length > 0){
            resolve(res.rows[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  },
  
  get_all: function() {
    return new Promise(resolve => {
      connect().query('SELECT * FROM users', (err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(err);
        } else if(res) {
          if (res.rows.length > 0) {
            resolve(res.rows);
          } else {
            resolve([]);
          }
        }
      });
    });
  },

  delete: function(id) {
    return new Promise(resolve => {
      connect().query('DELETE FROM users where id = $1 RETURNING *', [id],(err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(err);
        } else if (res) {
          if (res.rows.length > 0) {
            resolve(res.rows);
          } else {
            resolve(null);
          }
        }
      });
    });
  },
}
