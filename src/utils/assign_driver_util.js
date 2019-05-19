const connect = require('../utils/database');
var notifications_utils = require('./notifications_utils');
const request = require('request');

var assign_driver_util = module.exports = {
  assign : function() {
    connect().query('SELECT * FROM trips WHERE status = $1', ['created'], (err, res) => {
      if (err) {
        console.log("Error getting trips to assign drivers." + err);
        return;
      }
      if (res.rows && res.rows.length > 0) {
        var trips = res.rows
        trips.forEach(trip => {
            var rejected_trips = 0;
            connect().query('SELECT id FROM rejected_trips WHERE trip_id = $1', [trip.id], (err, res) => {
              if (err) {
                console.log("Error getting rejected trips for trip " + trip.id + " - " + err);
              }
              rejected_trips = res.rows.length;
              if ((trip.timeouts + rejected_trips == 2 && trip.times_without_driver_answer == 4) || (trip.timeouts + rejected_trips == 3)) {
                connect().query('UPDATE trips SET status = $1, driver_id = $2 WHERE id = $3', ['Aborted', null, trip.id], (err, res) => {
                  if (err) {
                    console.log("Error setting status aborted to trip. " + err);
                  }
                  // Mandar notificacion al user avisandole que se aborto el viaje, que pruebe mas tarde.
                });
              } else {
                if (trip.times_without_driver_answer < 4) { //si todavia no pasaron 5 minutos del tiempo que tiene el chofer para contestar...
                  connect().query('UPDATE trips SET times_without_driver_answer = $1 WHERE id = $2', [trip.times_without_driver_answer + 1, trip.id], (err, res) => {
                    if (err) {
                      console.log("Error updating times_without_driver_answer. " + err);
                    }
                    return;
                  });
                } else {
                  var port = process.env.PORT || 5000;
                  request('http://localhost:' + port + '/trips/' + trip.id + '/drivers', {json: true}, (err, res, body) => {
                    //actualizo la cantidad de timeouts, me traigo el proximo driver y lo asigno guardandolo en la base. Y despues mando la notificacion.
                    if (err) {
                      console.log("Error getting the drivers list for trip " + trip.id + " - " + err);
                    }
                    if (body && typeof trip.timeouts !== 'undefined' && typeof rejected_trips !== 'undefined') {
                      var next_driver = body[trip.timeouts + rejected_trips + 1].driverId;
                      connect().query('UPDATE trips SET timeouts = $1, driver_id = $2, times_without_driver_answer = $3 WHERE id = $4', [trip.timeouts + 1, next_driver, 0, trip.id], (err, res) => {
                        if (err) {
                          console.log("Error updating number of timeous in trip " + trip.id + " - " + err);
                        }
                      });
                      connect().query('SELECT firebase_id FROM drivers WHERE id = $1', [next_driver], (err, res) => {
                        if (err) {
                          console.log("Error getting driver to send notification. " + err);
                        }
                        var firebase_id = res.rows[0].firebase_id;
                        if (firebase_id) {
                          notifications_utils.send(firebase_id, "Nuevo viaje disponible!", "Hola! Tenes un nuevo viaje disponible para tomar!", next_driver, trip.id);
                        } else {
                          console.log("The driver " + next_driver + " does not have firebase id to send notification");
                        }
                      });
                    }
                  });
                }
              }
            });
          });
        }
      });
    }
}
