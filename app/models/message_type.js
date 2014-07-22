var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageTypesSchema = new Schema({
  _id: { type: Number }, //if set to 0, it's an auto-increment field
  name: { type: String, required: true }
});

mongoose.model('message_types', MessageTypesSchema);
var MessageTypesModel = mongoose.model('message_types');

MessageTypesSchema.pre('save', function(next){
  var self = this;
  MessageTypesModel
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .exec(function(err, types){
      if (self._id === 0)
        self._id = types[0] ? ++types[0]._id : 1;
      next();
    });
});

module.exports = MessageTypesModel;