var admin = require("firebase-admin");
var serviceAccount = require("../../correapp-76bda-firebase-adminsdk-3n0j7-80c2921b2f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://correapp-76bda.firebaseio.com"
});

var notifications_utils = module.exports = {
  send: function(device_id, title, message, driver_id, trip_id) {
    var payload = {
      notification: {
        title: title,
        body: message,
        type: 'viajeAsignado',
        driverId: driver_id,
        tripId: trip_id
      }
    }
    admin.messaging().sendToDevice(device_id, payload)
    .then(function(response) {
      console.log('Successfully sent message:', response);
    })
    .catch(function(error) {
      console.log('Error sending message:', error);
    });
  }

}
