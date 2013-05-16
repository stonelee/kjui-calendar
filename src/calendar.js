define(function(require, exports, module) {
  var $ = require('$'),
    lang = require('./lang'),
    AraleCalendar = require('arale-calendar');

  var Calendar = AraleCalendar.extend({
    attrs: {

      //output为target，trigger为target后面的元素
      target: null,

      template: require('./calendar.tpl'),
      startDay: 1,

      trigger: {
        value: '',
        getter: function() {
          if (!this._$trigger) {
            var target = $(this.get('target'));
            this._$trigger = $('<i class="icon-form-date-trigger"></i>').insertAfter(target);
          }
          return this._$trigger;
        }
      },
      output: {
        value: '',
        getter: function(val) {
          val = val ? val : this.get('target');
          return $(val);
        }
      },

      align: {
        getter: function() {
          var target = this.get('target');
          if (target) {
            return {
              selfXY: [0, 0],
              baseElement: target,
              baseXY: [0, $(target).height() + 5]
            };
          }
          return {
            selfXY: [0, 0],
            baseXY: [0, 0]
          };
        }
      }
    },

    templateHelpers: {
      '_': function(key) {
        return lang[key] || key;
      }
    }

  });

  Calendar.autoRender = function(config) {
    config.target = config.element;
    config.element = '';
    new Calendar(config);
  };

  module.exports = Calendar;

});
