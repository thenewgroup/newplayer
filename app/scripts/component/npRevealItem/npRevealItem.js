/* jshint -W003, -W040 */

(function () {
  'use strict';

  angular
    .module('npRevealItem', [])
    .run(onRun);

  /**
   * @ngInject
   */
  function onRun($log) {
    $log.debug('npRevealItem::component loaded!');
  }

  angular.module('npRevealItem')
    .controller('npRevealItemController', npRevealItemController);

  /**
   * @ngInject
   */
  function npRevealItemController($log, $scope, $sce, ManifestService) {
    var vm = this,
      cmpData = $scope.component.data;
    $log.debug('npRevealItem::data', cmpData);

  }
})();



