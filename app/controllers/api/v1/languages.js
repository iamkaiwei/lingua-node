/**
 * List all languages
 * @return {Array} languages
 */
exports.list = function(req, res){
  res.app.db.models.Language.find(
    {},
    {
      __v: 0
    },
    function(err, languages){
      if (!err) {
        res.send(languages);
      } else {
        res.send(500, err);
      }
    });
};