exports = module.exports = function(app) {
  app.db.models.oauth = require('./models/oauth');
  app.db.models.User = require('./models/user');
  app.db.models.OAuthClientsModel = require('./models/oauth_client');
  app.db.models.Message = require('./models/message');
};