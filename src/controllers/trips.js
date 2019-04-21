var trips_dao = require('../dao/trips_dao')

trips = function(app){
  
  app.get('/trips', (req, res, err) => {
    trips_dao.get_all().then(trips =>{
      if (trips!=null && trips.length>0) {
        res.status(200).json(trips);
      } else if (trips.length == 0) {
        res.status(404).json({
          errorCode: 2,
          message: "No data found"
        });
      } else {
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
  
  app.get('/trips/:id', (req, res, err) => {
      trips_dao.get(req.params.id).then(trip => {
        if(trip != null){
          res.status(200).json(trip);
        }else if(trip == null){
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
  
  app.post('/trips', (req, res, err) => {
    trips_dao.create(req.body).then(trip => {
      if(trip != null){
          res.status(200).json(trip);
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
  
  app.put('/trips/:id', (req, res, err) => {
    trips_dao.update(req.params.id,req.body).then(trip =>{
      if(trip != null){
        res.status(200).json(trip);
      }else if(trip == null){
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
  
  app.delete('/trips/:id', (req, res, err) => {
    trips_dao.delete(req.params.id).then(trip =>{
      if(trip != null){
        res.status(200).json(trip);
      }else if(trip == null){
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
  
  app.get('/trips/:id/drivers', (req, res, err) => {
    trips_dao.get_drivers_by_score(req.params.id).then(drivers =>{
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

  app.get('/trips/:id/rejects', (req, res, err) => {
    trips_dao.get_rejects(req.params.id).then(rejects =>{
      if(rejects != null){
        res.status(200).json(rejects);
      }else if(rejects == null){
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

module.exports = trips;