var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/lingua_development');

var User = require('./app/models/user')
  , OAuthClientsModel = require('./app/models/oauth_client');

module.exports = function(grunt) {
  grunt.registerTask('db-reset', function() {
    //invoke async mode
    var done = this.async();

    User.collection.remove(function() {
      console.log("Empty users collection");

      OAuthClientsModel.collection.remove(function() {
        console.log("Empty oauth_clients collection");
        done();
      });
    });
  });

  grunt.registerTask('db-seed', function() {
    var done = this.async();

    User.create(require('./sample-data/users.json'))
    .then(
      function() {
        console.log('Inserted all users');
        return OAuthClientsModel.create({
          clientId: 'lingua-ios',
          clientSecret: 'l1n9u4',
          redirectUri: '/oauth/redirect'
        });
      },
      function(err) {
        console.log('Error: '+err.err);
        done(false);
    })
    .then(
      function() {
        console.log('Inserted all clients');
        done();
      },
      function(err) {
        console.log('Error: '+err.err);
        done(false);
    });
  });
};