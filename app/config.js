var env = require('./env.json');

exports = module.exports = function(app) {
  return env[app.get('env')];
};