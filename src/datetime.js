define(function(require, exports, module) {
  var $ = require('$'),
    Calendar = require('./calendar');

  var Datetime = Calendar.extend();

  Datetime.autoRender = function(config) {
    config.target = config.element;
    config.element = '';
    config.needTime = true;
    new Datetime(config);
  };

  module.exports = Datetime;

});
