/* jshint -W003, -W117 */
(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npMatchRowController',
    function ($log, $scope, $sce) {
      var cmpData = $scope.component.data || {};
      $log.debug('npMatchRow::data', cmpData);

      this.id = cmpData.id;
      this.label = $sce.trustAsHtml(cmpData.label);
      // shuffle em up
      $scope.components = _.shuffle($scope.components);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npMatchRow::component loaded!');
    }
  );
})();
