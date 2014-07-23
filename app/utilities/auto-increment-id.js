exports = module.exports = function(Schema, Model) {
  Schema.pre('save', function(next){
    var self = this;
    Model
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .exec(function(err, types){
        if (self._id === 0)
          self._id = types[0] ? ++types[0]._id : 1;
        next();
      });
  });

  return Schema;
}