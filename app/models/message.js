var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageModel = new Schema({
  sender_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  conversation_id: { type: Schema.Types.ObjectId, ref: 'conversations', required: true },
  message_type_id: { type: Number, required: true },
  content: {type: String, required: true},
  created_at: { type: Date, default: Date.now },
});

mongoose.model('messages', MessageModel);
var MessageModel = mongoose.model('messages');
module.exports = MessageModel;