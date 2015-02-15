(function () {
  'use strict';

  console.info('DEBUG | npVideo IIFT');


  /** @ngInject */
  function NpVideoDirective($log) {
    $log.info('DEBUG | \npVideo::Init\n');
    return {
      restrict: 'EA',
      controller: NpVideoController,
      controllerAs: 'npVideo',
      bindToController: true
    };
  }

  /** @ngInject */
  function NpVideoController($log, $scope, $sce) {

    var vm = this,
        types = $scope.component.data.types;

    if (angular.isArray(types) && types.length > 0) {
      var sources = [];
      for (var typeIdx in types) {
        var type = types[typeIdx];
        sources.push({
          type: type,
          mime: 'video/' + type,
          src: $sce.trustAsResourceUrl($scope.component.data.baseURL + '.' + type)
        });
      }
      $scope.npVideo = {
        sources: sources
      };
    }
  }


  angular
    .module('npVideo')
    /** @ngInject */
    .directive('npVideo', NpVideoDirective);
})();
