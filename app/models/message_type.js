var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrementId = require('./../utilities/auto-increment-id');

var MessageTypesSchema = new Schema({
  _id: { type: Number }, //if set to 0, it's an auto-increment field
  name: { type: String, required: true }
});

mongoose.model('message_types', MessageTypesSchema);
var MessageTypesModel = mongoose.model('message_types');

MessageTypesSchema = autoIncrementId(MessageTypesSchema, MessageTypesModel);

module.exports = MessageTypesModel;