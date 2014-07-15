exports = module.exports = function(app) {
  app.db.models.User = require('./schemas/user');
};