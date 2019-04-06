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
  
  update: function(body) {
    
  },
  
  get: function(id) {
    var a_trip;
    trips.forEach(trip => {
      if (trip.id == id) {
        a_trip = trip;
        a_trip.current_position = trip.calculate_position();
      }
    });
    return a_trip;
  },
  
  get_all: function() {
    var json_trips = []
    trips.forEach(trip =>{
      json_trips.push(trip.to_json());
    });
    return json_trips;
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

}
