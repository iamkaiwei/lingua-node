var https = require('https')
  , bl = require('bl');

/**
 * List all users
 * @return {Array} users
 */
exports.list = function(req, res){
  res.app.db.models.User.find({}, 'firstname lastname email gender avatar_url level', function(err, users){
    res.send(users);
  });
};

/**
 * Login with Facebook
 * @param {String} facebook_token
 * @return {JSON} user
 */
exports.post = function(req, res){
  var b = req.body;

  https.get('https://graph.facebook.com/me?access_token=' + b.facebook_token, function(response){
    response.pipe(bl(function(err, data){
      var fbProfile = JSON.parse(data.toString());

      res.app.db.models.User.findOne({facebook_id: fbProfile.id}, function(err, user){
        if (!user) {
          new res.app.db.models.User({
            firstname: fbProfile.first_name,
            lastname: fbProfile.last_name,
            email: fbProfile.email,
            gender: fbProfile.gender,
            facebook_id: fbProfile.id,
            avatar_url: "https://graph.facebook.com/" + fbProfile.id + "/picture?type=large"
          }).save(function(err, user){
            if (!err) {
              res.send(user);
            } else {
              res.send(500, err.message);
            }
          });
        } else {
          res.send(user);
        }
      });
    }));
  }).on('error', function(e){
    res.send(500, e.message);
  });
};