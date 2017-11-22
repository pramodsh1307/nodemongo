'use strict';
var lib = require('../../../../../lib');
var UsersController = require('./users_controller');
var ApiOutputRenderer = lib.ApiOutputRenderer;

module.exports = function(app) {

  app.post('/api/apps/v1/users/', UsersController.create, ApiOutputRenderer.render, ApiOutputRenderer.renderError);

};
