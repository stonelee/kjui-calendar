# 更多

- order: 2

---

## 有初始值

````iframe:250
<input id="date1" type="text">
<input id="date2" type="text" value="2013-02-12">

<script>
seajs.use(['$', 'calendar'], function($, Calendar) {
  new Calendar({
    target: '#date1',
    focus: '2013-1-1'
  });

  new Calendar({
    target: '#date2'
  });
});
</script>
````

## 控制可选范围

````iframe:250
<div class="group">
  <label>2013-5-7至2013-5-21:</label>
  <input id="date1" type="text">
</div>
<div class="group">
  <label>2013-5-15之后:</label>
  <input id="date2" type="text">
</div>
<div class="group">
  <label>不能选周末:</label>
  <input id="date3" type="text">
</div>

<script>
seajs.use(['$', 'calendar'], function($, Calendar) {
  new Calendar({
    target: '#date1',
    range: ['2013-05-07', '2013-05-21']
  });

  new Calendar({
    target: '#date2',
    range: ['2013-05-15', null]
  });

  new Calendar({
    target: '#date3',
    range: function(date) {
      return date.day() != 0 && date.day() != 6;
    }
  });
});
</script>
````

## 时间段

````iframe:250
<label for="date-start">从</label><input id="date-start" type="text">
<label for="date-end">到</label><input id="date-end" type="text">

<script>
seajs.use(['$', 'calendar'], function($, Calendar) {
  var start = new Calendar({target: '#date-start'});
  var end = new Calendar({target: '#date-end'});

  start.on('selectDate', function(date) {
    end.range([date, null]);
  });

  end.on('selectDate', function(date) {
    start.range([null, date]);
  });
});
</script>
