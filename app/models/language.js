var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrementId = require('./../utilities/auto-increment-id');

var LanguagesSchema = new Schema({
  _id: { type: Number },
  name: { type: String, required: true }
});

mongoose.model('languages', LanguagesSchema);
var LanguagesModel = mongoose.model('languages');

LanguagesSchema = autoIncrementId(LanguagesSchema, LanguagesModel);

module.exports = LanguagesModel;