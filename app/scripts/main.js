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
      'angulartics',
      'angulartics.google.tagmanager'
    ]
  )

  /** @ngInject */
    .factory('AssessmentService', AssessmentService)

    .config( /** @ngInject */ function ($logProvider, $analyticsProvider) {
      $logProvider.debugEnabled(false);
      $analyticsProvider.firstPageview(false); /* Records pages that don't use $state or $route */
      $analyticsProvider.withAutoBase(false);  /* Records full path */
    });
})();
