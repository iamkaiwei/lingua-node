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
        .find(
          { '_id': {$in: conversation.messages} },
          { __v: 0 }
        )
        .skip(length*(page - 1))
        .limit(length)
        .sort({ created_at: -1 })
        .populate('message_type_id', 'name')
        .exec(function(err, messages){
          if (!err) {
            res.json(messages);
          } else {
            res.send(500, err);
          }
        });
    });
};

/**
 * Create new message
 * @return {JSON} message
 */
exports.create = function(req, res){
  // var b = req.body,
  //   p = req.params,
  //   messagesArray = b.map(function(message){
  //     message.conversation_id = p.conversation_id;
  //     return message;
  //   });

  // res.app.db.models.Message.create(messagesArray, function(err){
  //   if (!err) {
  //     var messageIds = Array.prototype.slice.call(arguments, 0)
  //                       .slice(1)
  //                       .reverse()
  //                       .map(function(message){
  //                         return message._id;
  //                       });

  //     req.app.db.models.Conversation.findById(
  //       p.conversation_id,
  //       function(err, conversation){
  //         conversation.messages = messageIds.concat(conversation.messages);
  //         conversation.save(function(){
  //           res.send(conversation.messages);
  //         });
  //       });
  //   }
  // });

  var newMessage = new res.app.db.models.Message(),
    b = req.body,
    p = req.params;

  newMessage.conversation_id = p.conversation_id;
  newMessage.sender_id = b.sender_id;
  newMessage.message_type_id = b.message_type_id;
  newMessage.content = b.content;
  newMessage.created_at = b.created_at;

  newMessage.save(function(err, message){
    if (!err) {
      req.app.db.models.Conversation.findById(
        p.conversation_id,
        function(err, conversation){
          conversation.messages.unshift(message._id);
          conversation.save(function(){
            res.send(message);
          });
        });
    }
  });
};