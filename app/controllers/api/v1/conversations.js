/**
 * List latest conversations of current user (show history)
 * @param {Number} from
 * @param {Number} length
 * @return {Array} conversations
 */

exports.list = function(req, res){
  var q = req.query;

  res.app.db.models.User.findById(
    req.user.id,
    function(err, user){
      res.app.db.models.Conversation
        .find({ '_id': {$in: user.conversations} })
        .skip(q.from - 1)
        .limit(q.length)
        .sort({ lastest_update: -1})
        .populate({
          path: 'messages',
          options: {limit: 10}
        })
        .exec(function(err, conversations){
          res.json(conversations);
        });
    });
};

/**
 * Create new conversation
 * @param {String} teacher_id
 * @param {String} learner_id
 * @return {JSON} conversation
 */
exports.create = function(req, res){
  var b = req.body;

  new res.app.db.models.Conversation({
    teacher_id: b.teacher_id,
    learner_id: b.learner_id
  }).save(function(err, conversation){
    res.app.db.models.User.update(
      {
        $or: [
          { _id: b.teacher_id },
          { _id: b.learner_id }
        ]
      },
      { $push: {conversations: conversation._id} },
      { multi: true },
      function(err, numberAffected, raw){
        res.send(conversation);
      });
  });
};

/**
 * Update conversation
 * @return {void}
 */
exports.update = function(req, res){
  // res.app.db.models.Conversation
  //   .findByIdAndUpdate(req.params.id, { 
  //     $set: { 
  //       teacher_id: req.body.teacher_id,
  //       learner_id: req.body.learner_id
  //     }
  //   }, function(err, model){
  //     res.send(err || 200);
  //   });
};

exports.flag = function(req, res){

};

exports.like = function(req, res){

};