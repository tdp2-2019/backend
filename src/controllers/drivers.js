var drivers_dao = require('../dao/drivers_dao')

drivers = function(app){

  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
  app.get('/drivers', (req, res) => {
     res.status(200).send({
      drivers: drivers_dao.get_all()
    	});
  });
  

  app.get('/drivers/:id', (req, res, err) => {
    res.status(200).send({
      driver: drivers_dao.get(req.params.id)
    });
  });
  
  app.post('/drivers', (req, res, err) => {
    res.status(201).send({
      driver: drivers_dao.create(req.body)
    });
  });
  
  app.put('/drivers/:id', (req, res, err) => {
    res.status(202).send({
      status: drivers_dao.update(req.params.id,req.body)
    });
  });

  app.delete('/drivers/:id', (req, res, err) => {
    res.status(202).send({
      status: drivers_dao.delete(req.params.id)
    });
  });

}

module.exports = drivers;
