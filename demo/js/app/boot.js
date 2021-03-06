require.config({
  baseUrl: 'js',
  paths: {
    '$': '../../bower_components/jquery/jquery.min',
    'jquery': '../../bower_components/jquery/jquery.min',
    'jquery-mobile': '../../bower_components/jquery-mobile/js',
    'cordova': 'libs/cordova',
    'mout': '../../bower_components/mout/src',
    'dust': '../../bower_components/dustjs-linkedin/dist/dust-full-1.1.1',
    'dust-helpers': '../../bower_components/dustjs-linkedin-helpers/dist/dust-helpers-1.1.1',
    'rdust': 'libs/require-dust',
    'lavaca': 'Lavaca',
    'Lavaca': 'lavaca'
  },
  shim: {
    $: {
      exports: '$'
    },
    jquery: {
      exports: '$'
    },
    dust: {
      exports: 'dust'
    },
    'dust-helpers': {
      deps: ['dust']
    },
    templates: {
      deps: ['dust']
    }
  }
});
require(['app/app']);