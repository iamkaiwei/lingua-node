var users = require('./controllers/api/v1/users');

exports = module.exports = function(app) {
  app.all('/oauth/token', app.oauth.grant());

  //front end
  app.get('/', function(req, res){
    res.render('index', {
      welcomeMsg: 'Hello Lingua!',
      facebookAppId: app.config.facebook_app_id
    });
  });

  //user view
  app.get('/users', app.oauth.authorise(), users.list);
  app.get('/users/me', app.oauth.authorise(), users.me);
};