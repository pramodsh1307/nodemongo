'use strict';

var gtCommon = require('gt-common');

var HealthController = require('./health_controller');

var ApiOutputRenderer = gtCommon.ApiOutputRenderer;

module.exports = function(app) {

  app.get('/api/health', HealthController.healthCheck, ApiOutputRenderer.render, ApiOutputRenderer.renderError);

  require('./apps')(app);
};
