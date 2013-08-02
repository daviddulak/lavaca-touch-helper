define(function(require) {

  var BaseView = require('./BaseView');
  var $ = require('jquery');
  require('rdust!templates/home');

  var HomeView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
  }, {
    template: 'templates/home',
    className: 'home'
  });

  return HomeView;

});