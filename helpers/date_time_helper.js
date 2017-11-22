'use strict';

var moment = require('moment');

module.exports = {

  toString: function(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  },

  pickupTimeFormat: function(date) {
    return moment(date).format('ddd MMM DD YYYY HH:mm:ss');
  },

  addMinutesFromCurrentTime: function(duration) {
    var d = moment();
    d.add(duration, "minutes");
    return d;
  },

  addMinutesFromGivenTime: function(time, duration) {
    var d = moment(time);
     d.add(duration, "minutes");
     return d;
  },

  addDaysToCurrentDate: function(days, date) {
    date = date || new Date();
    var d = moment(date);
    d.add(days, "days");
    return d;
  },

  toISOStringWithoutMilliSeconds: function(date_string) {
    var date = new Date(date_string);
  	return date.toISOString().split('.')[0]+"Z";
  },

  diffTime: function(time, pastTime) {
    return moment(time).diff(moment(pastTime));
  },

  diffDays: function(startDate, endDate) {
    return moment(endDate).diff(moment(startDate), "days");
  },

  getDateString: function(time) {    
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    if(month < 10) { month = '0' + month; };
    if(date < 10) { date = '0' + date; };
    return year + "-" + month + "-" + date;
  },

  roundOffToNearestMinute: function(time, seconds){
    var timestamp = time.getTime();
    var secondsTimestamp = timestamp / 1000;
    var paddedSeconds = secondsTimestamp % 300;
    secondsTimestamp = secondsTimestamp + (seconds - paddedSeconds);
    return new Date(secondsTimestamp * 1000);
  },

  getDateInt: function(time){
    var date = this.getDateString(time);
    var parsedDate = date.replace(/-/g,"")
    return parseInt(parsedDate);
  }

};