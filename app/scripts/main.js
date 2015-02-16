(function() {
  'use strict';

  angular
    .module(
    'newplayer',
    [
      'ui.bootstrap',
      'oc.lazyLoad',
      'ngSanitize',
      'newplayer.service',
    ]
  )
    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(false);
    });
})();
