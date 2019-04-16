Trip = require('../models/trip')
var polyUtil = require('polyline-encoded');
var SqlString = require('sqlstring');
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
      trip.calculate_price(trip.start_time, trip._points, trip._duration);
      return new Promise(function(resolve, reject) {
        connect().
        query('INSERT INTO trips (source, destination, start_time, pets, status, rejecteds, price, points, duration, client) VALUES ($1, $2, to_timestamp($3), $4, $5, $6, $7, $8, $9, $10) RETURNING *',
              [trip.source, trip.destination, trip.start_time, trip.pets, 'created', [], trip.price, trip._points, trip._duration, trip.client], (err, res) =>{
          if (err) {
            console.log("Unexpected database error: " + err);
            resolve(null);
          }
          if (res) {
            if (res.rows.length > 0){
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
        var response;
        var sql = SqlString.format('UPDATE trips SET ? WHERE id = ?', [body, id]);
        sql = sql.replace(/`/g, "") + 'RETURNING *';
        connect().query(sql, (err, res) => {
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
  
  get_all: function() {
    return new Promise(resolve => {
      connect().query('SELECT * FROM trips', (err, res) => {
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

}
