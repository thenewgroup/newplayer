(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npFooterController',
    function ($log, $scope/*, $sce*/) {
      var cmpData = $scope.component.data || {};
      $log.debug('npFooter::data', cmpData);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npFooter::component loaded!');
    }
  );
})();
