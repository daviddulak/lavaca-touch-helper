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
    this.mapWidget({
      '#main-view': DrawerWidget
    });
  }, {
    template: 'templates/example-drawer',
    className: 'example-drawer',
    drawerPositions: ['top', 'right', 'bottom', 'left'],
    currentPosition: 0,
    toggleDrawer: function() {
      this.widgets.get('main-view').toggle();
    },

    changeDrawer: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.currentPosition++;
      var position = this.el.find(e.currentTarget).attr('data-position');
      this.el.find('.which-drawer').text(position);
      this.el.attr('data-position', position);

      this.el.find('.next-drawer').text(this.drawerPositions[this.currentPosition % 4]);
      this.el.find(e.currentTarget).attr('data-position', this.drawerPositions[this.currentPosition % 4]);

      this.widgets.get('main-view').init(position);
    }
  });

  return ExampleDrawerView;

});