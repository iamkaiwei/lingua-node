/**
 * List all users
 * @return {Array} users
 */
exports.list = function(req, res){
  res.app.db.models.User.find(
    {},
    'firstname lastname email gender avatar_url level',
    function(err, users){
      res.send(users);
    });
};

exports.me = function(req, res){
  res.app.db.models.User.findById(
    req.user.id,
    'firstname lastname email gender avatar_url level',
    function(err, user){
      res.send(user);
    });
};

exports.update = function(req, res){
  res.app.db.models.User
    .findByIdAndUpdate(req.params.id, req.body, function(err, model){
      res.send(err || 200);
    });
};