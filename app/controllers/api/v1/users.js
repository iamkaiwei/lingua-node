/**
 * List all users
 * @return {Array} users
 */
exports.list = function(req, res){
  res.app.db.models.User.find(
    {},
    // {
    //   __v: 0,
    //   conversations: 0
    // },
    function(err, users){
      res.send(users);
    });
};

exports.me = function(req, res){
  res.app.db.models.User.findById(
    req.user.id,
    
    function(err, user){
      res.send(user);
    });
};

exports.update = function(req, res){
  // protected fields
  delete req.body.level;
  delete req.body.learner_badges;
  delete req.body.teacher_badges;
  delete req.body.written_proficiency_id;
  delete req.body.spoken_proficiency_id;

  res.app.db.models.User
    .findByIdAndUpdate(req.params.id, req.body, function(err, model){
      res.send(err || 200);
    });
};

exports.getUserById = function(req, res){
  res.app.db.models.User.findById(req.params.id,
    'firstname lastname email gender avatar_url level',
    function(err, user){
      res.send(user);
    });
};

exports.getAllConversations = function(req, res){
  res.app.db.models.User
  .findById(req.params.id, 'conversations')
  .populate({
    path: 'conversations', 
    select: '_id learner_id teacher_id created_at lastest_update'
  })
  .exec(function(err, user){
   res.send(user.conversations || []);
  });
};

exports.getChatHistory = function(req, res){
  var fromUserId = req.params.id,
        toUserId = req.query.to_user;

  res.app.db.models.Conversation
  .findOne({
    $or: [
      { teacher_id: fromUserId, learner_id: toUserId }, 
      { teacher_id: toUserId, learner_id: fromUserId }
    ]
  }, 'messages')
  .populate({
    path: 'messages', 
    select: '_id content message_type_id sender_id created_at',
    options: { sort: [{created_at: -1}] }
  })
  .exec(function(err, conversation){
   res.send(conversation.messages || []);
  });
};

exports.sendNotification = function(req, res){
  var Parse = require('parse').Parse;
  Parse.initialize(res.app.config.parse_app_id, res.app.config.parse_javascript_key);

  // get device token
  res.app.db.models.User.findById(req.body.user_id, 'device_token', function(err, user){
    if (err) {
      res.send(404, "wrong user id");
    };

    var query = new Parse.Query(Parse.Installation);
    query.equalTo('deviceToken', user.device_token);
     
    Parse.Push.send({
      where: query,
      data: {
        alert: req.body.message
      }
    },
    {
      success: function() {
        res.send(200, 'Push success');
      },
      error: function(error) {
        res.send(500, error);
      }
    });
  });
};
