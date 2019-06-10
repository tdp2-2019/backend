var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase-config");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://correapp-76bda.firebaseio.com"
});

console.log(serviceAccount.type)

var notifications_utils = module.exports = {
  send: function(device_id, title, message, driver_id, trip_id) {
    var payload = {
      notification: {
        click_action: ".activities.ChoferViewTripActivity",
        title: title,
        body: message        
      },
      data: {
        type: 'viajeAsignado',
        driverId: driver_id.toString(),
        tripId: trip_id.toString()
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
