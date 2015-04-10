(function() {
  'use strict';

  angular
    .module(
    'newplayer',
    [
      'ui.bootstrap',
      'ngSanitize',
      'newplayer.service',
      'newplayer.component',
      'angular-royalslider',
      'matchMedia'
    ]
  )
    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(true);
    });
})();
