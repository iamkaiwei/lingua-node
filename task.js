var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/lingua_development');

var User = require('./app/models/user')
  , Conversation = require('./app/models/conversation')
  , OAuthClientsModel = require('./app/models/oauth_client')
  , MessageType = require('./app/models/message_type')
  , Language = require('./app/models/language')
  , LanguageProficiency = require('./app/models/language_proficiency');

module.exports.resetDatabase = function(callback) {
  User.collection.remove(function() {
    console.log("Empty users collection");

    Conversation.collection.remove(function() {
      console.log("Empty conversations collection");
      
      OAuthClientsModel.collection.remove(function() {
        console.log("Empty oauth_clients collection");

        MessageType.collection.remove(function() {
          console.log("Empty message_types collection");

          Language.collection.remove(function() {
            console.log("Empty languages collection");

            LanguageProficiency.collection.remove(function() {
              console.log("Empty language_proficiencies collection");
              callback();
            });
          });
        });
      });
    });
  });
};

module.exports.seedDatabase = function(callback) {
  OAuthClientsModel.create({
    clientId: 'lingua-ios',
    clientSecret: 'l1n9u4',
    redirectUri: '/oauth/redirect'
  })
  .then(
    function() {
      console.log('Inserted all clients');
      return MessageType.create(require('./sample_data/message_types.json'));
    },
    function(err) {
      console.log(err);
      callback(false);
  })
  .then(
    function() {
      console.log('Inserted all message types');
      return Language.create(require('./sample_data/languages.json'));
    },
    function(err) {
      console.log(err);
      callback(false);
  })
  .then(
    function() {
      console.log('Inserted all languages');
      return LanguageProficiency.create(require('./sample_data/language_proficiencies.json'));
    },
    function(err) {
      console.log(err);
      callback(false);
  })
  .then(
    function() {
      console.log('Inserted all language proficiencies');
      callback();
    },
    function(err) {
      console.log(err);
      callback(false);
  });
};

module.exports.seedSamples = function(callback) {
  User.create(require('./sample_data/users.json'))
  .then(
    function() {
      console.log('Inserted all users');
      return Conversation.create(require('./sample_data/conversations.json'));
    },
    function(err) {
      console.log(err);
      callback(false);
  })
  .then(
    function() {
      console.log('Inserted all conversations');
      callback();
    },
    function(err) {
      console.log(err);
      callback(false);
  });
};