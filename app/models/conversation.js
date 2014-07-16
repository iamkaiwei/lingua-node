var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationModel = new Schema({
  teacher_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  learner_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  lastest_update: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: 'messages' }]
});

mongoose.model('conversations', ConversationModel);
var ConversationModel = mongoose.model('conversations');
module.exports = ConversationModel;