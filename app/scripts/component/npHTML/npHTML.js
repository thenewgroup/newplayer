(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npHTMLController',
    function ($log, $scope, $rootScope) {
      var vm = this,
        cmpData = $scope.component.data,
        content = null;
      //$log.debug('npHTML::data', cmpData);

      if (cmpData.link) {
        this.link = cmpData.link;
      }

      this.content = cmpData.content;

      this.handleLink = function() {
        $rootScope.$broadcast('npReplaceManifest', cmpData.link);
      };
    }
  );
  //
  ///** @ngInject */
  //  .run(
  //  function ($log, $rootScope) {
  //    $log.debug('npHTML::component loaded!');
  //  }
  //);

})();
