/**
 * List all users
 * @return {Array} users
 */
exports.list = function(req, res){
  res.app.db.models.User.find({}, 'firstname lastname email gender avatar_url level', function(err, users){
    res.send(users);
  });
};