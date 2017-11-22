'use strict';

var util = require('util');
var fs = require('fs');
var path = require('path');

var basePath = process.env.PROJECT_ROOT || process.env.PWD || '.';
var DateTimeHelper = require('./date_time_helper');

var defaultLogFile = basePath + '/logs/' + (process.env.NODE_ENV || 'development') + ".log";
var defaultFileId = fs.openSync(defaultLogFile, 'a', 0o777);

var Logger = function(pref, logFile) {
  pref = pref ? path.parse(pref).name : 'NOP';
  logFile = logFile ? (basePath + "/logs/" + logFile) : defaultLogFile;
  var prefix = '[' + pref.toUpperCase() + ']';
  var infoPrefix = ' ' + prefix + '[INFO] ';
  var warnPrefix = ' ' + prefix + '[WARN] ';
  var debugPrefix = ' ' + prefix + '[DEBUG] ';
  var errorPrefix = ' ' + prefix + '[ERROR] ';
  var stackPrefix = ' ' + prefix + '[STACK] ';

  var fileId = null;
  if(logFile) {
    fileId = fs.openSync(logFile, 'a', 0o777);
  } else {
    fileId = defaultFileId;
  }

  var log = function(prefix, message) {
    message = DateTimeHelper.toString() + prefix + message + '\r\n';
    fs.write(fileId, message, null, 'utf8');
  };

  var logger = {

    isDebugEnabled: function() {
      return (process.env.NODE_ENV === 'development' ) || (process.env.DEBUG === 'true');
    },

    info: function(message, env) {
      if(!env || (process.env.NODE_ENV) === env) {
        log(infoPrefix, (message || 'No message'));
      }
    },

    warn: function(message, env) {
      if(!env || (process.env.NODE_ENV) === env) {
        log(warnPrefix, (message || 'No message'));
      }
    },

    debug: function(message) {
      if(logger.isDebugEnabled()) {
        log(debugPrefix, (message || 'No message'));
      }
    },

    error: function(err) {
      if(!(err instanceof Error)) {
        return logger.info(err);
      }
      log(errorPrefix, (err.message || 'Error'));
      if(logger.isDebugEnabled()) {
        log(stackPrefix, err.stack);
      }
    },

    appRequestLogger: function(req, res, next) {
      logger.info("Started " + req.method + " " + req.originalUrl + " for " + req.ip);
      logger.info("Params: " + JSON.stringify(req.body || {}));
      next();
    },

    appResponseLogger: function(req, res, time) {
      logger.info("Completed " + res.statusCode + " for " + req.method + " " + req.originalUrl + " in " + time + " ms");
    }

  };

  return logger;

};

module.exports = Logger;

