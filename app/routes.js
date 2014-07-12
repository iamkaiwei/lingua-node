var user = require('./controllers/api/v1/user');

exports = module.exports = function(app) {
  //front end
  app.get('/', function(req, res){
    res.render('index', {welcomeMsg: 'Hello Lingua!'});
  });

  //user view
  app.get('/users', user.list);
  app.post('/users', user.post);
};