var drivers_dao = require('../dao/drivers_dao')

drivers = function(app){

  app.get('/drivers', (req, res) => {
     res.status(200).send({
      drivers: JSON.stringify(drivers_dao.get_all())
    	});
  });
  

  app.get('/drivers/:id', (req, res, err) => {
    res.status(200).send({
      driver: JSON.stringify(drivers_dao.get(req.params.id))
    });
  });
  
  app.post('/drivers', (req, res, err) => {
    res.status(201).send({
      driver: JSON.stringify(drivers_dao.create(req.body))
    });
  });
  
  app.put('/drivers/:id', (req, res, err) => {
    res.status(202).send({
      status: drivers_dao.update(req.params.id,req.body)
    });
  });

}

module.exports = drivers;