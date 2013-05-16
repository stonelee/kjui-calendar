define("kjui/calendar/1.0.0/lang",[],{Su:"日",Mo:"一",Tu:"二",We:"三",Th:"四",Fr:"五",Sa:"六",Jan:"一月",Feb:"二月",Mar:"三月",Apr:"四月",May:"五月",Jun:"六月",Jul:"七月",Aug:"八月",Sep:"九月",Oct:"十月",Nov:"十一月",Dec:"十二月",Today:"今天"}),define("kjui/calendar/1.0.0/calendar",["./lang","$","arale/calendar/0.8.4/calendar","gallery/moment/1.6.2/moment","arale/overlay/1.0.0/overlay","arale/position/1.0.0/position","arale/iframe-shim/1.0.0/iframe-shim","arale/widget/1.0.3/widget","arale/base/1.0.1/base","arale/class/1.0.0/class","arale/events/1.0.0/events","arale/widget/1.0.3/templatable","gallery/handlebars/1.0.0/handlebars"],function(e,t,n){var r=e("$"),i=e("./lang"),s=e("arale/calendar/0.8.4/calendar"),o=s.extend({attrs:{target:null,template:'<div class="calendar"> <ul class="calendar-navigation" data-role="navigation-container"> <li class="calendar-previous-year" data-role="prev-year">&lt;&lt;</li> <li class="calendar-previous-month" data-role="prev-month">&lt;</li> <li class="calendar-month-year" data-role="month-year-container"> <span class="month" data-role="mode-month" data-value="{{month.current.value}}">{{_ month.current.label}}</span> <span class="year" data-role="mode-year">{{year.current.label}}</span> </li> <li class="calendar-next-month" data-role="next-month">&gt;</li> <li class="calendar-next-year" data-role="next-year">&gt;&gt;</li> </ul><ul class="calendar-control" data-role="pannel-container"> {{#if mode.date}} {{#each day.items}} <li class="calendar-day calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</li> {{/each}} {{/if}} </ul><div class="calendar-data-container" data-role="data-container"> {{#if mode.date}} {{#each date.items}} <ul class="calendar-date-column"> {{#each this}} <li class="calendar-day-{{day}} {{className}} {{#unless available}}disabled-date{{/unless}} " data-role="date" data-value="{{value}}" >{{label}}</li> {{/each}} </ul> {{/each}} {{/if}}{{#if mode.month}} {{#each month.items}} <ul class="calendar-month-column"> {{#each this}} <li data-role="month" data-value="{{value}}">{{_ label}}</li> {{/each}} </ul> {{/each}} {{/if}}{{#if mode.year}} {{#each year.items}} <ul class="calendar-year-column"> {{#each this}} <li data-role="{{role}}" data-value="{{value}}">{{_ label}}</li> {{/each}} </ul> {{/each}} {{/if}} </div><div class="calendar-footer" data-role="time-container"> <button class="btn" data-role="today">{{_ message.today}}</button> {{#if mode.time}} <div class="calendar-time" data-role="time"><span class="calendar-hour">{{time.hour}}</span> : {{time.minute}}</div> {{/if}} </div></div>',startDay:1,trigger:{value:"",getter:function(){if(!this._$trigger){var e=r(this.get("target"));this._$trigger=r('<i class="icon-form-date-trigger"></i>').insertAfter(e)}return this._$trigger}},output:{value:"",getter:function(e){return e=e?e:this.get("target"),r(e)}},align:{getter:function(){var e=this.get("target");return e?{selfXY:[0,0],baseElement:e,baseXY:[0,r(e).height()+5]}:{selfXY:[0,0],baseXY:[0,0]}}}},templateHelpers:{_:function(e){return i[e]||e}}});o.autoRender=function(e){e.target=e.element,e.element="",new o(e)},n.exports=o});