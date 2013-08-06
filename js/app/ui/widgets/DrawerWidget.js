define(function(require) {

  var $ = require('jquery');
  var TouchTrackerWidget = require('app/ui/widgets/TouchTrackerWidget');
  var Promise = require('lavaca/util/Promise');
  var merge = require('mout/object/merge');
  require('lavaca/fx/Transition');

  /**
   * Drawer Widget creates touch tracking and promised based 
   * toggling functions for creating ui Drawers.
   *
   * To build a Drawer with a custom animation, it is recommended to 
   * extend this widget and overwrite updateCss and updateTransitionSpeed.
   *
   * @class app.ui.widgets.DrawerWidget
   * @extends app.ui.widgets.TouchTrackerWidget
   * @constructor
   *
   * @param {jQuery} el  The DOM element that is the root of the widget
   * @param {Object} params  An Object containing parameter values for the Drawer
   */
  /**
   * @class app.ui.widgets.DrawerWidget
   * @extends app.ui.widgets.TouchTrackerWidget
   * @constructor
   *
   * @param {jQuery} el  The DOM element that is the root of the widget
   * @param {String} params  Sets up the Drawer for common positions. 
   * Accepted value are 'top', 'left', 'right', 'bottom'.
   */
  var DrawerWidget = TouchTrackerWidget.extend(function(el, params) {
    TouchTrackerWidget.apply(this, arguments);
    this.init(params);
  }, {

    /**
     * Sets the axis in which the drawer moves. Accepted values are x or y.
     *
     * @property axisTracking
     * @type String
     * @default 'x'
     */
    axisTracking: 'x',

    /**
     * Sets the speed in seconds for the animation after touchend.
     *
     * @property completionSpeed
     * @type float
     * @default 0.1
     */
    completionSpeed: 0.1,

    /**
     * Sets the direction in which the drawer moves initially. Accepted values are 1 or -1.
     *
     * @property startDirection
     * @type integer
     * @default 1
     */
    startDirection: 1,

    /**
     * Sets the initial position of the Drawer and should always start as 0.
     *
     * @property startPosition
     * @type integer
     * @default 0
     */
    startPosition: 0,

    /**
     * Sets the distance in pixels that the drawer 
     * will travel from start to finish.
     *
     * @property moveDistance
     * @type integer
     * @default 256
     */
    moveDistance: 256,

    /**
     * Sets the distance in pixels between touch events 
     * that will result in a completion animation.
     *
     * @property throwThreshold
     * @type integer
     * @default 20
     */
    throwThreshold: 20,

    /**
     * Sets the distance in pixels in the opposite axis that the 
     * touch can travel before being ignored.
     *
     * @property movementThreshold
     * @type integer
     * @default 6
     */
    movementThreshold: 6,

    /**
     * Sets the distance in pixels in which touchstart must begin or the 
     * touch will be ignored.  If false, dragging can start from anywhere.
     *
     * @property restrictDragArea
     * @type integer
     * @default 64
     */
    restrictDragArea: 64,

    /**
     * Sets the distance in pixels of the drawers container.
     *
     * @property dragAreaLimit
     * @type integer
     * @default 320
     */
    dragAreaLimit: 320,

    /**
     * Sets whether the Widget is enabled or not.
     *
     * @property enabled
     * @type boolean
     * @default true
     */
    enabled: true,

    /**
     * Sets whether touches are ignored or not. This is used 
     * to disable touches if the movementThreshold is reached.
     *
     * @property ignoreTouch
     * @type boolean
     * @default false
     */
    ignoreTouch: false,

    /**     
     * Function sets a few defaults based on others.
     *
     * @method init
     * @param {Object} params  An Object containing parameter values for the Drawer
     */
     /**     
     * Function sets a few defaults based on others.
     *
     * @method init
     * @param {String} params  Sets up the Drawer for common positions. 
     * Accepted value are 'top', 'left', 'right', 'bottom'.
     */
    init: function(params) {
      this.screenWidth = $(window).width();
      this.screenHeight = $(window).height();

      switch(params) {
        case 'right':
          params = {
            axisTracking: 'x',
            startDirection: -1,
            moveDistance: this.screenWidth - this.restrictDragArea,
            dragAreaLimit: this.screenWidth
          }
          break;
        case 'top':
          params = {
            axisTracking: 'y',
            startDirection: 1,
            moveDistance: this.screenHeight - this.restrictDragArea,
            dragAreaLimit: this.screenHeight
          }
          break;
        case 'bottom':
          params = {
            axisTracking: 'y',
            startDirection: -1,
            moveDistance: this.screenHeight - this.restrictDragArea,
            dragAreaLimit: this.screenHeight
          }
          break;
        default:
          params = {
            axisTracking: 'x',
            startDirection: 1,
            moveDistance: this.screenWidth - this.restrictDragArea,
            dragAreaLimit: this.screenWidth
          }
          break;
      }

      if (params) {
        merge(this, params);
      }

      this.moveThreshold = this.moveDistance / 2;
      this.limitDirection = this.startDirection;
      this.limitMovementStart = this.startPosition;
      this.limitMovementEnd = this.moveDistance * this.startDirection;
    },

    /**     
     * Function extends the TouchTrackerWidget prototype function onTouchStart
     *
     * @method onTouchStart
     */
    onTouchStart: function(e) {
      if (!this.enabled || this.ignoreTouch) {
        return;
      }

      TouchTrackerWidget.prototype.onTouchStart.apply(this, arguments);

      if (this.restrictDragArea) {
        if ((this.limitDirection === 1 && this.axisTracking === 'x' && this.touchTracker.startX > this.restrictDragArea) ||
            (this.limitDirection === -1 && this.axisTracking === 'x' && this.touchTracker.startX < (this.dragAreaLimit - this.restrictDragArea)) || 
            (this.limitDirection === 1 && this.axisTracking === 'y' && this.touchTracker.startY > this.restrictDragArea) ||
            (this.limitDirection === -1 && this.axisTracking === 'y' && this.touchTracker.startY < (this.restrictDragArea - this.dragAreaLimit))) {
          this.ignoreTouch = true;
          return;
        }
      }

      this.touchTracker.isActive = false;
      this.touchTracker.hasDirection = false;
      this.update(null, 0);

    },

    /**     
     * Function extends the TouchTrackerWidget prototype function onTouchMove
     *
     * @method onTouchMove
     */
    onTouchMove: function(e) {
      if (!this.enabled || this.ignoreTouch) {
        return;
      }

      TouchTrackerWidget.prototype.onTouchMove.apply(this, arguments);

      if(!this.touchTracker.hasDirection) {
        if ((this.axisTracking === 'x') && (Math.abs(this.touchTracker.currentDeltaY) <= this.movementThreshold)  || 
              ((this.axisTracking === 'y') && (Math.abs(this.touchTracker.currentDeltaX) <= this.movementThreshold))) {
          this.touchTracker.isActive = true;
        }
        this.touchTracker.hasDirection = true;
      }

      if (this.axisTracking === 'y') {
        this.touchTracker.moveTo = this.touchTracker.deltaY + this.limitMovementStart;
      } else {
        this.touchTracker.moveTo = this.touchTracker.deltaX + this.limitMovementStart;
      }

      if (this.touchTracker.isActive) {
        if (((this.limitDirection === 1 && this.touchTracker.moveTo > this.limitMovementStart) ||
              (this.limitDirection === -1 && this.touchTracker.moveTo < this.limitMovementStart))) {
          this.update(this.touchTracker.moveTo);
        }
        e.stopPropagation();
        e.preventDefault();
      }

    },

    /**     
     * Function extends the TouchTrackerWidget prototype function onTouchEnd
     *
     * @method onTouchEnd
     */
    onTouchEnd: function(e) {
      if (!this.enabled || this.ignoreTouch) {
        this.ignoreTouch = false;
        return;
      }

      TouchTrackerWidget.prototype.onTouchEnd.apply(this, arguments);

      var isThresholdReached = false;
      if (this.axisTracking === 'y') {
        isThresholdReached = ((Math.abs(this.touchTracker.deltaY) > this.moveThreshold) && (this.touchTracker.deltaY * this.limitDirection > 0) ||
          (Math.abs(this.touchTracker.currentDeltaY) > this.throwThreshold) && (this.touchTracker.deltaY * this.limitDirection > 0));
      } else {
        isThresholdReached = ((Math.abs(this.touchTracker.deltaX) > this.moveThreshold) && (this.touchTracker.deltaX * this.limitDirection > 0) ||
          (Math.abs(this.touchTracker.currentDeltaX) > this.throwThreshold) && (this.touchTracker.deltaX * this.limitDirection > 0));
      }

      this.update(null, this.completionSpeed);
      if (this.touchTracker.isActive) {
        e.stopPropagation();
        e.preventDefault();
        if (isThresholdReached) {
          this.toggle();
        } else {
          this.update(this.limitMovementStart);
        }
      }

      this.touchTracker.isActive = false;
      this.touchTracker.hasDirection = false;

    },

    /**     
     * Function to animate to the open position
     *
     * @method open
     * @return {Lavaca.util.Promise}  A promise
     */
    open: function(){
      var promise = new Promise();
      this.ignoreTouch = true;
      this.el.nextTransitionEnd(function () {
        this.reverseDirection();
        this.ignoreTouch = false;
        promise.resolve();
      }.bind(this));
      this.update(this.limitMovementEnd, this.completionSpeed * 2);
      return promise;
    },

    /**     
     * Function to animate to the close position
     *
     * @method close
     * @return {Lavaca.util.Promise}  A promise
     */
    close: function(){
      var promise = new Promise();
      this.ignoreTouch = true;
      this.el.nextTransitionEnd(function () {
        this.originalDirection();
        this.ignoreTouch = false;
        promise.resolve();
      }.bind(this));
      this.update(this.limitMovementEnd, this.completionSpeed * 2);
      return promise;
    },

    /**     
     * Function to animate to the open position or 
     * close position based on the current state
     *
     * @method toggle
     * @return {Lavaca.util.Promise}  A promise
     */
    toggle: function () {
      var promise = new Promise();
      if(this.isOpen){
        this.close().then(function(){
          promise.resolve();
        });
      }else{
        this.open().then(function(){
          promise.resolve();
        });
      }
      return promise;
    },

    /**     
     * Function to revert the direction to the original after closing
     *
     * @method originalDirection
     */
    originalDirection: function () {
      this.limitMovementStart = this.startPosition;
      this.limitMovementEnd = this.moveDistance * this.startDirection;
      this.limitDirection = this.startDirection;
      this.el.removeClass('open');
      this.isOpen = false;
    },

    /**     
     * Function to revert the direction to the reverse after opening
     *
     * @method reverseDirection
     */
    reverseDirection: function () {
      this.limitMovementStart = this.moveDistance * this.startDirection;
      this.limitMovementEnd = this.startPosition;
      this.limitDirection = this.startDirection === 1 ? -1 : 1;
      this.el.addClass('open');
      this.isOpen = true;
    },

    /**     
     * Function provides a single point for updating CSS and Transition Speed.
     *
     * @param {integer} value  Value representing the pixel position the Drawer.
     * @param {float} value  Number of seconds for Drawer animation.
     * @method enable
     */
    update: function (value, speed) {
      function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      if (isNumber(value)) {
        this.updateCss(value);
      }
      if (isNumber(speed)) {
        this.updateTransitionSpeed(speed);
      }
    },

    /**     
     * Function to update the position of the Drawer.
     * To build a Drawer with a custom animation, it is recommended to 
     * extend this widget and overwrite this function and the updateTransitionSpeed function.
     *
     * @param {integer} value  Value representing the pixel position the Drawer.
     * @method enable
     */
    updateCss: function (value) {
      var translateValue = this.axisTracking === 'x' ? value+'px,0,0' : '0,'+value+'px,0';
      this.el.css('-webkit-transform', 'translate3d('+translateValue+')');
    },

    /**     
     * Function to update transition speed of the Drawer.
     * To build a Drawer with a custom animation, it is recommended to 
     * extend this widget and overwrite this function and the updateCss function.
     *
     * @param {float} value  Number of seconds for Drawer animation.
     * @method enable
     */
    updateTransitionSpeed: function (value) {
      this.el.css('-webkit-transition','all '+value+'s ease-out');
    },

    /**     
     * Function to set the Drawer Widget to enabled.
     *
     * @method enable
     */
    enable: function() {
      this.enabled = true;
    },

    /**     
     * Function to set the Drawer Widget to disabled
     *
     * @method disable
     */
    disable: function() {
      this.enabled = false;
    }

  });

  return DrawerWidget;

});