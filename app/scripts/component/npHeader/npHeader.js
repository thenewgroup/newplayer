(function () {

  'use strict';
  angular
    .module('newplayer.component')


  /** @ngInject */
    .controller('npHeaderController',
    function ($log, $scope, $sce) {
      var cmpData = $scope.component.data || {};
      $log.debug('npHeader::data', cmpData);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npHeader::component loaded!');
    }
  );
})();
