define(function(require) {

  var BaseView = require('./BaseView');
  var $ = require('jquery');
  var DrawerWidget = require('app/ui/widgets/DrawerWidget');
  require('rdust!templates/example-drawer');

  var ExampleDrawerView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      '.toggle-button': { tap: this.toggleDrawer.bind(this) },
      '.link': { tap: this.changeDrawer.bind(this) }
    });
    this.on('entercomplete', this.onEnterComplete.bind(this));
  }, {
    template: 'templates/example-drawer',
    className: 'example-drawer',
    drawerPositions: ['top', 'right', 'bottom', 'left'],
    currentPosition: 0,
    onEnterComplete: function() {
      this.drawerWidget = new DrawerWidget('#main-view', 'left');
      this.el.attr('data-position', 'left');
    },
    toggleDrawer: function() {
      this.drawerWidget.toggle();
    },

    changeDrawer: function(e) {
      this.currentPosition++;
      var position = this.el.find(e.currentTarget).attr('data-position');
      this.el.find('.which-drawer').text(position);
      this.el.attr('data-position', position);

      this.el.find('.next-drawer').text(this.drawerPositions[this.currentPosition % 4]);
      this.el.find(e.currentTarget).attr('data-position', this.drawerPositions[this.currentPosition % 4]);

      this.drawerWidget.dispose();
      this.drawerWidget = new DrawerWidget('#main-view', position);
    }
  });

  return ExampleDrawerView;

});