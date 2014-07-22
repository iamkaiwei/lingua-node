var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessagesSchema = new Schema({
  conversation_id: { type: Schema.Types.ObjectId, ref: 'conversations', required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  message_type_id: { type: Number, ref: 'message_types', required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

mongoose.model('messages', MessagesSchema);
var MessagesModel = mongoose.model('messages');
module.exports = MessagesModel;