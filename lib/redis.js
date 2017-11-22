'use strict';

var config = require('config');
var Redis = require('ioredis');

var redisConfig = config.redis;

var redis = new Redis(redisConfig);

module.exports = redis;

