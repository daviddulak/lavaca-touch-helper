define(function(require) {

  var BaseView = require('./BaseView');
  var $ = require('jquery');
  var DragToFromWidget = require('app/ui/widgets/DragToFromWidget');
  require('rdust!templates/example');

  /**
   * Example view type
   * @class app.ui.views.ExampleView
   * @extends app.ui.views.BaseView
   */
  var ExampleView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapWidget("#touch-track", DragToFromWidget);
  }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'example'
     */
    template: 'templates/example',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'example'
     */
    className: 'example'

  });

  return ExampleView;

});
