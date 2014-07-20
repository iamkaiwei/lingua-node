var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator').validate;
var https = require('https');
var bl = require('bl');

var OAuthUsersSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  gender: { type: String },
  birthday: Date,
  avatar_url: String,
  facebook_id: { type: String, required: true },
  device_token: { type: String },
  native_language_id: { type: Number },
  written_proficiency_id: Number,
  spoken_proficiency_id: Number,
  learn_language_id: Number,
  introduction: String,
  point: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  teacher_badges: { type: Number, default: 0 },
  learner_badges: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  conversations: [{ type: Schema.Types.ObjectId, ref: 'conversations' }]
});

OAuthUsersSchema.static('getUser', function(username, password, facebook_token, cb) {
  
  https.get('https://graph.facebook.com/me?access_token=' + facebook_token, function(response){
    response.pipe(bl(function(err, data){
      var fbProfile = JSON.parse(data.toString());

      OAuthUsersModel.findOne({facebook_id: fbProfile.id}, function(err, user){
        if (!user) {
          new OAuthUsersModel({
            firstname: fbProfile.first_name,
            lastname: fbProfile.last_name,
            email: fbProfile.email,
            gender: fbProfile.gender,
            avatar_url: "https://graph.facebook.com/" + fbProfile.id + "/picture?type=large",
            facebook_id: fbProfile.id
          }).save(function(err, user){
            if (!err) {
              cb(null, user.id);
            } else {
              cb(err);
            }
          });
        } else {
          cb(null, user.id);
        }
      });
    }));
  }).on('error', function(e){
    cb(e);
  });

});

mongoose.model('users', OAuthUsersSchema);
var OAuthUsersModel = mongoose.model('users');
module.exports = OAuthUsersModel;