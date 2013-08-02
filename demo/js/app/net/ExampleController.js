define(function(require) {

  var ExampleView = require('app/ui/views/ExampleView'),
      ExampleDrawerView = require('app/ui/views/ExampleDrawerView'),
      BaseController = require('app/net/BaseController'),
      Promise = require('lavaca/util/Promise');

  var ExampleController = BaseController.extend({
    tracker: function(params, model) {
      if (!model) {
        model = {};
      }
      this
        .view(null, ExampleView, model)
        .then(function() {
          this.updateState(model, 'TouchTracker Widget', params.url);
        }.bind(this));
    },
    drawer: function(params, model) {
      if (!model) {
        model = {};
      }
      this
        .view(null, ExampleDrawerView, model)
        .then(function() {
          this.updateState(model, 'Drawer Widget', params.url);
        }.bind(this));
    }
  });

  return ExampleController;

});
