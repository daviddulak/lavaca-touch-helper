define(function(require) {

  var BaseView = require('./BaseView');
  var $ = require('jquery');
  var DemoTouchTrackerWidget = require('app/ui/widgets/DemoTouchTrackerWidget');
  require('rdust!templates/example');

  var ExampleView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapWidget("#touch-track", DemoTouchTrackerWidget);
  }, {
    template: 'templates/example',
    className: 'example'
  });

  return ExampleView;

});
