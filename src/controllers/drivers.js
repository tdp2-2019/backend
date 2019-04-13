var drivers_dao = require('../dao/drivers_dao')

drivers = function(app){

	app.get('/drivers', (req, res,err) => {
		var drivers = drivers_dao.get_all();
		if(drivers!=null && drivers.length>0){
			res.status(200).json(
				drivers
			);
		}else if(drivers.length == 0){
			res.status(404).json({
				errorCode: 1,
				message: "No data found"
			});			
		}else{
			res.status(500).json({
				errorCode: 1,
				message: "Server error"
			});
		}
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

  app.delete('/drivers/:id', (req, res, err) => {
    res.status(202).send({
      status: drivers_dao.delete(req.params.id)
    });
  });

}

module.exports = drivers;