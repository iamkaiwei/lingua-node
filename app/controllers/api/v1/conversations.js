/**
 * List latest conversations of current user (show history)
 * @param {Number} from
 * @param {Number} length
 * @return {Array} conversations
 */

exports.list = function(req, res){
  var q = req.query;

  res.app.db.models.User.findById(
    req.user.id,
    function(err, user){
      res.app.db.models.Conversation
        .find({ '_id': {$in: user.conversations} })
        .skip(q.from - 1)
        .limit(q.length)
        .sort({ lastest_update: -1})
        .populate({
          path: 'messages', 
          options: {limit: 10}
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
 * @return {String} conversationId
 */
exports.create = function(req, res){
  var newConversation = new res.app.db.models.Conversation();
  newConversation.teacher_id = req.body.teacher_id;
  newConversation.learner_id = req.body.learner_id;
  newConversation.save(function(err){
    if (!err) {
      // add this conversation to teacher user
      req.app.db.models.User.findById(req.body.teacher_id, function(err1, user){
        console.log(user);
        user.conversations.push(newConversation._id);
        user.save();
      });

      // add this conversation to learner user
      req.app.db.models.User.findById(req.body.learner_id, function(err1, user){
        user.conversations.push(newConversation._id);
        user.save();
      });
    }

    res.send(err || newConversation);
  });
};

/**
 * Update conversation
 * @return {void}
 */
exports.update = function(req, res){
  res.app.db.models.Conversation
    .findByIdAndUpdate(req.params.id, { 
      $set: { 
        teacher_id: req.body.teacher_id,
        learner_id: req.body.learner_id
      }
    }, function(err, model){
      res.send(err || 200);
    });
};

exports.flag = function(req, res){

};

exports.like = function(req, res){

};