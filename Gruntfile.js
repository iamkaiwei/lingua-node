var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/lingua_development');

var User = require('./app/schemas/user')

var models = require('./app/schemas');

module.exports = function(grunt) {
  grunt.registerTask('db-reset', function() {
    //invoke async mode
    var done = this.async();

    User.collection.remove(function() {
      console.log("Empty users collection");
      done();
    });
  });

  grunt.registerTask('db-seed', function() {
    var done = this.async();

    models.OAuthClientsModel.create({
      clientId: 'papers3',
      clientSecret: '123',
      redirectUri: '/oauth/redirect'
    }).then(function(){
      done();
    });

    // User.create(require('./sample-data/users.json'))
    // .then(
    //   function() {
    //     console.log('Inserted all users');
    //     done();
    //   },
    //   function(err) {
    //     console.log('Error: '+err.err);
    //     done(false);
    // });
  });
};