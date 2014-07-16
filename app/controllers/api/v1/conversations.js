/**
 * List all conversations
 * @return {Array} conversations
 */

exports.list = function(req, res){
  res.app.db.models.Conversation.find({}, function(err, conversations){
   res.json(conversations); 
  });
};

/**
 * Create new conversation
 * @return {String}     conversationId
 */
exports.create = function(req, res){
  var newConversation = new res.app.db.models.Conversation();
  newConversation.teacher_id = req.body.teacher_id;
  newConversation.learner_id = req.body.learner_id;
  newConversation.save(function (err) {
    res.send(err || newConversation.id);
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