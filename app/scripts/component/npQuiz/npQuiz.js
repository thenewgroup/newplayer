(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npQuizController',
    function ($log, $scope, ManifestService, $sce) {
      var cmpData = $scope.component.data;
      $log.debug('npQuiz::data', cmpData);

    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npQuiz::component loaded!');
    }
  );

})();
