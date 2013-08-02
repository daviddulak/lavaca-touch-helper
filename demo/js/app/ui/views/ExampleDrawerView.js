define(function(require) {

  var BaseView = require('./BaseView');
  var $ = require('jquery');
  var DrawerWidget = require('app/ui/widgets/DrawerWidget');
  require('rdust!templates/example-drawer');

  var ExampleDrawerView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      '.toggle-button': { tap: this.toggleDrawer.bind(this) }
    });
    this.on('entercomplete', this.onEnterComplete.bind(this));
  }, {
    template: 'templates/example-drawer',
    className: 'example-drawer',
    onEnterComplete: function() {
      this.drawerWidget = new DrawerWidget('#main-view');
    },
    toggleDrawer: function() {
      this.drawerWidget.toggle();
    }
  });

  return ExampleDrawerView;

});