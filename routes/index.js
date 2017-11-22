'use strict';

var gtCommon = require('gt-common');

var ApiOutputRenderer = gtCommon.ApiOutputRenderer;

var testController = function(req, res, next) {
  req.response = {
    status: 'Success'
  };
  next();
};

module.exports = function(app) {
  app.get('/test', testController, ApiOutputRenderer.render, ApiOutputRenderer.renderError);
  require('./controllers')(app);  
};

