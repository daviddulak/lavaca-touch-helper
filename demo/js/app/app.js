define(function(require) {
  var History = require('lavaca/net/History');
  var ExampleController = require('./net/ExampleController');
  var Application = require('lavaca/mvc/Application');
  require('lavaca/ui/DustTemplate');
  require('jquery-mobile/events/touch');
  require('jquery-mobile/events/orientationchange');


  // Uncomment this section to use hash-based browser history instead of HTML5 history.
  // You should use hash-based history if there's no server-side component supporting your app's routes.
  History.overrideStandardsMode();

  /**
   * Global application-specific object
   * @class app
   * @extends Lavaca.mvc.Application
   */
  var app = new Application(function() {
    this.router.add({
      '/': [ExampleController, 'home']
    });
  });

  return app;

});