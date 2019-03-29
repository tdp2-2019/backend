users = function(app){
  
  app.get('/users', (req, res) => {
    res.status(200).send({
      success: 'TO-DO'
    });
  });
  
}

module.exports = users;