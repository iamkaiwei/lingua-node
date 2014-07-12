/**
 * [Require authentication] List all users
 * @return {Array} users
 */
exports.list = function(req, res){
  res.app.db.models.User.find({}, 'firstname lastname', function(err, users){
    res.send(users);
  });
};

/**
 * Create new user
 */
exports.post = function(req, res){

};