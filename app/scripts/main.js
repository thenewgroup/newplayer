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

  /** @ngInject */
    //.factory('AssessmentService', AssessmentService) // no longer using this
    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(true);
    });
})();
