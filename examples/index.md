# 日历

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
