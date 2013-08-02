define(function(require) {

  var HomeView = require('app/ui/views/HomeView'),
      BaseController = require('app/net/BaseController'),
      Promise = require('lavaca/util/Promise');


  var ExampleController = BaseController.extend({

    home: function(params, model) {
      if (!model) {
        model = {};
      }
      this
        .view(null, HomeView, model)
        .then(function() {
          this.updateState(model, 'Home Page', params.url);
        }.bind(this));
    }
  });

  return ExampleController;

});
