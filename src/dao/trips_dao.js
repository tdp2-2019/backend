Trip = require('../models/trip')
var trips = [];

var trips_dao = module.exports = {
  
  create : function(body) {
    var id = trips.length + 1;
    var trip = new Trip(id, body.client, body.driver, body.source, body.destination, body.start_time, body.pets);
    trips.push(trip);
    return trip;
  },
  
  update: function(body) {
    
  },
  
  get: function(id) {
    var a_trip;
    trips.forEach(trip => {
      if (trip.id == id) {
        a_trip = trip;
      }
    });
    return a_trip;
  },
  
  get_all: function() {
    return trips;
  },

}
