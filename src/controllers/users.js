var users_dao = require('../dao/users_dao')

users = function(app){
  
  app.get('/users', (req, res) => {
     res.status(200).send({
      users: users_dao.get_all()
    });
  });
  
  app.get('/users/:id', (req, res, err) => {
    res.status(200).send({
      user: users_dao.get(req.params.id)
    });
  });
  
  app.post('/users', (req, res, err) => {
    res.status(201).send({
      user: users_dao.create(req.body)
    });
  });
  
  app.put('/users/:id', (req, res, err) => {
    res.status(202).send({
      status: users_dao.update(req.params.id)
    });
  });

  app.delete('/users/:id', (req, res, err) => {
    res.status(202).send({
      status: users_dao.delete(req.params.id)
    });
  });
}

module.exports = users;