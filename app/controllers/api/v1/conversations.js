/**
 * List latest conversations of current user
 * @return {Array} conversations
 */
exports.list = function(req, res){
  var currentUserId = req.user.id;

  res.app.db.models.User.findById(
    currentUserId,
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
          'firstname lastname avatar_url native_language_id learn_language_id likes flags'
        )
        .exec(function(err, conversations){
          if (!err) {
            conversations = JSON.parse(JSON.stringify(conversations)).map(function(c, i){
              var lastMessage = c.messages.pop();
              if (lastMessage && lastMessage.sender_id !== currentUserId){
                var lastestAccessOfCurrentUser = c.lastest_access[currentUserId];
                if (lastestAccessOfCurrentUser) {
                  c.have_new_messages = c.lastest_update > lastestAccessOfCurrentUser;
                } else {
                  c.have_new_messages = !!c.lastest_update;
                }
              } else {
                c.have_new_messages = false;
              }

              var partner = currentUserId === c.teacher_id._id ? c.learner_id : c.teacher_id;
              c.isLiked = !!~partner.likes.indexOf(currentUserId);
              c.isFlagged = !!~partner.flags.indexOf(currentUserId);

              return c;
            });

            res.app.db.models.Language.populate(
              conversations,
              {
                path: 'teacher_id.native_language_id teacher_id.learn_language_id learner_id.native_language_id learner_id.learn_language_id',
                select: 'name'
              }, function (err, conversations){
                res.json(conversations);
              });
          } else {
            res.send(500, err);
          }
        });
    });
};

/**
 * Leave conversation
 * @param {String} conversation_id
 * @return {JSON} conversation
 */
exports.leaveConversation = function(req, res){
  res.app.db.models.Conversation.findById(
    req.params.conversation_id,
    function(err, conversation){
      if (!err) {
        conversation.lastest_access[req.user.id] = new Date().toISOString();
        conversation.markModified('lastest_access');
        conversation.save(function(err, doc){
          res.send(doc);
        });
      } else {
        res.send(500, err);
      }
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
        workflow.emit('populateUser', conversations[0]);
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
      if (!err) {
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
              workflow.emit('populateUser', conversation);
            } else {
              return workflow.emit('exception', 500, err);
            }
          });
      } else {
        return workflow.emit('exception', 500, err);
      }
    });
  });

  workflow.on('populateUser', function(doc){
    res.app.db.models.Conversation.populate(
      doc,
      {
        path: 'teacher_id learner_id',
        select: 'firstname lastname avatar_url native_language_id learn_language_id'
      }, function (err, conversation){
        if (err) {
          return workflow.emit('exception', 500, err);
        } else {
          workflow.emit('populateLanguage', conversation);
        }
      });
  });

  workflow.on('populateLanguage', function(doc){
    res.app.db.models.Conversation.populate(
      doc,
      {
        path: 'teacher_id.native_language_id teacher_id.learn_language_id learner_id.native_language_id learner_id.learn_language_id',
        select: 'name',
        model: 'languages'
      }, function (err, conversation){
        if (err) {
          return workflow.emit('exception', 500, err);
        } else {
          return workflow.emit('response', 200, conversation);
        }
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
