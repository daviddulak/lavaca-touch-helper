define(function(require) {

  var ExampleView = require('app/ui/views/ExampleView'),
      BaseController = require('app/net/BaseController'),
      Promise = require('lavaca/util/Promise');

  /**
   * Example controller
   * @class app.net.ExampleController
   * @extends app.net.BaseController
   */
  var ExampleController = BaseController.extend({
    /**
     * Home action, creates a history state and shows a view
     * @method home
     *
     * @param {Object} params  Action arguments
     * @param {Object} model  History state model
     * @return {Lavaca.util.Promise}  A promise
     */
    home: function(params, model) {
      if (!model) {
        model = {};
      }
      this
        .view(null, ExampleView, model)
        .then(function() {
          this.updateState(model, 'Home Page', params.url);
        }.bind(this));
    }
  });

  return ExampleController;

});
