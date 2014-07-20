/**
 * Get history of a conversation
 * @param {Number} conversation_id
 * @param {Number} length
 * @param {Number} page
 * @return {Array} messages
 */
exports.list = function(req, res){
  var q = req.query,
    length = q.length || 2,
    page = q.page || 1;

  res.app.db.models.Conversation.findById(
    req.params.conversation_id,
    function(err, conversation){
      res.app.db.models.Message
        .find({ '_id': {$in: conversation.messages} })
        .skip(length*(page - 1))
        .limit(length)
        .sort({ created_at: -1 })
        .exec(function(err, messages){
          res.json(messages);
        });
    });
};

/**
 * Create new message
 * @return {JSON} message
 */
exports.create = function(req, res){
  var newMessage = new res.app.db.models.Message(),
    b = req.body,
    p = req.params;

  newMessage.conversation_id = p.conversation_id;
  newMessage.sender_id = b.sender_id;
  newMessage.message_type_id = b.message_type_id;
  newMessage.content = b.content;

  newMessage.save(function(err, message){
    if (!err) {
      req.app.db.models.Conversation.findById(
        p.conversation_id,
        function(err, conversation){
          conversation.messages.push(message._id);
          conversation.save(function(){
            res.send(message);
          });
        });
    }
  });
};