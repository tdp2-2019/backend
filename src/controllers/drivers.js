var drivers_dao = require('../dao/drivers_dao')

drivers = function(app){

	app.get('/drivers', (req, res,err) => {
		var drivers = drivers_dao.get_all();
		if(drivers!=null && drivers.length>0){
			res.status(200).json(drivers);
		}else if(drivers.length == 0){
			res.status(404).json({
				errorCode: 2,
				message: "No data found"
			});			
		}else{
			res.status(500).json({
				errorCode: 3,
				message: "Server error"
			});
		}
	});
  

  app.get('/drivers/:id', (req, res, err) => {
  	var driver = drivers_dao.get(req.params.id);
  	if(driver != null){
  		res.status(200).json(driver);
  	}else if(driver == null){
  		res.status(404).json({
				errorCode: 2,
				message: "No data found"
		});	
  	}else{
		res.status(500).json({
			errorCode: 3,
			message: "Server error"
		});
	}
  });
  
  app.post('/drivers', (req, res, err) => {
  	var driver = drivers_dao.create(req.body);
  	if(driver != null){
  		res.status(200).json(driver);
  	}else{
		res.status(500).json({
			errorCode: 3,
			message: "Server error"
		});
	}
  });
  
  app.put('/drivers/:id', (req, res, err) => {
  	var driver = drivers_dao.update(req.params.id,req.body);
	if(driver != null){
		res.status(200).json(driver);
	}else if(driver == null){
  		res.status(404).json({
				errorCode: 2,
				message: "No data found"
		});	
  	}else{
		res.status(500).json({
			errorCode: 3,
			message: "Server error"
		});
	}
  });

  app.delete('/drivers/:id', (req, res, err) => {
    var driver = drivers_dao.delete(req.params.id);
	if(driver != null){
		res.status(200).json(driver);
	}else if(driver == null){
  		res.status(404).json({
				errorCode: 2,
				message: "No data found"
		});	
  	}else{
		res.status(500).json({
			errorCode: 3,
			message: "Server error"
		});
	}
  });

}

module.exports = drivers;