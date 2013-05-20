# 基本功能

- order: 1

---

## 基本用法

````iframe:250
<input id="date" type="text">

<script>
seajs.use(['$', 'calendar'], function($, Calendar) {
  new Calendar({
    target: '#date'
  });
});
</script>
````

## auto-render

````iframe:250
<input id="date1" type="text" data-widget="calendar">
<input id="date2" type="text" data-widget="datetime">

<script type="text/javascript">
seajs.use(['widget'], function(Widget) {
  Widget.autoRenderAll();
});
</script>
````

## 日期时间选择

````iframe:250
<div class="group">
  <label for="default">默认</label>
  <input id="default" type="text">
</div>
<div class="group">
  <label for="defaultEdit">默认编辑</label>
  <input id="defaultEdit" type="text" value="2013-05-15 08:30">
</div>
<div class="group">
  <label for="second">精确到秒</label>
  <input id="second" type="text">
</div>
<div class="group">
  <label for="secondEdit">精确到秒编辑</label>
  <input id="secondEdit" type="text" value="2013-05-15 08:30:20">
</div>

<script>
seajs.use(['$', 'calendar'], function($, Calendar) {
  new Calendar({
    target: '#default',
    needTime: true
  });
  new Calendar({
    target: '#defaultEdit',
    needTime: true
  });

  new Calendar({
    target: '#second',
    needTime: true,
    needSecond: true
  });

  new Calendar({
    target: '#secondEdit',
    needTime: true,
    needSecond: true
  });
});
</script>
````
