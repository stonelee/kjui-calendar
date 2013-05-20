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
