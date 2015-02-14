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

  /** @ngInject */
    .factory('AssessmentService', AssessmentService)

    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(false);
    });
})();
