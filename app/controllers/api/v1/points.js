/**
 * Increase point of current user
 * @return {JSON} user
 */
exports.increasePoint = function(req, res){
  res.app.db.models.User
    .findById(req.user.id)
    .exec(function(err, user){
      var now = new Date(),
        diff = Math.abs(now - user.latest_update_point)/36e5;

      if (!user.latest_update_point || diff > 24) {
        user.latest_update_point = now.toISOString();
        user.point += 2;
        user.save(function(err, user){
          res.send(200);
        });
      } else {
        res.send(500, {message: "You must wait " + (24 - diff) + " hours to increase point again"});
      }
    });
};