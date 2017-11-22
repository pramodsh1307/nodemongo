'use strict';

var lib = require('../../../lib');
var HealthController = require('./health_controller');

var ApiOutputRenderer = lib.ApiOutputRenderer;

module.exports = function(app) {

  app.get('/api/health', HealthController.healthCheck, ApiOutputRenderer.render, ApiOutputRenderer.renderError);

  require('./apps')(app);
};
