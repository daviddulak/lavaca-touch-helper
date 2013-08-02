define(function(require) {

  var BaseView = require('./BaseView');
  var $ = require('jquery');
  var DrawerWidget = require('app/ui/widgets/DrawerWidget');
  require('rdust!templates/example-drawer');

  var ExampleDrawerView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapWidget("#main-view", DrawerWidget);
  }, {
    template: 'templates/example-drawer',
    className: 'example-drawer'
  });

  return ExampleDrawerView;

});