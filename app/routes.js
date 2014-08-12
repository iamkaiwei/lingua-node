var users = require('./controllers/api/v1/users'),
  conversations = require('./controllers/api/v1/conversations'),
  messages = require('./controllers/api/v1/messages'),
  languages = require('./controllers/api/v1/languages');

exports = module.exports = function(app) {
  app.all('/oauth/token', app.oauth.grant());

  //front end
  app.get('/', function(req, res){
    res.render('index', {
      welcomeMsg: 'Hello Lingua!',
      facebookAppId: app.config.facebook_app_id
    });
  });

  //user
  app.get('/api/v1/users', app.oauth.authorise(), users.list);
  app.get('/api/v1/users/me', app.oauth.authorise(), users.me);
  app.get('/api/v1/users/match', app.oauth.authorise(), users.match);
  app.get('/api/v1/users/:user_id', app.oauth.authorise(), users.show);
  app.put('/api/v1/users/:user_id', app.oauth.authorise(), users.update);
  app.post('/api/v1/users/send_notification', app.oauth.authorise(), users.sendNotification);
  app.post('/api/v1/upload', app.oauth.authorise(), users.upload);

  // like & block
  app.post('/api/v1/users/:user_id/like', app.oauth.authorise(), users.like);
  app.post('/api/v1/users/:user_id/flag', app.oauth.authorise(), users.flag);
  app.post('/api/v1/users/:user_id/unlike', app.oauth.authorise(), users.unlike);
  app.post('/api/v1/users/:user_id/unflag', app.oauth.authorise(), users.unflag);

  // app.post('/api/v1/users/:user_id/toggleLike', app.oauth.authorise(), users.toggleLike);
  // app.post('/api/v1/users/:user_id/toggleBlock', app.oauth.authorise(), users.toggleBlock);

  //conversation
  app.get('/api/v1/conversations', app.oauth.authorise(), conversations.list);
  app.get('/api/v1/conversations/offline_conversations', app.oauth.authorise(), conversations.getOfflineConversations);
  app.post('/api/v1/conversations', app.oauth.authorise(), conversations.create);
  app.put('/api/v1/conversations/:conversation_id/swap_role', app.oauth.authorise(), conversations.swapRole);

  //message
  app.get('/api/v1/conversations/:conversation_id/messages', app.oauth.authorise(), messages.list);
  app.post('/api/v1/conversations/:conversation_id/messages', app.oauth.authorise(), messages.create);

  //language
  app.get('/api/v1/languages', languages.list);
};
