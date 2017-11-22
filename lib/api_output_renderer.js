'use strict';

var logger = require('../helpers').Logger(__filename);

module.exports = {

  render: function(req, res, next) {
    var response = {
      code: 'ok',
      error: null,
      response: req.response
    };
    logger.debug("Response: " + JSON.stringify(response));
    res.status(200);
    res.json(response);
    res.end();
  },

  renderError: function(err, req, res, next) {
    logger.debug("Error: " + err.name + ":" + err.message);
    logger.debug("Stack: " + err.stack);
    res.status(err.httpCode || 400);
    var response = {
      code: (err.errorCode || err.message),
      error: err.message,
      response: null
    };
    logger.debug("Response: " + JSON.stringify(response));
    res.json(response);
    res.end();
  },

  renderUnauthorized: function(req, res, next) {
    res.status(403);
    res.render('403.html');
    res.end();
  }

};
