'use strict';

var lib = require('../lib');
var helpers = require('../helpers');
var redis = lib.redis;
var schemas = require('../schemas');
var logger = helpers.Logger(__filename);
var mongoose = lib.mongo;
var config = require('config');
var appConfig = config.appConfig;
var request = require('request');
var base64 = require('base-64');

var userSchema = schemas.UserSchema;



var getRedisKeyForLastLocation = function(user) {
  return 'user_last_location_' + user.id;
};

var getRedisKeyForUserProfile = function(user) {
  return 'user_' + user.id + user.created_at;
};

// Sample Request Calling, It's not using anywhere
var updateUserStatus = function(user, status, cb) {
  let url = appConfig.common.hostName + '/api/apps/v1/users/' + user.id + "?client_id=" +
      appConfig.common.clientId + "&client_secret=" + appConfig.common.clientSecret;

  let params = {
    status: status
  };

  request({
    url: url,
    method: "POST",
    body: JSON.stringify(params),
    headers: {'Content-Type': 'application/json'}
  }, function (err, response, body) {
    if(err || response.statusCode != 200) {
      err = err || (new Error("Non 200 response code received. Response Code: " + response.statusCode));
      return cb(err);
    }
    try {
      body = JSON.parse(body);
    } catch(err) {
      logger.debug("Error parsing response body: " + body);
      return cb(err);
    }
    cb(null, body);
  });

};

userSchema.statics.findUser = function(params, cb) {

  if (!params.userId) {
    let err = new Error("Invalid Params");
    return cb(err);
  }

  User.findOne({_id: params.userId}, function(err, user) {

    if(err) return cb(err);

    cb(null, user);

  });  

};

userSchema.statics.findAllUser = function(params, cb) {

  /*if (!params.userId) {
    let err = new Error("Invalid Params");
    return cb(err);
  }*/
  //sort(profile.first_name: 1)

  User.find({}, function(err, user) {

    if(err) return cb(err);

    cb(null, user);

  });  

};

userSchema.statics.findOrCreate = function(params, cb){

  if (!params.mobileNumber ) {
    let err = new Error("Invalid Params");
    return cb(err);
  }

  User.findOne({mobile_number: params.mobileNumber}, '-locations', function(err, user) {

    if(err) return cb(err);

    if (!user) {

      if (!params.firstName || !params.email || !params.gender || !params.dob ) {
        let err = new Error("Invalid Params");
        return cb(err);
      }

    user = new User({ profile: {
        mobile_number: params.mobileNumber,
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        gender: params.gender.toUpperCase(),
        dob: params.dob
      } });

      user.save(function(err){
        if(err) return cb(err);
        cb(null, user);
      });

    } else {
      cb(null, user);
    }

  });

}


userSchema.methods.updateUser = function (params, cb) {
  if (!params.firstName || !params.lastName || !params.email || !params.gender || !params.dob ) {
    var err = new Error("Invalid Params");
    return cb(err);
  }

  let self = this;

  self.profile.first_name = params.firstName;
  self.profile.last_name = params.lastName;
  self.profile.email = params.email;
  self.profile.gender = params.gender.toUpperCase();
  self.profile.dob = params.dob;
  console.log(self);
  self.save(function (err) {
    if (err) return cb(err);
    cb(null, self);
  });
}


userSchema.statics.recordUserLastLocation = function (params, cb) {

  if (!params.userId || !params.latitude || !params.longitude || !params.timestamp) {
      let err = new Error("Invalid Params");
      logger.error(err.message);
      return cb(err);
  }

  User.findOne({id: params.userId}, '-locations', function (err, user) {

      if (err || !user) {
        let err = new Error("User not found");
        return cb(err);
      }

      if (parseInt(params.latitude) < 1 || parseInt(params.longitude) < 1 ) {
          let err = new Error("Invalid latitude or longitude");
          return cb(err);
      }

      var redis_key = getRedisKeyForLastLocation(user);
      redis.multi().get(redis_key).exec(function (err, last_coordinates) {
          
        if (err) return cb(err);

        last_coordinates = JSON.parse(last_coordinates[0][1]);

        if (last_coordinates != null) {

        let location = {type: 'Point', coordinates: [params.latitude, params.longitude]};
        let lastLocation = {location: location, timestamp: params.timestamp, status: status};

        User.update({"_id": user.id}, { $push: { locations: lastLocation }}, {}, function(err) {
          if(err) return cb(err);
          redis.set(redis_key, JSON.stringify(lastLocation), 'EX', appConfig.user.lastLocationCacheExpiry);
          cb(err, user);
        });

      };
    });
  });
}



userSchema.statics.fetchLocations = function (userId, cb) {
    if (!userId) {
        var err = new Error("Invalid userId");
        logger.error(err.message);
        return cb(err)
    }


    User.find({user_id: userId}).exec(function (err, docs) {
        if (err) {
          logger.error(err.message);
          return cb(err);
        }

        if (docs.length == 0) {
          var err = new Error("No user found for given id");
          logger.error(err.message);
          return cb(err);
        }

        var locations = (docs[0].locations || []).sort(function (l1, l2) {
          return l1.timestamp - l2.timestamp
        });

        cb(null, locations);
    })
}


userSchema.statics.lastLocation = function(userId, cb) {
  if(!userId) {
    return cb(new Error("Invalid user id"));
  }
  User.findOne({ id: userId }, '-locations', function(err, user) {
    if(err || !user) {
      err = err || (new Error("User not found. Try again after some time"));
      return cb(err);
    }
    let redisKey = getRedisKeyForLastLocation(user);
    redis.get(redisKey, function(err, lastCoordinates) {
      if(err || !lastCoordinates) {
        err = err || (new Error("Last coordinates not found on redis"));
        return cb(err);
      } else {
        lastCoordinates = JSON.parse(lastCoordinates);

        return cb(null, {
          coordinates: lastCoordinates.location.coordinates,
          lastUpdated: lastCoordinates.timestamp
        });
      }
    });
  });
};


userSchema.methods.getStatus = function () {
    var status = "ACTIVE";
    if (this.is_deleted) status = "DELETED";
    if (this.is_verified) status = "NOT VERIFIED";
    return status;
}


var User = mongoose.model('User', userSchema);

module.exports = User;

// test code
if(require.main === module) {
  // Record Location
  User.recordUserLastLocation(
    {userId:"59b13ad4467472177075eb05", latitude:"28.576915", longitude: "28.576915", timestamp: Date.now()},  
    function(err, user){
      if(err){
        throw err;
      } else{
        console.log("Location Recorded Successfully");
      }
    });
}
