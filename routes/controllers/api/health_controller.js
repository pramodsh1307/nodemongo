'use strict';

var HealthController = {

  healthCheck: function(req, res, next) {
    req.response = {
      success: true
    };
    next();
  }

};

module.exports = HealthController;

