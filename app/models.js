exports = module.exports = function(app) {
  app.db.models.oauth = require('./models/oauth');
  app.db.models.User = require('./models/user');
  app.db.models.OAuthClientsModel = require('./models/oauth_client');
  app.db.models.Conversation = require('./models/conversation');
  app.db.models.Message = require('./models/message');
  app.db.models.MessageType = require('./models/message_type');
  app.db.models.Language = require('./models/language');
  app.db.models.LanguageProficiency = require('./models/language_proficiency');
};