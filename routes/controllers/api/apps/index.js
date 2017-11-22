'use strict';

module.exports = function(app) {
  require('./v1')(app);
  require('./v2')(app);
}
