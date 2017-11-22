'use strict';

// setting environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// initialize monitoring

// GT dependencies
var config = require('config');

var path = require('path');
var basePath = process.env.PROJECT_ROOT || process.env.PWD || '.';
var helpers = require(basePath + '/helpers');
var express = require('express');
var http = require('http');
var util = require('util');
var responseTime = require('response-time');
var bodyParser = require('body-parser');

var requestLogger = helpers.Logger('app');

var app = express();

app.set('env', process.env.NODE_ENV);
app.set('port', process.env.PORT);
app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all('*', requestLogger.appRequestLogger);
app.use(responseTime(requestLogger.appResponseLogger));

var shutdownServer = function() {
  util.log("Initializing shutdown");
  util.log("Exiting...");
  process.exit(0);
};

process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);
process.on('SIGHUP', shutdownServer);
process.on('SIGQUIT', shutdownServer);
process.on('SIGTSTP', shutdownServer);

process.on('uncaughtException', function(err) {
  requestLogger.error("Uncaught Exception Caught: " + err.name + ":" + err.message);
  requestLogger.error("Stacktrace: " + err.stack);
  throw err;
});

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function() {
  util.log("Booting server in " + app.get('env') + " mode");
  util.log("Express server listening on port " + app.get('port'));
});
