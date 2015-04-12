(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npContentController',
    function ($log, $scope, $rootScope, ManifestService) {
      var cmpData = $scope.component.data || {};
      //$log.debug('npContent::data', cmpData);

      this.contentTitle = cmpData.title;

      var manifestLang = ManifestService.getLang();

      if (!manifestLang) {
        var firstContentCmp = ManifestService.getFirst('npContent');
        manifestLang = firstContentCmp.data.language;
        //$log.debug('npContent::set lang', manifestLang);
        ManifestService.setLang(manifestLang);
      }

      var cmpLang = cmpData.language;
      if (cmpLang === manifestLang) {
        //$log.debug('npContent::lang match', cmpLang, manifestLang);
        $scope.currentLang = true;
        $scope.currentContent = $scope;

        // set page title
        $rootScope.PageTitle = cmpData.title;
      } else {
        //$log.debug('npContent::wrong lang', cmpLang, manifestLang);
        $scope.currentLang = false;
      }
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      //$log.debug('npContent component loaded!');
    }
  );
})();

