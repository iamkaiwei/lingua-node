var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationsSchema = new Schema({
  teacher_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  learner_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  lastest_update: { type: Date },
  created_at: { type: Date, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: 'messages' }]
});

ConversationsSchema.pre('save', function(next){
  this.lastest_update = new Date().toISOString();
  next();
});

mongoose.model('conversations', ConversationsSchema);
var ConversationsModel = mongoose.model('conversations');
module.exports = ConversationsModel;