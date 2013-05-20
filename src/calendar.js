define(function(require, exports, module) {
  var $ = require('$'),
    moment = require('moment'),
    Handlebars = require('handlebars'),
    lang = require('./lang'),
    AraleCalendar = require('arale-calendar');

  var PatchCalendar = AraleCalendar.extend({
    setup: function() {
      AraleCalendar.superclass.setup.call(this);

      var self = this;

      // bind trigger
      var $trigger = $(this.get('trigger'));
      $trigger.on(this.get('triggerType'), function() {
        self.show();
        setFocusedElement(self.element, self.model);
      });
      $trigger.on('keydown', function(ev) {
        self._keyControl(ev);
      });

      //日期时间控件特殊处理
      if (!this.get('needTime')) {
        $trigger.on('blur', function() {
          self.hide();
        });

        self.element.on('mousedown', function(ev) {
          if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
            var trigger = $trigger[0];
            trigger.onbeforedeactivate = function() {
              window.event.returnValue = false;
              trigger.onbeforedeactivate = null;
            };
          }
          ev.preventDefault();
        });
      }

      // bind model change event
      var model = this.model;
      model.on('changeStartday changeMode', function() {
        self.renderPartial('[data-role=data-container]');
        self.renderPartial('[data-role=pannel-container]');
        self.renderPartial('[data-role=month-year-container]');
        setFocusedElement(self.element, self.model);
      });
      model.on('changeMonth changeYear', function() {
        var mode = model.get('mode');
        if (mode.date || mode.year) {
          self.renderPartial('[data-role=data-container]');
        }
        self.renderPartial('[data-role=month-year-container]');
        setFocusedElement(self.element, self.model);
      });
      model.on('changeRange', function() {
        self.renderPartial('[data-role=data-container]');
      });
      model.on('refresh', function() {
        setFocusedElement(self.element, self.model);
      });
    },

    show: function() {
      PatchCalendar.superclass.show.call(this);
      //对于trigger为<input>, <select>, <a href="javascript:;">时有效
      $(this.get('trigger')).focus();
    }
  });

  function setFocusedElement(element, model) {
    var current;
    var mode = model.get('mode');
    var o = ['date', 'month', 'year'];
    for (var i = 0; i < o.length; i++) {
      if (mode[o[i]]) current = o[i];
    }
    if (!current) return;
    var selector = '[data-value=' + model.get(current).current.value + ']';
    element.find('.focused-element').removeClass('focused-element');
    element.find(selector).addClass('focused-element');
  }

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

    setup: function() {
      Calendar.superclass.setup.call(this);

      if (this.get('needTime')) {
        this.set('hideOnSelect', false);

        var format = 'YYYY-MM-DD ';
        if (this.get('needHour')) {
          format += 'HH';
        }
        if (this.get('needMinute')) {
          format += ':mm';
        }
        if (this.get('needSecond')) {
          format += ':ss';
        }
        this.set('format', format);

        var html = Handlebars.compile(require('./time.tpl'))({
          needHour: this.get('needHour'),
          needMinute: this.get('needMinute'),
          needSecond: this.get('needSecond')
        });
        this.$('[data-role=time-container]').replaceWith(html);

        this.delegateEvents({
          'keyup [data-role=hour],[data-role=minute],[data-role=second]': '_changeTime',
          'click [data-role=ok]': '_onOk',
          'click [data-role=cancel]': '_onCancel',
          'click [data-role=now]': '_selectNow'
        });
      }
    },

    show: function() {
      Calendar.superclass.show.call(this);

      if (this.get('needTime')) {
        var $output = this.get('output');
        var date = $output.val();
        if (date) {
          date = moment(date);
          this.originTime = date;
        } else {
          date = moment();
          this.setFocus(date);
        }
        this.$('[data-role=hour]').val(date.hour());
        this.$('[data-role=minute]').val(date.minute());
        this.$('[data-role=second]').val(date.second());

        $output.val(date.format(this.get('format')));
      }
    },

    _fillDate: function() {
      Calendar.superclass._fillDate.apply(this, arguments);

      if (this.get('needTime')) {
        this._setTimeToOutput();
      }
    },

    _changeTime: function(e) {
      var $input = $(e.target);
      var value = $input.val();
      var maxValue = {
        hour: 23,
        minute: 59,
        second: 59
      };

      value = value.replace(/\D/g, '');
      if (value) {
        value = parseInt(value, 10);

        var max = maxValue[$input.attr('data-role')];
        if (value > max) {
          value = max;
        }
      }
      $input.val(value);

      this._setTimeToOutput();
    },

    _setTimeToOutput: function() {
      var $output = this.get('output');
      var date = $output.val();
      if (date) {
        date = moment(date);
      } else {
        date = moment();
      }

      date.hour(this.$('[data-role=hour]').val());
      date.minute(this.$('[data-role=minute]').val());
      date.second(this.$('[data-role=second]').val());
      $output.val(date.format(this.get('format')));
    },

    _onOk: function() {
      this.hide();
    },
    _onCancel: function() {
      var value;
      if (this.originTime) {
        value = this.originTime.format(this.get('format'));
      } else {
        value = '';
      }
      this.get('output').val(value);
      this.hide();
    },
    _selectNow: function() {
      var today = moment().format('YYYY-MM-DD');
      var date = this.model.selectDate(today);

      date = moment();
      this.$('[data-role=hour]').val(date.hour());
      this.$('[data-role=minute]').val(date.minute());
      this.$('[data-role=second]').val(date.second());

      this._fillDate(date);
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
