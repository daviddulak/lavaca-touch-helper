define(function(require) {

  var Widget = require('lavaca/ui/Widget');
  /**
   * TouchTracker Base Widget. This widget is intended to be extended 
   * for handling different touch interactions.
   * @class app.ui.widgets.TouchTrackerWidget
   * @extends lavaca.ui.Widget
   * @constructor
   *
   */
  var TouchTrackerWidget = Widget.extend(function() {
    Widget.apply(this, arguments);
    this.el.on('touchstart', this.onTouchStart.bind(this));
    this.el.on('touchmove', this.onTouchMove.bind(this));
    this.el.on('touchend', this.onTouchEnd.bind(this));
  }, {
    /**
     * An Object to contain touch data
     *
     * @property touchTracker
     * @type Object
     * @default {}
     */
    touchTracker: {},

    /**
     * Event handler for touchstart
     * @method onTouchStart
     *
     * @param {Event} e  The change event
     */
    onTouchStart: function(e) {
      this.touchTracker.currentAction = 'start';
      this.touchTracker.startX = e.originalEvent.touches[0].clientX;
      this.touchTracker.startY = e.originalEvent.touches[0].clientY;
      this.touchTracker.lastX = e.originalEvent.touches[0].clientX;
      this.touchTracker.lastY = e.originalEvent.touches[0].clientY;
      this.touchTracker.currentDeltaX = 0;
      this.touchTracker.currentDeltaY = 0;
      this.touchTracker.deltaX = 0;
      this.touchTracker.deltaY = 0;
    },

    /**
     * Event handler for touchmove
     * @method onTouchMove
     *
     * @param {Event} e  The change event
     */
    onTouchMove: function(e) {
      this.touchTracker.currentAction = 'move';
      this.touchTracker.currentDeltaX = e.originalEvent.touches[0].clientX - this.touchTracker.lastX;
      this.touchTracker.currentDeltaY = e.originalEvent.touches[0].clientY - this.touchTracker.lastY;
      this.touchTracker.lastX = e.originalEvent.touches[0].clientX;
      this.touchTracker.lastY = e.originalEvent.touches[0].clientY;
      this.touchTracker.deltaX = e.originalEvent.touches[0].clientX - this.touchTracker.startX;
      this.touchTracker.deltaY = e.originalEvent.touches[0].clientY - this.touchTracker.startY;
      this.touchTracker.distance = this.distanceBetweenPoints();
      this.touchTracker.angle = this.angleBetweenPoints();
      this.touchTracker.distanceInt = this.touchTracker.distance.toFixed(0);
      this.touchTracker.angleInt = this.touchTracker.angle.toFixed(0);
    },

    /**
     * Event handler for touchend
     * @method onTouchEnd
     *
     * @param {Event} e  The change event
     */
    onTouchEnd: function(e) {
      this.touchTracker.currentAction = 'end';
      this.touchTracker.distance = this.distanceBetweenPoints();
      this.touchTracker.angle = this.angleBetweenPoints();
      this.touchTracker.distanceInt = this.touchTracker.distance.toFixed(0);
      this.touchTracker.angleInt = this.touchTracker.angle.toFixed(0);
    },

    /**     
     * Function calculates the distance between two points.
     *
     * @method distanceBetweenPoints
     */
    distanceBetweenPoints: function() {
      return Math.sqrt( ((this.touchTracker.lastX - this.touchTracker.startX) * (this.touchTracker.lastX - this.touchTracker.startX)) + ((this.touchTracker.lastY - this.touchTracker.startY) * (this.touchTracker.lastY - this.touchTracker.startY)) );
    },

    /**     
     * Function calculates the angle between one point and another.
     *
     * @method angleBetweenPoints
     */
    angleBetweenPoints: function() {
      var theta = Math.atan2(-(this.touchTracker.lastY - this.touchTracker.startY), (this.touchTracker.lastX - this.touchTracker.startX));
      if (theta < 0) {
        theta += 2 * Math.PI;
      }
      return theta * (180 / Math.PI);
    },

    /**     
     * Function extends dispose to unbind it's touch events.
     *
     * @method dispose
     */
    dispose: function() {
      this.el.off('touchstart');
      this.el.off('touchmove');
      this.el.off('touchend');
      Widget.prototype.dispose.apply(this, arguments);
    }

  });

  return TouchTrackerWidget;

});