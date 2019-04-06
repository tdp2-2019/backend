var trips_dao = require('../dao/trips_dao')

trips = function(app){
  
  app.get('/trips', (req, res, err) => {
    res.status(200).send({
      trips: trips_dao.get_all()
    });
  });
  
  app.get('/trips/:id', (req, res, err) => {
    res.status(200).send({
      trips: trips_dao.get(req.params.id).to_json()
    });
  });
  
  app.post('/trips', (req, res, err) => {
    trips_dao.create(req.body).then(trip => {
      res.status(201).send({
        trip: trip.to_json()
      });
    });
  });
  
  app.put('/trips/:id', (req, res, err) => {
    res.status(202).send({
      trips: trips_dao.update(req.params.id)
    });
  });
  
  
}

module.exports = trips;