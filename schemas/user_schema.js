'use strict';

var lib = require('../lib');
var timestamps = require('mongoose-timestamp');

var mongoose = lib.mongo;
var Schema = mongoose.Schema;

var PointSchema = new Schema({
  type: { type: String, default: "Point", enum: ["Point"] },
  coordinates: { type: [Number] }
});

var UserLocationSchema = new Schema({
	location: { type: PointSchema },
	timestamp: { type: Number},
	status: {type: String}
});

var UserProfileSchema = new Schema({
  first_name: { type: String, required: true  },
  last_name: { type: String },
  email: { type: String, required: true },
  about_me: { type: String },
  mobile_number: { type: Number, required: true },
  mobile_number_country_code: { type: Number, default: 91},
  picture: { type: String },
  gender: { type: String, required: true, enum: ['MALE', 'FEMALE'] },
  dob: { type: Date, required: true },
  is_mobile_verified: { type: Boolean, default: false },
  mobile_verification_code: { type: Number, default: null },
  is_email_verified: { type: Boolean, default: false }
});

var UserSchema = new Schema({
  is_verified: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  locations: {type: [UserLocationSchema]},
  profile: { type: UserProfileSchema },
});



UserSchema.plugin(timestamps);

UserSchema.index({ createdAt: -1 });
UserSchema.index({ mobile_number: 1} );
UserSchema.index({ email: 1 });

module.exports = UserSchema;
