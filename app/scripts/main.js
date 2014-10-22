'use strict';

angular
  .module('newplayer', [
    'ui.router',
    'ngSanitize'
  ]);

console.log('module created', angular.module('newplayer') );

angular
  .module('newplayer')
  /** @ngInject */
  .controller('AppController' , AppController)
  /** @ngInject */
  .factory('APIService' , APIService)
  /** @ngInject */
  .factory('HomeService' , HomeService)
  /** @ngInject */
  .factory('ManifestService' , ManifestService)

  /** @ngInject */
  .config(Router)
  /** @ngInject */
  .run(function($rootScope, $state, $stateParams){
console.log('run');
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
//    FastClick.attach(document.body);
console.log('angular running?');
  });

console.log('module running');
