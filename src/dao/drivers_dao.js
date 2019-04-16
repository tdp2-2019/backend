Driver = require('../models/driver')
const connect = require('../utils/database');
var SqlString = require('sqlstring');

var drivers_dao = module.exports = {
  
  create : function(body) {
    return new Promise(resolve => {
      connect().
      query('INSERT INTO drivers (firstname, lastname, phone, cellphone, mail, dni, car_brand, car_model, car_color, car_license_plate, car_insurance, work_start_time, work_end_time)' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, to_timestamp($12), to_timestamp($13)) RETURNING *', [body.name, body.lastName, body.telephone, body.celphone, body.email, body.DNI, body.brand,
      body.model, body.carColour, body.carLicensePlate, body.insurancePolicyNumber, body.startWorkTime, body.endWorkTime], (err, res) => {
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
  
  get_all: function() {
    return new Promise(resolve =>{
      connect().query('SELECT * FROM drivers', (err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(err);
        } else if(res) {
          if (res.rows.length > 0) {
            resolve(res.rows);
          } else {
            resolve(null);
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