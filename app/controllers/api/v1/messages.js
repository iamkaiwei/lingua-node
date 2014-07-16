/**
 * Create message
 * @return {ObjectId}     Message Id
 */
exports.create = function(req, res){
  var newMessage = new res.app.db.models.Message();
  newMessage.sender_id = req.body.sender_id;
  newMessage.conversation_id = req.body.conversation_id;
  newMessage.message_type_id = req.body.message_type_id;
  newMessage.content = req.body.content;
  newMessage.save(function (err) {
    res.send(err || newMessage.id);
  });
};