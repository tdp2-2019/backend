Trip = require('../models/trip')
var polyUtil = require('polyline-encoded');
var SqlString = require('sqlstring');
var rating_calculator = require('../utils/rating_calculator');
var util = require('util');
var drivers_dao = require('../dao/drivers_dao');
var tripRates;
var notifications_utils = require('../utils/notifications_utils');
const request = require('request');
const connect = require('../utils/database');
const trip_utils =require('../utils/trip_utils');


var trips_dao = module.exports = {
  
  create : function(body) {
    var source_lat = body.source.lat;
    var source_long = body.source.long;
    var destination_lat = body.destination.lat;
    var destination_long = body.destination.long;
    return this.get_waypoints(source_lat, source_long, destination_lat, destination_long).then(response => {
      var trip = new Trip(body.client, body.source, body.destination, body.start_time, body.pets);
      trip._points = response.points;
      trip._duration = response.duration;
      var price = trip_utils.getPrice(body.pets.length,
                  body.companion,
                  trip_utils.distFrom(body.source.lat,body.source.long,body.destination.lat,body.destination.long)/1000 ,
                  trip._duration/60,body.start_time,tripRates);
      trip.calculate_price(trip.start_time, trip._points, trip._duration);
      return new Promise(function(resolve, reject) {
        connect().
        query('INSERT INTO trips (source, destination, start_time, pets, status, rejecteds, price, points, duration, client, companion, times_without_driver_answer, timeouts, user_id,currentposition)' +
              ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
              [body.source, body.destination, body.start_time, body.pets, 'created', [], price, trip._points, trip._duration, trip.client, body.companion, 0, 0, body.client_id, body.currentposition], (err, res) =>{
          if (err) {
            console.log("Unexpected database error: " + err);
            resolve(null);
          }
          if (res) {
            if (res.rows.length > 0){
              var trip_id = res.rows[0].id;
              var port = process.env.PORT || 5000;
              request('http://localhost:' + port + '/trips/' + trip_id + '/drivers', {json: true}, (err, res, body) => {
                if (body) {
                  var driver_id = body[0].driverId;
                  connect().query('SELECT firebase_id FROM drivers WHERE id = $1', [driver_id], (err, res) => {
                    if (err) {
                      console.log("Error getting firebase_id from driver. " + err);
                    }
                    var firebase_id = res.rows[0].firebase_id;
                    if (firebase_id) {
                      notifications_utils.send(firebase_id, "Nuevo viaje disponible!", "Hola! Tenes un nuevo viaje disponible para tomar!", driver_id, trip_id);
                    }
                    else {
                      console.log("Driver " + driver_id + " does not have firebase id");
                    }
                  });
                }
              });
              res.rows[0].current_position = trip_utils.calculate_position(trip.start_time, trip._points, trip._duration);
              
              resolve(res.rows[0]);
            } else {
              resolve([]);
            }
          }
        });
      });
    });
  },
  
  update: function(id, body) {
    return new Promise(resolve => {
      var rejection = body.rejection;
      if (body.rejection && body.rejection.driver_id) {
        connect().query('INSERT INTO rejected_trips (driver_id, trip_id, comment) VALUES ($1, $2, $3)', [rejection.driver_id, id, rejection.comment], (err, res) => {
          if (err) {
            console.log("Unexpected insert error in rejected trips. " + err);
            resolve(err);
          }
          connect().query('SELECT * FROM trips WHERE id = $1', [id], (err, res) => {
            if (err) {
              console.log("Error getting trip for update driver. " + err);
            }
            var trip = res.rows[0];
            connect().query('SELECT * FROM rejected_trips WHERE trip_id = $1', [id], (err, res) => {
              if (err) {
                console.log("Error getting rejected trips to update driver");
              }
              var rejections = res.rows.length;
              if (trip.timeouts + rejections <= 2) {
                var port = process.env.PORT || 5000;
                request('http://localhost:' + port + '/trips/' + trip.id + '/drivers', {json: true}, (err, res, body) => {
                  var next_driver = body[trip.timeouts + rejections].driverId;
                  connect().query('UPDATE trips SET driver_id = $1, times_without_driver_answer = $2 WHERE id = $3', [next_driver, 0, id], (err, res) => {
                    if (err) {
                      console.log("Error assigning driver for a trip because of a rejection. " + err);
                    }
                    connect().query('SELECT firebase_id FROM drivers WHERE id = $1', [next_driver], (err, res) => {
                      if (err) {
                        console.log("Error getting the firebase_id from driver " + next_driver + ". " + err);
                      }
                      var firebase_id = res.rows[0].firebase_id;
                      if (firebase_id) {
                        notifications_utils.send(firebase_id, "Nuevo viaje disponible!", "Hola! Tenes un nuevo viaje disponible para tomar!", next_driver, id);
                      }
                      else {
                        console.log("Driver " + next_driver + " does not have firebase id");
                      }
                    });
                  });
                });
              } else {
                connect().query('UPDATE trips SET status = $1 WHERE id = $2', ['Aborted', id], (err, res) => {
                  if (err) {
                    console.log("Error putting aborted status to a trip");
                  }
                  //Enviar aca la notificacion al user de que el viaje no se pudo concretar, que intente mas tarde.
                });
              }
            });
          });
        });
      }
      if (body.rejection && body.rejection.driver_id || body.driver_rating && body.driver_rating.rating) {
        connect().query('SELECT * FROM trips WHERE id = $1', [id], (err, res_trip) => {
          if (err) {
            console.log("Unexpected insert error in rejected trips. " + err);
            resolve(err);
          }
          if (res_trip.rowCount != 0) {
            var driver_id = (rejection !== undefined )? rejection.driver_id : res_trip.rows[0].driver_id;
            connect().query('SELECT * FROM trips WHERE driver_id = $1', [driver_id], (err, driver_trips) => {
              if (err) {
                console.log("Unexpected error in calculate driver rating. " + err);
                resolve(err);
              }
              if(driver_trips) {
                connect().query('SELECT * FROM rejected_trips WHERE driver_id = $1', [driver_id], (err, driver_rejected) => {
                  if (err) {
                    console.log("Unexpected error in calculate driver rating. " + err);
                    resolve(err);
                  }
                  if (driver_rejected) {
                    rating_calculator.driver_rating(driver_trips.rows, driver_rejected.rows.length).then(driver_rating => {
                      connect().query('UPDATE drivers SET rating = $1 WHERE id = $2', [driver_rating, driver_id], (err, res) => {
                        if (err) {
                          console.log("Unexpected error in calculate driver rating. " + err);
                          resolve(err);
                        } else {
                          console.log("Driver rating updated.");
                        }
                      });
                    });
                  }
                });
              }
            });
          } else {
            resolve(null);
          }
        });
      }
      delete body.rejection;
      if (Object.keys(body).length) {
        if (body.driver_rating) {
          body.driver_rating = JSON.stringify(body.driver_rating);
        }
        if (body.user_rating) {
          body.user_rating = JSON.stringify(body.user_rating);
        }
        if (body.currentposition) {
          body.currentposition = JSON.stringify(body.currentposition);
        }
        var sql = SqlString.format('UPDATE trips SET ? WHERE id = ?', [body, id]).replace(/\\/g, "");
        sql = sql.replace(/`/g, "") + ' RETURNING *';
        console.log(sql)
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
      } else {
        resolve(body);
      }
    });
  },
  
  get: function(id) {
    return new Promise(resolve =>{
      connect().query('SELECT * FROM trips WHERE id = $1', [id], (err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(err);
        } else if (res) {
          if (res.rows.length > 0){
            res.rows[0].current_position = trip_utils.calculate_position(res.rows[0].start_time, res.rows[0].points, res.rows[0].duration)
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
        var sql = SqlString.format('SELECT * FROM trips WHERE ?', [querystring]);
        query = sql.replace(/`/g, "").replace(/,/g, " AND");
      } else {
        query = 'SELECT * FROM trips';
      }
      console.log(query)
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
  
  get_waypoints: function(source_lat, source_long, destination_lat, destination_long) {
    return new Promise(resolve => {
      var origin = source_lat + ',' + source_long;
      var destination = destination_lat + ',' + destination_long;
      var points = [];
      var response = {
        points: [],
        duration: 0
      }
      request('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&sensor=false&key=AIzaSyArscBswf0kBzkOnj7LmSktzPSE0zmi830',
      {json: true}, (err, res, body) => {
        body.routes[0].legs.forEach(leg => {
          response.duration += leg.duration.value;
          list_of_points = leg.steps.forEach(step =>{
            var decoded_points = polyUtil.decode(step.polyline.points);
            decoded_points.forEach(point => {
              response.points.push(point);
            });
          });
        });
        resolve(response);
      });
    });
  },

  delete: function(id){
    return new Promise(resolve => {
      connect().query('DELETE FROM trips where id = $1 RETURNING *', [id],(err, res) => {
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

  get_drivers_by_score: function(id){
    return new Promise(resolve =>{
        connect().query('SELECT * FROM trips WHERE id = $1', [id], (err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(err);
        } else if (res) {
          if (res.rows.length > 0){
            drivers_dao.get_all({active:"S",status:"Confirmado"}).then(drivers =>{
              //para poder hacer el forEach
              drivers=Object.keys(drivers).map(
              function(key){
                  return drivers[key];
                }
              );
              res.rows[0].current_position = trip_utils.calculate_position(res.rows[0].start_time, res.rows[0].points, res.rows[0].duration)
              var orderedDrivers = trip_utils.get_drivers_by_score(id,res.rows[0].source,drivers);
              resolve(orderedDrivers);
            });
          } else {
            resolve(null);
          }
        }
      });
    });
  },

  get_rejects: function(id){
     return new Promise(resolve =>{
        connect().query('SELECT * FROM rejected_trips WHERE trip_id = $1', [id], (err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
          resolve(err);
        } else if (res.rows != null) {
          if (res.rows.length > 0){
              resolve(res.rows);
          } else {
            resolve(null);
          }
        }
      });
    });
  },

  init: function(){
    connect().query('SELECT animalrate, companion, km, min, nighttimeend, nighttimestart, nightrate, idzona FROM rates WHERE idzona = 1;', (err, res) => {
        if (err) {
          console.log("Unexpected database error: " + err);
        } else if (res.rows != null) {
          if (res.rows.length > 0){
            console.log(res.rows);
            tripRates = res.rows[0];
          } else {
            //default
            tripRates = { animalrate: '50',
                          companion: '100',
                          km: '25',
                          min: '5',
                          nighttimeend: '06:00:00',
                          nighttimestart: '18:00:00',
                          nightrate: '50',
                          idzona: 1 
                        };
          }
        }
    });
  },


}
