Driver = require('../models/driver')
const connect = require('../utils/database');
var SqlString = require('sqlstring');

var drivers_dao = module.exports = {
  
  create : function(body) {
    return new Promise(resolve => {
      connect().
      query('INSERT INTO drivers (name, lastname, telephone, celphone, email, dni, address, brand, model, licensenumber, carcolour,' +
       ' carlicenseplate, insurancepolicynumber, startworktime, endworktime, currentposition, signup_date, photo_url, car_plate_photo_url, firebase_id' +
       ' license_photo_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, to_timestamp($14), to_timestamp($15),$16, $17, $18, $19, $20, $21, $22) RETURNING *',
      [body.name, body.lastname, body.telephone, body.celphone, body.email, body.dni, body.address, body.brand, body.model, body.licensenumber,
        body.carcolour, body.carlicenseplate, body.insurancepolicynumber, body.startworktime, body.endworktime, body.currentPosition,
        body.signup_date, body.photo_url, body.car_plate_photo_url, body.license_photo_url, 'No confirmado', body.firebase_id], (err, res) => {
        if (err) {
          console.log("Unexpected database erro: " + err);
          resolve(null);
        }
        if (res) {
          if (res.rows.length > 0) {
            resolve(res.rows[0]);
          } else {
            resolve([]);
          }
        }
      });
    });
  },
  
  update: function(id, body) {
    return new Promise(resolve => {
      var sql = SqlString.format('UPDATE drivers SET ? WHERE id = ?', [body, id]);
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
    return new Promise(resolve =>{
      connect().query('SELECT * FROM drivers WHERE id = $1', [id], (err, res) => {
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
  
  get_all: function(querystring) {
    return new Promise(resolve =>{
      var query = "";
      if (Object.keys(querystring).length) {
        var sql = SqlString.format('SELECT * FROM drivers WHERE ?', [querystring]);
        query = sql.replace(/`/g, "").replace(/,/g, " AND");;
      } else {
        query = 'SELECT * FROM drivers';
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

  delete: function(id){
    return new Promise(resolve =>{
      connect().query('DELETE FROM drivers where id = $1 RETURNING *', [id],(err, res) => {
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