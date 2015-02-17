(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npHTMLController',
    function ($log, $scope, $sce) {
      var cmpData = $scope.component.data;
      $log.debug('npHTML::data', cmpData);

      this.content = $sce.trustAsHtml(cmpData.content);
      $log.debug('npHTML::content', $scope.content);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npHTML::component loaded!');
    }
  );

})();
