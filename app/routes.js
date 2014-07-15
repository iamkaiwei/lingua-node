var user = require('./controllers/api/v1/user');

exports = module.exports = function(app) {
  app.all('/oauth/token', app.oauth.grant());

  app.get('/secret', app.oauth.authorise(), function (req, res) {
    res.send('Secret area');
  });

  //front end
  app.get('/', function(req, res){
    res.render('index', {
      welcomeMsg: 'Hello Lingua!',
      currentUserId: req.session.user,
      facebookAppId: app.config.facebook_app_id
    });
  });

  // //user view
  // app.get('/users', user.list);
  // app.post('/users', user.post);
};