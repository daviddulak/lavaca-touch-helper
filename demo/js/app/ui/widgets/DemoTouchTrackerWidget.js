define(function(require) {

  var TouchTrackerWidget = require('app/ui/widgets/TouchTrackerWidget');
  var Template = require('lavaca/ui/Template');
  require('rdust!templates/tracking-data-row');

  var DemoTouchTrackerWidget = TouchTrackerWidget.extend(function() {
    TouchTrackerWidget.apply(this, arguments);
  }, {

    onTouchStart: function(e) {
      e.stopPropagation();
      e.preventDefault();
      TouchTrackerWidget.prototype.onTouchStart.apply(this, arguments);
      this.clearResults();
      this.printResults();
    },
    onTouchMove: function(e) {
      e.stopPropagation();
      e.preventDefault();
      TouchTrackerWidget.prototype.onTouchMove.apply(this, arguments);
      this.printResults();
    },
    onTouchEnd: function(e) {
      e.stopPropagation();
      e.preventDefault();
      TouchTrackerWidget.prototype.onTouchEnd.apply(this, arguments);
      this.printResults();
    },
    clearResults: function() {
      $('#resultsData').html('');
    },
    printResults: function() {
      Template
        .render('templates/tracking-data-row', this.touchTracker)
        .success(function(output) {
          $('#resultsData').prepend(output);
        });
    }

  });

  return DemoTouchTrackerWidget;

});