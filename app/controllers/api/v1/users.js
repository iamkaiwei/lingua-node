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
    'firstname lastname email gender birthday avatar_url level',
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
          // { $group: {_id:"$gender", point:{$max:"$point"}} }
          { $sort: {point:-1} },
          { $group: {_id:'$gender', user_id:{$first:'$_id'}, point:{$first:'$point'}} }
        ],
        function(err, users){
          users.forEach(function(user){
            user.point += currentUser.gender !== user._id ? 5 : 0;
          });

          res.send(users);
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