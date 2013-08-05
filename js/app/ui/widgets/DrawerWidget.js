define(function(require) {

  var TouchTrackerWidget = require('app/ui/widgets/TouchTrackerWidget');
  var Promise = require('lavaca/util/Promise');
  require('lavaca/fx/Transition');

  var DrawerWidget = TouchTrackerWidget.extend(function(el, params) {
    TouchTrackerWidget.apply(this, arguments);

    this.screenWidth = $(window).width();
    this.screenHeight = $(window).height();

    switch(params) {
      case 'left':
        params = {
          axisTracking: 'x',
          startDirection: 1,
          moveDistance: this.screenWidth - this.restrictDragArea,
          dragAreaLimit: this.screenWidth
        }
        break;
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
    }

    this.initWithParams(params);
    this.init();
  }, {

    initWithParams: function(params) {
      params = params || {};
      this.axisTracking = params.axisTracking || this.axisTracking;
      this.completionSpeed = params.completionSpeed || this.completionSpeed;
      this.startDirection = params.startDirection || this.startDirection;
      this.startPosition = params.startPosition || this.startPosition;
      this.moveDistance = params.moveDistance || this.moveDistance;
      this.throwThreshold = params.throwThreshold || this.throwThreshold;
      this.movementThreshold = params.movementThreshold || this.movementThreshold;
      this.movementCallback = params.movementCallback || this.movementCallback;

      this.restrictDragArea = params.restrictDragArea || this.restrictDragArea;
      this.dragAreaLimit = params.dragAreaLimit || this.dragAreaLimit;
    },

    axisTracking: 'x',
    completionSpeed: 0.1,
    startDirection: 1,
    startPosition: 0,
    moveDistance: 256,
    throwThreshold: 20,
    movementThreshold: 6,
    movementCallback: function(){return;},
    restrictDragArea: 64,
    dragAreaLimit: 320,


    init: function() {
      this.moveThreshold = this.moveDistance / 2;
      this.limitDirection = this.startDirection;
      this.limitMovementStart = this.startPosition;
      this.limitMovementEnd = this.moveDistance * this.startDirection;
      this.enable();
      this.ignoreTouch = false;
    },

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

    originalDirection: function () {
      this.limitMovementStart = this.startPosition;
      this.limitMovementEnd = this.moveDistance * this.startDirection;
      this.limitDirection = this.startDirection;
      this.el.removeClass('open');
      this.isOpen = false;
    },

    reverseDirection: function () {
      this.limitMovementStart = this.moveDistance * this.startDirection;
      this.limitMovementEnd = this.startPosition;
      this.limitDirection = this.startDirection === 1 ? -1 : 1;
      this.el.addClass('open');
      this.isOpen = true;
    },

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
      if (this.movementCallback) {
        this.movementCallback.call(this, value, speed);
      }
    },

    updateCss: function (value) {
      var newValue = 1 - (Math.abs(value) * (0.2/215));
      var translateValue = this.axisTracking === 'x' ? value+'px,0,0' : '0,'+value+'px,0';
      this.el.css('-webkit-transform', 'translate3d('+translateValue+')');
    },
    updateTransitionSpeed: function (value) {
      this.el.css('-webkit-transition','all '+value+'s ease-out');
    },

    enable: function() {
      this.enabled = true;
    },
    disable: function() {
      this.enabled = false;
    }

  });

  return DrawerWidget;

});