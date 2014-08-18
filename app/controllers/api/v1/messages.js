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

  res.app.db.models.Conversation
    .findById(
      req.params.conversation_id,
      {
        __v: 0
      }
    )
    .populate({
      path: 'messages',
      select: { __v: 0 },
      options: {
        skip: length*(page - 1),
        limit: length,
        sort: { created_at: -1 }
      }
    })
    .exec(function(err, conversation){
      res.app.db.models.Message.populate(
        conversation.messages,
        {
          path: 'message_type_id sender_id',
          select: 'name firstname lastname avatar_url'
        }, function (err, messages){
          res.send(messages);
        });
    });
};

/**
 * Create new message
 * @return {JSON} message
 */
exports.create = function(req, res){
  var b = req.body,
    p = req.params,
    messagesArray = JSON.parse(b.messages).map(function(message){
      message.conversation_id = p.conversation_id;
      return message;
    });

  res.app.db.models.Message.create(messagesArray, function(err){
    if (!err) {
      var messages = Array.prototype.slice.call(arguments, 0).slice(1);

      req.app.db.models.Conversation
        .findById(p.conversation_id)
        .populate('messages')
        .exec(function(err, conversation){
          conversation.messages = messages.reduce(function(previousValue, currentValue){
            var messageIsOldest = previousValue.every(function(element, index){
              if (currentValue.created_at > element.created_at) {
                previousValue.splice(index, 0, currentValue);
                return false;
              }
              return true;
            });

            if (messageIsOldest)
              previousValue.push(currentValue);

            return previousValue;
          }, conversation.messages);

          conversation.save(function(err, doc){
            res.send(doc);
          });
        });
    }
  });

  // var newMessage = new res.app.db.models.Message(),
  //   b = req.body,
  //   p = req.params;

  // newMessage.conversation_id = p.conversation_id;
  // newMessage.sender_id = b.sender_id;
  // newMessage.message_type_id = b.message_type_id;
  // newMessage.content = b.content;
  // newMessage.created_at = b.created_at;

  // newMessage.save(function(err, message){
  //   if (!err) {
  //     req.app.db.models.Conversation.findById(
  //       p.conversation_id,
  //       function(err, conversation){
  //         conversation.messages.unshift(message._id);
  //         conversation.save(function(){
  //           res.send(message);
  //         });
  //       });
  //   }
  // });
};