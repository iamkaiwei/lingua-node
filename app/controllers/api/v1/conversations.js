/**
 * List latest conversations of current user
 * @return {Array} conversations
 */
exports.list = function(req, res){
  res.app.db.models.User.findById(
    req.user.id,
    function(err, currentUser){
      res.app.db.models.Conversation
        .find(
          { _id: {$in:currentUser.conversations} },
          {
            __v: 0,
            messages: {$slice:2}
          }
        )
        .sort({ lastest_update: -1 })
        .populate(
          'messages',
          {
            __v: 0,
            conversation_id: 0
          }
        )
        .populate(
          'teacher_id learner_id',
          'firstname lastname avatar_url'
        )
        .exec(function(err, conversations){
          if (!err) {
            res.json(conversations);
          } else {
            res.send(500, err);
          }
        });
    });
};

/**
 * List offline conversations of current user
 * @return {Array} conversations
 */
exports.getOfflineConversations = function(req, res){
  res.app.db.models.User.findById(
    req.user.id,
    function(err, currentUser){
      res.app.db.models.Conversation
        .find(
          {
            _id: {$in:currentUser.conversations},
            lastest_update: {$gt:currentUser.latest_online}
          },
          '_id'
        )
        .sort({ lastest_update: -1 })
        .exec(function(err, conversations){
          if (!err) {
            res.json(conversations);
          } else {
            res.send(500, err);
          }
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
  var workflow = new req.app.utility.Workflow(req, res),
    b = req.body;

  workflow.on('checkDuplicatedConversation', function(){
    res.app.db.models.Conversation.find(
    {
      $or: [
        {$and:[
            {teacher_id:b.teacher_id},
            {learner_id:b.learner_id}
          ]},
        {$and:[
            {teacher_id:b.learner_id},
            {learner_id:b.teacher_id}
          ]}
      ]
    },
    function(err, conversations){
      if (conversations.length) {
        return workflow.emit('response', 200, conversations[0]);
      } else {
        workflow.emit('createNewConversation');
      }
    });
  });

  workflow.on('createNewConversation', function(){
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
          if (!err) {
            return workflow.emit('response', 200, conversation);
          } else {
            return workflow.emit('exception', 500, err);
          }
        });
    });
  });

  workflow.emit('checkDuplicatedConversation');
};

/**
 * Swap role in one conversation
 * @param {String} conversation_id
 * @return {JSON} conversation
 */
exports.swapRole = function(req, res){
  res.app.db.models.Conversation.findById(
    req.params.conversation_id,
    function(err, conversation){
      var temp = conversation.teacher_id;
      conversation.teacher_id = conversation.learner_id;
      conversation.learner_id = temp;

      conversation.save(function(err, doc){
        if (!err) {
          res.send(doc);
        } else {
          res.send(500, err);
        }
      });
    });
};