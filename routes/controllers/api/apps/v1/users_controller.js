'use strict'

var request = require('request');

var _ = require('underscore');

var config = require('config');

var models = require('../../../../../models');
var helpers = require('../../../../../helpers');
var lib = require('../../../../../lib');

var User = models.User;
var ApplicationHelper = helpers.ApplicationHelper
var appConfig = config.appConfig;
var logger = gtCommon.Logger(__filename);

var UsersController = {

    /**
     * Create User
     * Find or Create user
     * @param req
     * @param res
     * @param next
     */
    create: function (req, res, next) {

      var params = {
          mobileNumber: req.params.mobile_number,
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          email: req.body.email,
          gender: req.body.gender,
          dob: req.body.dob,
      };

      User.findOrCreate(params, function (err, user) {
          if (err) {
              return next(err);
          }
          req.response = {
              user_id: user.id
          }
          next();
      });
    },

    /**
     * Record single location 
     */
    record: function (req, res, next) {
        var params = {
            userId: req.params.user_id,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            timestamp: req.body.timestamp
        };

        User.recordLocation(params, function (err, user) {
            if (err) {
                return next(err);
            }
            req.response = {

            }
            next();
        });
    }

};

module.exports = UsersController;
