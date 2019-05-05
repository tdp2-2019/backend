var admin = require("firebase-admin");
var serviceAccount = require("google-services.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://correapp-76bda.firebaseio.com"
});

var notifications_utils = module.exports = {
  send: function(device_id, title, message) {
    var payload = {
      notification: {
        title: title,
        body: message
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
