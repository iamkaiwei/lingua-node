var task = require('./task');

module.exports = function(grunt) {
  grunt.registerTask('db-reset', function() {
    //invoke async mode
    var done = this.async();
    task.resetDatabase(done);
  });

  grunt.registerTask('db-seed', function() {
    var done = this.async();
    task.seedDatabase(done);
  });

  grunt.registerTask('db-seed-samples', function() {
    var done = this.async();
    task.seedSamples(done);    
  });
};