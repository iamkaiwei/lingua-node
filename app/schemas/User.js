var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validate = require('mongoose-validator').validate;

var userSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  gender: { type: Boolean },
  facebook_id: { type: String, required: false },
  avatar_url: String,
  created_at: { type: Date, default: Date.now },
}, { autoIndex: true });

exports = module.exports = mongoose.model('users', userSchema);