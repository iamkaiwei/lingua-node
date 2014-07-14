//module dependencies.
var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , morgan  = require('morgan')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , errorhandler = require('errorhandler')
;

//create express app
var app = express(),
  server = http.createServer(app);

//setting
app.set('env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

//set environment variables
app.config = require('./app/config')(app);

//setup mongoose
app.db = mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/lingua_development');

//config data models
require('./app/models')(app);

//all environments
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "5up3rS3cr3tK3y"
}));

//route requests
require('./app/routes')(app);

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

//production only
if ('production' == app.get('env')) {
  app.enable('view cache');
}
//$ NODE_ENV=production node app.js
//or you can export them into your shell environment:
//$ export NODE_ENV=production
//$ node app.js

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});