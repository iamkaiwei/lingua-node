var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LanguagesSchema = new Schema({
  name: { type: String, required: true }
});

mongoose.model('languages', LanguagesSchema);
var LanguagesModel = mongoose.model('languages');
module.exports = LanguagesModel;