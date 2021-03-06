/*jshint expr:true*/
define("kjui/calendar/1.0.0/calendar-debug", [ "$-debug", "gallery/moment/2.0.0/moment-debug", "gallery/handlebars/1.0.0/handlebars-debug", "./lang-debug", "arale/tip/1.1.1/tip-debug", "arale/popup/1.0.2/popup-debug", "arale/overlay/1.0.1/overlay-debug", "arale/position/1.0.0/position-debug", "arale/iframe-shim/1.0.1/iframe-shim-debug", "arale/widget/1.0.3/widget-debug", "arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "arale/calendar/0.8.5/calendar-debug", "arale/widget/1.0.3/templatable-debug", "./calendar-debug.tpl", "./time-debug.tpl" ], function(require, exports, module) {
    var $ = require("$-debug"), moment = require("gallery/moment/2.0.0/moment-debug"), Handlebars = require("gallery/handlebars/1.0.0/handlebars-debug"), lang = require("./lang-debug"), Tip = require("arale/tip/1.1.1/tip-debug"), AraleCalendar = require("arale/calendar/0.8.5/calendar-debug");
    var PatchCalendar = AraleCalendar.extend({
        setup: function() {
            AraleCalendar.superclass.setup.call(this);
            var self = this;
            // bind trigger
            var $trigger = $(this.get("trigger"));
            $trigger.on(this.get("triggerType"), function() {
                self.show();
                setFocusedElement(self.element, self.model);
            });
            $trigger.on("keydown", function(ev) {
                self._keyControl(ev);
            });
            //日期时间控件特殊处理
            if (!this.get("needTime")) {
                $trigger.on("blur", function() {
                    self.hide();
                });
                self.element.on("mousedown", function(ev) {
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
            model.on("changeStartday changeMode", function() {
                self.renderPartial("[data-role=data-container]");
                self.renderPartial("[data-role=pannel-container]");
                self.renderPartial("[data-role=month-year-container]");
                setFocusedElement(self.element, self.model);
            });
            model.on("changeMonth changeYear", function() {
                var mode = model.get("mode");
                if (mode.date || mode.year) {
                    self.renderPartial("[data-role=data-container]");
                }
                self.renderPartial("[data-role=month-year-container]");
                setFocusedElement(self.element, self.model);
            });
            model.on("changeRange", function() {
                self.renderPartial("[data-role=data-container]");
            });
            model.on("refresh", function() {
                setFocusedElement(self.element, self.model);
            });
        },
        show: function() {
            PatchCalendar.superclass.show.call(this);
            //对于trigger为<input>, <select>, <a href="javascript:;">时有效
            $(this.get("trigger")).focus();
        }
    });
    function setFocusedElement(element, model) {
        var current;
        var mode = model.get("mode");
        var o = [ "date", "month", "year" ];
        for (var i = 0; i < o.length; i++) {
            if (mode[o[i]]) current = o[i];
        }
        if (!current) return;
        var selector = "[data-value=" + model.get(current).current.value + "]";
        element.find(".focused-element").removeClass("focused-element");
        element.find(selector).addClass("focused-element");
    }
    var Calendar = PatchCalendar.extend({
        attrs: {
            //output为target，trigger为target后面的元素
            target: null,
            template: require("./calendar-debug.tpl"),
            startDay: 1,
            needTime: false,
            needHour: true,
            needMinute: true,
            needSecond: false,
            trigger: {
                value: "",
                getter: function() {
                    if (!this._$trigger) {
                        var target = $(this.get("target"));
                        this._$trigger = $('<a class="icon-form-date-trigger" href="javascript:;"></a>').insertAfter(target);
                    }
                    return this._$trigger;
                }
            },
            output: {
                value: "",
                getter: function(val) {
                    val = val ? val : this.get("target");
                    return $(val);
                }
            },
            align: {
                getter: function() {
                    var target = this.get("target");
                    if (target) {
                        return {
                            selfXY: [ 0, 0 ],
                            baseElement: target,
                            baseXY: [ 0, $(target).height() + 5 ]
                        };
                    }
                    return {
                        selfXY: [ 0, 0 ],
                        baseXY: [ 0, 0 ]
                    };
                }
            }
        },
        setup: function() {
            Calendar.superclass.setup.call(this);
            if (this.get("needTime")) {
                this.set("hideOnSelect", false);
                var format = "YYYY-MM-DD ";
                if (this.get("needHour")) {
                    format += "HH";
                }
                if (this.get("needMinute")) {
                    format += ":mm";
                }
                if (this.get("needSecond")) {
                    format += ":ss";
                }
                this.set("format", format);
                var html = Handlebars.compile(require("./time-debug.tpl"))({
                    needHour: this.get("needHour"),
                    needMinute: this.get("needMinute"),
                    needSecond: this.get("needSecond"),
                    hours: getNumbers(24),
                    minutes: getNumbers(60, 5),
                    seconds: getNumbers(60, 5)
                });
                this.$("[data-role=time-container]").replaceWith(html);
                this.delegateEvents({
                    "keyup [data-role=hour],[data-role=minute],[data-role=second]": "_changeTime",
                    "click [data-role=ok]": "_onOk",
                    "click [data-role=cancel]": "_onCancel",
                    "click [data-role=now]": "_selectNow"
                });
                this.get("needHour") && this._bindTip("hour", "+5");
                this.get("needMinute") && this._bindTip("minute", "-30");
                this.get("needSecond") && this._bindTip("second", "-70");
            }
        },
        _bindTip: function(type, pos) {
            var self = this;
            var tip = new Tip({
                element: self.$("[data-role=" + type + "s]"),
                trigger: self.$("[data-role=" + type + "]"),
                triggerType: "click",
                direction: "up",
                pointPos: "50%" + pos
            });
            tip.delegateEvents({
                "click li": function(e) {
                    var value = $(e.target).text();
                    self.$("[data-role=" + type + "]").val(value);
                    self._setTimeToOutput();
                    this.hide();
                }
            });
        },
        show: function() {
            Calendar.superclass.show.call(this);
            if (this.get("needTime")) {
                var $output = this.get("output");
                var date = $output.val();
                if (date) {
                    date = moment(date);
                    this.originTime = date;
                } else {
                    date = moment();
                    this.setFocus(date);
                }
                this.$("[data-role=hour]").val(date.hour());
                this.$("[data-role=minute]").val(date.minute());
                this.$("[data-role=second]").val(date.second());
                $output.val(date.format(this.get("format")));
            }
        },
        _fillDate: function() {
            Calendar.superclass._fillDate.apply(this, arguments);
            if (this.get("needTime")) {
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
            value = value.replace(/\D/g, "");
            if (value) {
                value = parseInt(value, 10);
                var max = maxValue[$input.attr("data-role")];
                if (value > max) {
                    value = max;
                }
            }
            $input.val(value);
            this._setTimeToOutput();
        },
        _setTimeToOutput: function() {
            var $output = this.get("output");
            var date = $output.val();
            if (date) {
                date = moment(date);
            } else {
                date = moment();
            }
            date.hour(this.$("[data-role=hour]").val());
            date.minute(this.$("[data-role=minute]").val());
            date.second(this.$("[data-role=second]").val());
            $output.val(date.format(this.get("format")));
        },
        _onOk: function() {
            this.hide();
        },
        _onCancel: function() {
            var value;
            if (this.originTime) {
                value = this.originTime.format(this.get("format"));
            } else {
                value = "";
            }
            this.get("output").val(value);
            this.hide();
        },
        _selectNow: function() {
            var today = moment().format("YYYY-MM-DD");
            var date = this.model.selectDate(today);
            date = moment();
            this.$("[data-role=hour]").val(date.hour());
            this.$("[data-role=minute]").val(date.minute());
            this.$("[data-role=second]").val(date.second());
            this._fillDate(date);
        },
        templateHelpers: {
            _: function(key) {
                return lang[key] || key;
            }
        }
    });
    function getNumbers(max, step) {
        step = step || 1;
        var results = [];
        for (var i = 0; i < max; i += step) {
            results.push(i);
        }
        return results;
    }
    Calendar.autoRender = function(config) {
        config.target = config.element;
        config.element = "";
        new Calendar(config);
    };
    module.exports = Calendar;
});

define("kjui/calendar/1.0.0/lang-debug", [], {
    Su: "日",
    Mo: "一",
    Tu: "二",
    We: "三",
    Th: "四",
    Fr: "五",
    Sa: "六",
    Jan: "一月",
    Feb: "二月",
    Mar: "三月",
    Apr: "四月",
    May: "五月",
    Jun: "六月",
    Jul: "七月",
    Aug: "八月",
    Sep: "九月",
    Oct: "十月",
    Nov: "十一月",
    Dec: "十二月",
    Today: "今天"
});

define("kjui/calendar/1.0.0/calendar-debug.tpl", [], '<div class="calendar">\n    <ul class="calendar-navigation" data-role="navigation-container">\n        <li class="calendar-previous-year" data-role="prev-year">&lt;&lt;</li>\n        <li class="calendar-previous-month" data-role="prev-month">&lt;</li>\n        <li class="calendar-month-year" data-role="month-year-container">\n        <span class="month" data-role="mode-month" data-value="{{month.current.value}}">{{_ month.current.label}}</span>\n        <span class="year" data-role="mode-year">{{year.current.label}}</span>\n        </li>\n        <li class="calendar-next-month" data-role="next-month">&gt;</li>\n        <li class="calendar-next-year" data-role="next-year">&gt;&gt;</li>\n    </ul>\n\n    <ul class="calendar-control" data-role="pannel-container">\n        {{#if mode.date}}\n        {{#each day.items}}\n        <li class="calendar-day calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</li>\n        {{/each}}\n        {{/if}}\n    </ul>\n\n    <div class="calendar-data-container" data-role="data-container">\n        {{#if mode.date}}\n        {{#each date.items}}\n        <ul class="calendar-date-column">\n            {{#each this}}\n            <li class="calendar-day-{{day}} {{className}}\n            {{#unless available}}disabled-date{{/unless}}\n            "\n            data-role="date" data-value="{{value}}"\n            >{{label}}</li>\n            {{/each}}\n        </ul>\n        {{/each}}\n        {{/if}}\n\n        {{#if mode.month}}\n        {{#each month.items}}\n        <ul class="calendar-month-column">\n            {{#each this}}\n            <li data-role="month" data-value="{{value}}">{{_ label}}</li>\n            {{/each}}\n        </ul>\n        {{/each}}\n        {{/if}}\n\n        {{#if mode.year}}\n        {{#each year.items}}\n        <ul class="calendar-year-column">\n            {{#each this}}\n            <li data-role="{{role}}" data-value="{{value}}">{{_ label}}</li>\n            {{/each}}\n        </ul>\n        {{/each}}\n        {{/if}}\n    </div>\n\n    <div class="calendar-footer" data-role="time-container">\n      <button class="btn" data-role="today">{{_ message.today}}</button>\n      {{#if mode.time}}\n      <div class="calendar-time" data-role="time"><span class="calendar-hour">{{time.hour}}</span> : {{time.minute}}</div>\n      {{/if}}\n    </div>\n\n</div>\n\n');

define("kjui/calendar/1.0.0/time-debug.tpl", [], '<div class="calendar-time" data-role="time-container">\n  {{#if needHour}}<input type="text" data-role="hour">时{{/if}}\n  {{#if needMinute}}<input type="text" data-role="minute">分{{/if}}\n  {{#if needSecond}}<input type="text" data-role="second">秒{{/if}}\n  <a class="btn" data-role="now">现在</a>\n</div>\n<div class="calendar-footer">\n  <button class="btn" data-role="ok">确定</button>\n  <button class="btn" data-role="cancel">取消</button>\n</div>\n\n{{#if needHour}}\n  <div class="calendar-overlay" data-role="hours">\n    <ul>\n      {{#each hours}}\n        <li>{{this}}</li>\n      {{/each}}\n    </ul>\n    <div class="calendar-overlay-triangle-shadow" style="left:10px;"></div>\n    <div class="calendar-overlay-triangle" style="left:10px;"></div>\n  </div>\n{{/if}}\n\n{{#if needMinute}}\n  <div class="calendar-overlay" data-role="minutes">\n    <ul>\n      {{#each minutes}}\n        <li>{{this}}</li>\n      {{/each}}\n    </ul>\n    <div class="calendar-overlay-triangle-shadow" style="left:50px;"></div>\n    <div class="calendar-overlay-triangle" style="left:50px;"></div>\n  </div>\n{{/if}}\n\n{{#if needSecond}}\n  <div class="calendar-overlay" data-role="seconds">\n    <ul>\n      {{#each seconds}}\n        <li>{{this}}</li>\n      {{/each}}\n    </ul>\n    <div class="calendar-overlay-triangle-shadow" style="left:90px;"></div>\n    <div class="calendar-overlay-triangle" style="left:90px;"></div>\n  </div>\n{{/if}}\n');
