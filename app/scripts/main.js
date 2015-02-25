(function() {
  'use strict';

  angular
    .module(
    'newplayer',
    [
      'ui.bootstrap',
      'ngSanitize',
      'newplayer.service',
      'newplayer.component'
    ]
  )
    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(false);
    });
})();
