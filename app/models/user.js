var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
var https = require('https');
var bl = require('bl');

genderValidator = [
  validate({
    validator: 'isIn',
    arguments: ['male', 'female'],
    message: 'Gender should be male or female'
  })
];

var OAuthUsersSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  birthday: Date,
  avatar_url: String,
  facebook_id: { type: String, required: true },
  device_token: String,
  native_language_id: { type: Number, ref: 'languages' },
  written_proficiency_id: { type: Number, ref: 'language_proficiencies', default: 1 },
  spoken_proficiency_id: { type: Number, ref: 'language_proficiencies', default: 1 },
  learn_language_id: { type: Number, ref: 'languages' },
  introduction: String,
  point: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  teacher_badges: Number,
  learner_badges: Number,
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
            birthday: fbProfile.birthday,
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