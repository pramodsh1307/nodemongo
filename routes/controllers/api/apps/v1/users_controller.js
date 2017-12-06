'use strict'

var request = require('request');

var _ = require('underscore');
var randomstring = require('randomstring');

var config = require('config');

var models = require('../../../../../models');
var helpers = require('../../../../../helpers');
var lib = require('../../../../../lib');

var User = models.User;
var ApplicationHelper = helpers.ApplicationHelper
var appConfig = config.appConfig;
var logger = helpers.Logger(__filename);

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
          mobileNumber: req.body.mobile_number,
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          email: req.body.email,
          gender: req.body.gender,
          dob: req.body.dob,
          mobile_verification_code: randomstring.generate({ length: 6, charset: 'numeric' })
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
            userId: req.body.user_id,
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
    },

    /**
    * Get user detail
    */
    getUser: function (req, res, next) {
      var params = {
        userId: req.params.user_id
      };
      
      User.findUser(params, function(err, user) {
        if (err) {
          return next(err);
        }

        req.response = {user: user};

        next();

      });

    },
    
    getAllUser: function(req, res, next) {
      
      var params = {};

      User.findAllUser(params, function(err, user) {
        if (err) {
          return next(err);
        }

        req.response = {users: user};

        next();

      });
    },


    /**
    * Update user detail
    */
    putUser: function (req, res, next) {

      var userInstanceObj = req.response.user;

      var params = {
          mobileNumber: req.body.mobile_number,
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          email: req.body.email,
          gender: req.body.gender,
          dob: req.body.dob
      };

      userInstanceObj.updateUser(params, function(err, user){
        if (err) {
          return next(err);
        }

        req.response = {user: user};
        next();

      });
    },

    /*
    * get user mobile verification code and verify it
    */
    verifyUserMobile: function (req, res, next) {
      var userInstanceObj = req.response.user;

      var params = {
          mobile_verification_code: req.params.mobile_verification_code
      };

      userInstanceObj.checkOrVerifyMobile(params, function(err, verificationResponse){
        if(err) {
          return next(err);
        }

        req.response = {mobile_verification_status: true}
        next();
      });

    },
};

module.exports = UsersController;
