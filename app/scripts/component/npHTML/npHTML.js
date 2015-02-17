'use strict';

angular
  .module(
  'npHTML',
  []
);

angular
  .module('npHTML')

/** @ngInject */
  .controller('npHTMLController',
  function ($log, $scope, $rootScope, $window, $sce, ManifestService) {
    var vm = this,
        cmpData = $scope.component.data,
        content = null;
    $log.debug('npHTML::data', cmpData);

    if (cmpData.link) {
      this.link = cmpData.link;
    }

    this.content = cmpData.content;
    $log.info('npHTML::content', $scope.content, this.content, cmpData.link);

    this.handleLink = function() {
      //$event.stopPropagation();
      $log.info('npHTML:handleLink');

      if( cmpData.link.match(/\.json$/) ) {
        $log.info('npHTML:handleLink | link is a manifest');
        $rootScope.$broadcast('npReplaceManifest', cmpData.link);

      } else {
        $log.info('npHTML:handleLink | sending user to a location');
        $window.location = cmpData.link;
      }
    }
  }
)

/** @ngInject */
  .run(
  function ($log, $rootScope) {
    $log.debug('npHTML::component loaded!');
  }
);

