'use strict';
var lib = require('../../../../../lib');
var UsersController = require('./users_controller');
var ApiOutputRenderer = lib.ApiOutputRenderer;

module.exports = function(app) {
  app.post('/api/apps/v1/users/', UsersController.create, ApiOutputRenderer.render, ApiOutputRenderer.renderError);
  app.get('/api/apps/v1/users/:user_id', UsersController.getUser, ApiOutputRenderer.render, ApiOutputRenderer.renderError);
  app.get('/api/apps/v1/users/', UsersController.getAllUser, ApiOutputRenderer.render, ApiOutputRenderer.renderError);
  app.get('/api/apps/v1/users/:user_id/:mobile_verification_code', UsersController.getUser, UsersController.verifyUserMobile, ApiOutputRenderer.render, ApiOutputRenderer.renderError);
  app.put('/api/apps/v1/users/:user_id', UsersController.getUser, UsersController.putUser, ApiOutputRenderer.render, ApiOutputRenderer.renderError);
};
