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
      res.send(users);
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
      res.send(user);
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
      res.send(user);
    });
};

/**
 * Match current user with an appropriate user
 * @return {Array} users
 */
exports.match = function(req, res){
  res.app.db.models.User.findById(
    req.user.id,
    function(err, currentUser){
      res.app.db.models.User.aggregate([
          // { $sort: {point:-1} },
          // { $group: {_id:'$gender', user:{$first:'$$ROOT'}} }
          
          { $match: {_id:{$ne:currentUser._id}} },
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
            // var chosenUser = {};
            // groups.forEach(function(group){
            //   group.user.point += currentUser.gender !== group._id ? 5 : 0;
            //   if (!chosenUser.point || chosenUser.point <= group.user.point)
            //     chosenUser = group.user;
            // });

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
            res.send(err);
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
  delete req.body.written_proficiency_id;
  delete req.body.spoken_proficiency_id;
  delete req.body.level;
  delete req.body.teacher_badges;
  delete req.body.learner_badges;

  res.app.db.models.User.findByIdAndUpdate(
    req.params.user_id,
    req.body,
    function(err, user){
      res.send(user);
    });
};

/**
 * Push notification
 */
exports.sendNotification = function(req, res){
  res.app.db.models.User.findById(
    req.body.user_id,
    'device_token',
    function(err, user){
      if (err) {
        res.send(404, "wrong user id");
      }

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
          res.send(200, 'Push success');
        },
        error: function(error){
          res.send(500, error);
        }
      });
    });
};