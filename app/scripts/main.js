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

  /** @ngInject */
    .factory('AssessmentService', AssessmentService)
    .factory('TriviaService', TriviaService)

    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(false);
    });
})();
