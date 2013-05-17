define(function(require, exports, module) {
  var $ = require('$'),
    lang = require('./lang'),
    AraleCalendar = require('arale-calendar');

  var PatchCalendar = AraleCalendar.extend({
    show: function() {
      PatchCalendar.superclass.show.call(this);
      //对于trigger为<input>, <select>, <a href="javascript:;">时有效
      $(this.get('trigger')).focus();
    }
  });

  var Calendar = PatchCalendar.extend({
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
            this._$trigger = $('<a class="icon-form-date-trigger" href="javascript:;"></a>').insertAfter(target);
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
