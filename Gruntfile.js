var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/lingua_development');

var User = require('./app/models/user')
  , Conversation = require('./app/models/conversation')
  , OAuthClientsModel = require('./app/models/oauth_client')
  , MessageType = require('./app/models/message_type')
  , Language = require('./app/models/language');

module.exports = function(grunt) {
  grunt.registerTask('db-reset', function() {
    //invoke async mode
    var done = this.async();

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

              done();
            });
          });
        });
      });
    });
  });

  grunt.registerTask('db-seed', function() {
    var done = this.async();

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
        done(false);
    })
    .then(
      function() {
        console.log('Inserted all message types');
        return Language.create(require('./sample_data/languages.json'));
      },
      function(err) {
        console.log(err);
        done(false);
    })
    .then(
      function() {
        console.log('Inserted all languages');
        done();
      },
      function(err) {
        console.log(err);
        done(false);
    });
  });

  grunt.registerTask('db-seed-samples', function() {
    var done = this.async();

    User.create(require('./sample_data/users.json'))
    .then(
      function() {
        console.log('Inserted all users');
        return Conversation.create(require('./sample_data/conversations.json'));
      },
      function(err) {
        console.log(err);
        done(false);
    })
    .then(
      function() {
        console.log('Inserted all conversations');
        done();
      },
      function(err) {
        console.log(err);
        done(false);
    });
  });
};