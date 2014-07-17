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
