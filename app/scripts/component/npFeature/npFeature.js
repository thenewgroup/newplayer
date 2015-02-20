(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npFeatureController',
    function ($log, $scope/*, ManifestService*/) {
      var cmpData = $scope.component.data || {};
      $log.debug('npFeature::data', cmpData);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npFeature::component loaded!');
    }
  );
})();

