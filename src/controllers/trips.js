var trips_dao = require('../dao/trips_dao')

trips = function(app){
  
  app.get('/trips', (req, res) => {
    res.status(200).send({
      trips: trips_dao.get_all()
    });
  });
  
  app.get('/trips/:id', (req, res) => {
    res.status(200).send({
      trips: trips_dao.get(req.params.id)
    });
  });
  
  app.post('/trips/', (req, res) => {
    res.status(201).send({
      trips: trips_dao.create(req.body)
    });
  });
  
  app.put('/trips/:id', (req, res) => {
    res.status(202).send({
      trips: trips_dao.update(req.params.id)
    });
  });
  
  
}

module.exports = trips;