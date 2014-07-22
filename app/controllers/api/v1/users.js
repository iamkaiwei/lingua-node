/**
 * List all users
 * @return {Array} users
 */
exports.list = function(req, res){
  res.app.db.models.User.find(
    {},
    {
      __v: 0,
      conversations: 0
    },
    function(err, users){
      if (!err) {
        res.send(users);
      } else {
        res.send(500, err);
      }
    });
};

/**
 * Get current user
 * @return {JSON} user
 */
exports.me = function(req, res){
  res.app.db.models.User.findById(
    req.user.id,
    {
      __v: 0,
      conversations: 0
    },
    function(err, user){
      if (!err) {
        res.send(user);
      } else {
        res.send(500, err);
      }
    });
};

/**
 * Get one user
 * @param {String} user_id
 * @return {JSON} user
 */
exports.show = function(req, res){
  res.app.db.models.User.findById(
    req.params.user_id,
    {
      __v: 0,
      conversations: 0
    },
    function(err, user){
      if (!err) {
        res.send(user);
      } else {
        res.send(500, err);
      }
    });
};

/**
 * Match teacher for current user
 * @return {Array} users
 */
exports.match = function(req, res){
  res.app.db.models.User.findById(
    req.user.id,
    function(err, currentUser){
      res.app.db.models.User.aggregate([
          { $match: {
            $and: [
              {_id:{$ne:currentUser._id}},
              (function(threshold){
                if (threshold)
                  return {point:{$lt:+threshold}};
                else
                  return {}
              })(req.query.threshold)
            ]
          } },
          { $sort: {point:-1} },
          { $group: {_id:'$gender', users:{$push:{
            firstname: '$firstname',
            lastname: '$lastname',
            gender: '$gender',
            avatar_url: '$avatar_url',
            point: '$point',
            level: '$level'
          }}} }
        ],
        function(err, groups){
          if (!err) {
            var topUsers = groups
              .reduce(function(previousValue, currentValue){
                currentValue.users = currentValue.users.slice(0, 5).map(function(user){
                  user.point += currentUser.gender !== currentValue._id ? 5 : 0;
                  return user;
                });
                return previousValue.concat(currentValue.users);
              }, [])
              .sort(function(a, b){
                if (a['point'] < b['point'])
                   return 1;
                if (a['point'] > b['point'])
                  return -1;
                return 0;
              });

            res.send(topUsers);
          } else {
            res.send(500, err);
          }
        });
    });
};

/**
 * Update one user
 * @return {JSON} user
 */
exports.update = function(req, res){
  //protected fields
  delete req.body.facebook_id
  delete req.body.written_proficiency_id;
  delete req.body.spoken_proficiency_id;
  delete req.body.point;
  delete req.body.level;
  delete req.body.teacher_badges;
  delete req.body.learner_badges;

  res.app.db.models.User.findByIdAndUpdate(
    req.params.user_id,
    req.body,
    function(err, user){
      if (!err) {
        res.send(user);
      } else {
        res.send(500, err);
      }
    });
};

/**
 * Update point/level of one user
 * @return {JSON} user
 */
exports.requestUpdate = function(req, res){
  //server will calculate point/level
};

/**
 * Push notification
 */
exports.sendNotification = function(req, res){
  res.app.db.models.User.findById(
    req.body.user_id,
    'device_token',
    function(err, user){
      if (err)
        res.send(404);

      var query = new Parse.Query(Parse.Installation);
      query.equalTo('deviceToken', user.device_token);
       
      Parse.Push.send({
        where: query,
        data: {
          alert: req.body.message
        }
      },
      {
        success: function(){
          res.send(200);
        },
        error: function(error){
          res.send(500, error);
        }
      });
    });
};