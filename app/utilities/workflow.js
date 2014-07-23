exports = module.exports = function(req, res) {
  var workflow = new (require('events').EventEmitter)();
  
  workflow.on('exception', function(errorCode, err) {
    return workflow.emit('response', errorCode, err);
  });
  
  workflow.on('response', function(statusCode, data) {
    res.send(statusCode, data);
  });
  
  return workflow;
}