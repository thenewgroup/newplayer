/* jshint -W003, -W040 */

(function () {
  'use strict';

  angular
    .module('npReveal', [])
    .run(onRun);

  /**
   * @ngInject
   */
  function onRun($log) {
    $log.debug('npReveal::component loaded!');
  }

  angular.module('npReveal')
    .controller('npRevealController', npRevealController);

  /**
   * @ngInject
   */
  function npRevealController($log, $scope, $sce, ManifestService) {
    var vm = this,
      cmpData = $scope.component.data;
    $log.debug('npReveal::data', cmpData);

    vm.id = cmpData.id;
    vm.content = $sce.trustAsHtml(cmpData.content);
    vm.type = cmpData.type;
    vm.name = cmpData.name;
  }
})();



