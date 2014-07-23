var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrementId = require('./../utilities/auto-increment-id');

var LanguageProficienciesSchema = new Schema({
  _id: { type: Number },
  name: { type: String, required: true }
});

mongoose.model('language_proficiencies', LanguageProficienciesSchema);
var LanguageProficienciesModel = mongoose.model('language_proficiencies');

LanguageProficienciesSchema = autoIncrementId(LanguageProficienciesSchema, LanguageProficienciesModel);

module.exports = LanguageProficienciesModel;