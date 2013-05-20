# calendar

---

基于[arale-calendar](http://aralejs.org/calendar/)，提供了日历时间功能，按照国内习惯进行了封装

---

## 配置

### target `element`

希望变为calendar的input元素，设置后会自动生成trigger图标，原来的input设为output

其他配置请参照[arale-calendar](http://aralejs.org/calendar/)。

### needTime `Boolean`

设为true，显示时间功能。默认只显示小时和分钟。如果设置needSecond为true，则可以显示秒。

##

## 最佳实践

````iframe:250
<input id="date" type="text" data-widget="calendar">
<input id="date" type="text" data-widget="datetime">

<script type="text/javascript">
seajs.use(['widget'], function(Widget) {
  Widget.autoRenderAll();
});
</script>
````
