define(function(require) {

  var TouchTrackerWidget = require('app/ui/widgets/TouchTrackerWidget');

  var DragToFromWidget = TouchTrackerWidget.extend(function() {
    TouchTrackerWidget.apply(this, arguments);
  }, {

    touchTracker: {},

    onTouchStart: function() {
      TouchTrackerWidget.prototype.onTouchStart.apply(this, arguments);
    },
    onTouchMove: function() {
      TouchTrackerWidget.prototype.onTouchMove.apply(this, arguments);
      console.log(this.touchTracker);
    },
    onTouchEnd: function(e) {
      TouchTrackerWidget.prototype.onTouchEnd.apply(this, arguments);
    }

  });

  return DragToFromWidget;

});