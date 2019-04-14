Trip = require('../models/trip')
var polyUtil = require('polyline-encoded');
const request = require('request');

var trips = [];

var trips_dao = module.exports = {
  
  create : function(body) {
    var id = trips.length + 1;
    var source_lat = body.source.lat;
    var source_long = body.source.long;
    var destination_lat = body.destination.lat;
    var destination_long = body.destination.long;
    return this.get_waypoints(source_lat, source_long, destination_lat, destination_long).then(response => {
      var trip = new Trip(id, body.client, body.driver, body.source, body.destination, body.start_time, body.pets);
      trip._points = response.points;
      trip._duration = response.duration;
      trip.calculate_price();
      trips.push(trip);
      return trip;
    });
  },
  
  update: function(id,body) {
     return new Promise(resolve =>{
        var response;
          trips.forEach(trip => {
          if (trip.id == id) {
            trip.client = body.client ? body.client : trip.client;
            trip.destination = body.destination ? body.destination : trip.destination;
            trip.start_time = body.start_time ? body.start_time : trip.start_time;
            trip.end_time = body.end_time ? body.end_time : trip.end_time;
            trip.driver_id = body.driver_id ? body.driver_id : trip.driver_id;
            trip.current_position = body.current_position ? body.current_position : trip.current_position;
            trip.status = body.status ? body.status : trip.status;
            if(body.rejection) trip.rejecteds.push(body.rejection);
            response = trip;
          }
          });
        resolve(response);
     });
  },
  
  get: function(id) {
    return new Promise(resolve =>{
      var a_t1rip;
      tr1ips.forEach(trip => {
        if (trip.id == id) {
          a_trip = trip;
          a_trip.current_position = trip.calculate_position();
        }
      });
      resolve(a_trip);
    });
  },
  
  get_all: function() {
    return new Promise(resolve =>{
      var json_trips = []
      trips.forEach(trip =>{
        json_trips.push(trip.to_json());
      });
      resolve(json_trips);
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
      var eliminado = trips.splice(id - 1,1);
      resolve(eliminado.length>0?eliminado:null);
    });
  },

}
