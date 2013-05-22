<div class="calendar-time" data-role="time-container">
  {{#if needHour}}<input type="text" data-role="hour">时{{/if}}
  {{#if needMinute}}<input type="text" data-role="minute">分{{/if}}
  {{#if needSecond}}<input type="text" data-role="second">秒{{/if}}
  <a class="btn" data-role="now">现在</a>
</div>
<div class="calendar-footer">
  <button class="btn" data-role="ok">确定</button>
  <button class="btn" data-role="cancel">取消</button>
</div>

{{#if needHour}}
  <div class="calendar-overlay" data-role="hours">
    <ul>
      {{#each hours}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
    <div class="calendar-overlay-triangle-shadow" style="left:10px;"></div>
    <div class="calendar-overlay-triangle" style="left:10px;"></div>
  </div>
{{/if}}

{{#if needMinute}}
  <div class="calendar-overlay" data-role="minutes">
    <ul>
      {{#each minutes}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
    <div class="calendar-overlay-triangle-shadow" style="left:50px;"></div>
    <div class="calendar-overlay-triangle" style="left:50px;"></div>
  </div>
{{/if}}

{{#if needSecond}}
  <div class="calendar-overlay" data-role="seconds">
    <ul>
      {{#each seconds}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
    <div class="calendar-overlay-triangle-shadow" style="left:90px;"></div>
    <div class="calendar-overlay-triangle" style="left:90px;"></div>
  </div>
{{/if}}
