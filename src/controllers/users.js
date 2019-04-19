var users_dao = require('../dao/users_dao')

users = function(app){
  
  app.get('/users', (req, res) => {
    users_dao.get_all().then(users => {
      if(users != null && users.length > 0){
        res.status(200).json(users);
      }else if(users != null && users.length == 0){
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
  
  app.get('/users/:id', (req, res, err) => {
      users_dao.get(req.params.id).then(user => {
        if(user != null){
          res.status(200).json(user);
        }else if(user == null){
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
  
  app.post('/users', (req, res, err) => {
    users_dao.create(req.body).then(user => {
      if(user != null){
          res.status(200).json(user);
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
  
  app.put('/users/:id', (req, res, err) => {
    users_dao.update(req.params.id,req.body).then(user =>{
      if(user != null){
        res.status(200).json(user);
      }else if(user == null){
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

  app.delete('/users/:id', (req, res, err) => {
    users_dao.delete(req.params.id).then(user =>{
      if(user != null){
        res.status(200).json(user);
      }else if(user == null){
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

module.exports = users;