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
<input id="date" type="text" data-widget="calendar">

<script type="text/javascript">
seajs.use(['widget'], function(Widget) {
  Widget.autoRenderAll();
});
</script>
````

## 日期时间选择

````iframe:250
<input id="date1" type="text">
<input id="date2" type="text" value="2013-05-15 08:30:20">

<script>
seajs.use(['$', 'calendar'], function($, Calendar) {
  new Calendar({
    target: '#date1',
    needTime: true
  });

  new Calendar({
    target: '#date2',
    needTime: true
  });
});
</script>
````
