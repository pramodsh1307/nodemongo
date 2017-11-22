'use strict';

var mongoose = require('mongoose');
var common = require('gt-common');
var config = require('config');
var mongoConfig = config.mongo;

var logger = common.Logger(__filename);

var mongooseConnectionString = "mongodb://";
if(mongoConfig.type === 'standalone') {
  mongooseConnectionString += mongoConfig.host + ":" + mongoConfig.port + "/" + mongoConfig.db;
} else if(mongoConfig.type === 'repl_set') {
  var instances = [];
  mongoConfig.instances.forEach(function(instance) {
    instances.push(instance.host + ":" + instance.port);
  });
  mongooseConnectionString += instances.join(",");
  mongooseConnectionString += "/" + mongoConfig.db;
  if(mongoConfig.replSet) {
    mongooseConnectionString += "?replicaSet=" + mongoConfig.replSet;
  }
}

// Setting primise lib
var options = {
  promiseLibrary: global.Promise
};

logger.info("Using global.Promise as promise lib for mongoose and mongo db driver");
mongoose.Promise = global.Promise;

logger.info("Creating mongo instance...");
mongoose.connect(mongooseConnectionString, options);
logger.info("Mongoose instance created with host: " + mongoConfig.host);

module.exports = mongoose;

