var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LanguageProficienciesSchema = new Schema({
  name: { type: String, required: true }
});

mongoose.model('language_proficiencies', LanguageProficienciesSchema);
var LanguageProficienciesModel = mongoose.model('language_proficiencies');
module.exports = LanguageProficienciesModel;