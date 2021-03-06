User = require('../models/user')
const connect = require('../utils/database');
var SqlString = require('sqlstring');
var rating_calculator = require('../utils/rating_calculator');
var users = [];

var users_dao = module.exports = {
  
  create : function(body) {
    return new Promise(resolve => {
      connect().
      query('INSERT INTO users (name, dni, lastname, email, telephone, celphone, address, firebase_id, status, comment,photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11) RETURNING *',
            [body.name, body.dni, body.lastname, body.email, body.telephone, body.celphone, body.address, body.firebase_id, 'Habilitado', body.comment,body.photo_url], (err, res) =>{
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
          if (res.rows.length > 0) {
            resolve(res.rows[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  },

  get_all: function(querystring) {
    return new Promise(resolve => {
      var query = "";
      if (Object.keys(querystring).length) {
        var sql = SqlString.format('SELECT * FROM users WHERE ?', [querystring]);
        query = sql.replace(/`/g, "").replace(/,/g, " AND");;
      } else {
        query = 'SELECT * FROM users';
      }
      connect().query(query, (err, res) => {
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
  
  update_rating: function(user_id) {
    connect().query('SELECT * FROM trips where user_id = $1', [user_id], (err, res) => {
      if (err) {
        console.log("Unexpected error getting trips: " + err);
        return err;
      }
      var trips = res.rows;
      rating_calculator.user_rating(trips).then(rating => {
        connect().query('UPDATE users SET rating = $1 where id = $2', [rating, user_id], (err, res) => {
          if (err) {
            console.log('Unexpected error updating user rating. ' + err);
            return err;
          } else {
            console.log('User rating updated');
          }
        });
      });
    });
  }
}
