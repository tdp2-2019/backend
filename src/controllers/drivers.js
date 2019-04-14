var drivers_dao = require('../dao/drivers_dao')

drivers = function(app){

	app.get('/drivers', (req, res,err) => {
	 	drivers_dao.get_all().then(drivers =>{
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
   		}).catch(function (err) {
	        res.status(500).json({
	           "code":1,
	           "message":err.message
	        })
		}); 
	});
  

  app.get('/drivers/:id', (req, res, err) => {
  	 	drivers_dao.get(req.params.id).then(driver => {
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
	      	}).catch(function (err) {
		        res.status(500).json({
		           "code":1,
		           "message":err.message
		        })
      		});
  });
  
  app.post('/drivers', (req, res, err) => {
  	drivers_dao.create(req.body).then(driver => {
      if(driver != null){
          res.status(200).json(driver);
      }else{
        res.status(500).json({
          errorCode: 3,
          message: "Server error"
        });
      }
    }).catch(function (err) {
        res.status(500).json({
           "code":1,
           "message":err.message
        })
    }); 
  });
  
  app.put('/drivers/:id', (req, res, err) => {
  	drivers_dao.update(req.params.id,req.body).then(driver =>{
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
    }).catch(function (err) {
        res.status(500).json({
           "code":1,
           "message":err.message
        })
    }); 
  });

  app.delete('/drivers/:id', (req, res, err) => {
     drivers_dao.delete(req.params.id).then(driver =>{
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
    }).catch(function (err) {
        res.status(500).json({
           "code":1,
           "message":err.message
        })
    });
  });

}

module.exports = drivers;