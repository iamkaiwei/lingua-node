var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationsSchema = new Schema({
  teacher_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  learner_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  lastest_update: { type: Date },
  lastest_access: { type: Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: 'messages' }]
}, {
  toJSON: { minimize: false }
});

// ConversationsSchema.pre('save', function(next){
//   this.lastest_update = new Date().toISOString();
//   next();
// });

mongoose.model('conversations', ConversationsSchema);
var ConversationsModel = mongoose.model('conversations');
module.exports = ConversationsModel;