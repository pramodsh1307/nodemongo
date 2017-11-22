var appConfig = {
  common: {
    hostName: "http://localhost:3000",
    clientId: "foo",
    clientSecret: "bar"
  },
  user: {
    minUserAge: 18,
    maxUserAge: 60,
    lastLocationCacheExpiry: 604800 // time in seconds, 7 days
  }
};

module.exports = appConfig;
