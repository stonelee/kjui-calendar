define("kjui/calendar/1.0.0/lang-debug", [], {
    'Su': '日',
    'Mo': '一',
    'Tu': '二',
    'We': '三',
    'Th': '四',
    'Fr': '五',
    'Sa': '六',
    'Jan': '一月',
    'Feb': '二月',
    'Mar': '三月',
    'Apr': '四月',
    'May': '五月',
    'Jun': '六月',
    'Jul': '七月',
    'Aug': '八月',
    'Sep': '九月',
    'Oct': '十月',
    'Nov': '十一月',
    'Dec': '十二月',
    'Today': '今天'
});

define("kjui/calendar/1.0.0/calendar-debug", ["./lang-debug", "$-debug", "arale/calendar/0.8.4/calendar-debug", "gallery/moment/1.6.2/moment-debug", "arale/overlay/1.0.0/overlay-debug", "arale/position/1.0.0/position-debug", "arale/iframe-shim/1.0.0/iframe-shim-debug", "arale/widget/1.0.3/widget-debug", "arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "arale/widget/1.0.3/templatable-debug", "gallery/handlebars/1.0.0/handlebars-debug"], function(require, exports, module) {
  var $ = require('$-debug'),
    lang = require('./lang-debug'),
    AraleCalendar = require('arale/calendar/0.8.4/calendar-debug');

  var Calendar = AraleCalendar.extend({
    attrs: {

      //output为target，trigger为target后面的元素
      target: null,

      template: '<div class="calendar"> <ul class="calendar-navigation" data-role="navigation-container"> <li class="calendar-previous-year" data-role="prev-year">&lt;&lt;</li> <li class="calendar-previous-month" data-role="prev-month">&lt;</li> <li class="calendar-month-year" data-role="month-year-container"> <span class="month" data-role="mode-month" data-value="{{month.current.value}}">{{_ month.current.label}}</span> <span class="year" data-role="mode-year">{{year.current.label}}</span> </li> <li class="calendar-next-month" data-role="next-month">&gt;</li> <li class="calendar-next-year" data-role="next-year">&gt;&gt;</li> </ul><ul class="calendar-control" data-role="pannel-container"> {{#if mode.date}} {{#each day.items}} <li class="calendar-day calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</li> {{/each}} {{/if}} </ul><div class="calendar-data-container" data-role="data-container"> {{#if mode.date}} {{#each date.items}} <ul class="calendar-date-column"> {{#each this}} <li class="calendar-day-{{day}} {{className}} {{#unless available}}disabled-date{{/unless}} " data-role="date" data-value="{{value}}" >{{label}}</li> {{/each}} </ul> {{/each}} {{/if}}{{#if mode.month}} {{#each month.items}} <ul class="calendar-month-column"> {{#each this}} <li data-role="month" data-value="{{value}}">{{_ label}}</li> {{/each}} </ul> {{/each}} {{/if}}{{#if mode.year}} {{#each year.items}} <ul class="calendar-year-column"> {{#each this}} <li data-role="{{role}}" data-value="{{value}}">{{_ label}}</li> {{/each}} </ul> {{/each}} {{/if}} </div><div class="calendar-footer" data-role="time-container"> <button class="btn" data-role="today">{{_ message.today}}</button> {{#if mode.time}} <div class="calendar-time" data-role="time"><span class="calendar-hour">{{time.hour}}</span> : {{time.minute}}</div> {{/if}} </div></div>',
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
