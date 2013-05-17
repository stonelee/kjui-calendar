define(function(require, exports, module) {
  var $ = require('$'),
    moment = require('moment'),
    Handlebars = require('handlebars'),
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

      needTime: false,
      needHour: true,
      needMinute: true,
      needSecond: false,

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

    show: function() {
      Calendar.superclass.show.call(this);

      if (this.get('needTime') && !this._timeInserted) {
        this.set('hideOnSelect', false);
        this.set('format', 'YYYY-MM-DD HH:mm:ss');

        var html = Handlebars.compile(require('./time.tpl'))({
          needHour: this.get('needHour'),
          needMinute: this.get('needMinute'),
          needSecond: this.get('needSecond')
        });
        this.$('[data-role=time-container]').replaceWith(html);
        this._timeInserted = true;

        this.delegateEvents({
          'click [data-role=hour]': '_changeHour'
        });

        var $output = this.get('output');
        var date = $output.val();
        if (date) {
          date = moment(date);
          this.$('[data-role=hour]').val(date.hour());
          this.$('[data-role=minute]').val(date.minute());
          this.$('[data-role=second]').val(date.second());
        }

      }
    },

    _changeHour: function(e) {
      $(e.target).val(5);

      var $output = this.get("output");
      var date = $output.val();
      if (date) {
        date = moment(date);
      } else {
        date = moment();
      }
      date.hour(this.$('[data-role=hour]').val());
      var value = date.format(this.get("format"));
      $output.val(value);
    },

    _fillDate: function(date) {
      if (!this.model.isInRange(date)) {
        this.trigger("selectDisabledDate", date);
        return this;
      }
      this.trigger("selectDate", date);
      var trigger = this.get("trigger");
      if (!trigger) {
        return this;
      }
      var $output = this.get("output");
      if (typeof $output[0].value === "undefined") {
        return this;
      }

      date.hour(this.$('[data-role=hour]').val());
      date.minute(this.$('[data-role=minute]').val());
      date.second(this.$('[data-role=second]').val());

      var value = date.format(this.get("format"));
      $output.val(value);
      if (this.get("hideOnSelect")) {
        this.hide();
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
