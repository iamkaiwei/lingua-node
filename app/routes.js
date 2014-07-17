var users = require('./controllers/api/v1/users');
var conversations = require('./controllers/api/v1/conversations');
var messages = require('./controllers/api/v1/messages');

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
  app.get('/api/v1/users', app.oauth.authorise(), users.list);
  app.get('/api/v1/users/me', app.oauth.authorise(), users.me);
  app.put('/api/v1/users/:id', app.oauth.authorise(), users.update);
  app.get('/api/v1/users/:id', app.oauth.authorise(), users.getUserById);
  app.get('/api/v1/users/:id/get_all_conversations', app.oauth.authorise(), users.getAllConversations);
  app.get('/api/v1/users/:id/get_chat_history', app.oauth.authorise(), users.getChatHistory);

  // conversation
  app.get('/api/v1/conversations', app.oauth.authorise(), conversations.list);
  app.post('/api/v1/conversations', app.oauth.authorise(), conversations.create);
  app.put('/api/v1/conversations/:id', app.oauth.authorise(), conversations.update);
  app.post('/api/v1/conversations/:id/flag_conversation', app.oauth.authorise(), conversations.flag);
  app.post('/api/v1/conversations/:id/like_conversation', app.oauth.authorise(), conversations.like);

  // message
  app.post('/api/v1/messages', app.oauth.authorise(), messages.create);
};