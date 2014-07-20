/**
 * List latest conversations of current user
 * @return {Array} conversations
 */
exports.list = function(req, res){
  res.app.db.models.User.findById(
    req.user.id,
    function(err, user){
      res.app.db.models.Conversation
        .find({ '_id': {$in: user.conversations} })
        .sort({ lastest_update: -1})
        .populate({
          path: 'messages',
          options: { limit: 5 }
        })
        .exec(function(err, conversations){
          res.json(conversations);
        });
    });
};

/**
 * Create new conversation
 * @param {String} teacher_id
 * @param {String} learner_id
 * @return {JSON} conversation
 */
exports.create = function(req, res){
  var b = req.body;

  new res.app.db.models.Conversation({
    teacher_id: b.teacher_id,
    learner_id: b.learner_id
  }).save(function(err, conversation){
    res.app.db.models.User.update(
      {
        $or: [
          { _id: b.teacher_id },
          { _id: b.learner_id }
        ]
      },
      { $push: {conversations: conversation._id} },
      { multi: true },
      function(err, numberAffected, raw){
        res.send(conversation);
      });
  });
};

/**
 * Swap role in one conversation
 * @param {String} conversation_id
 * @return {JSON} conversation
 */
exports.swapRole = function(req, res){
  res.app.db.models.Conversation.findById(req.params.conversation_id, function(err, conversation){
    var temp = conversation.teacher_id;
    conversation.teacher_id = conversation.learner_id;
    conversation.learner_id = temp;

    conversation.save(function(err, doc){
      res.send(doc);
    });
  });
};