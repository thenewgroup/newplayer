(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .service('npState', NpStateService);

  /** @ngInject */
  function NpStateService($log, $rootScope/*, $timeout, $http, $q, $state, $rootScope,*/) {

    var manifest, lang, pageId,
        npstate = this;

    return {
      showPageId: showPageId
    };

    function showPageId(newPageId) {
      npstate.pageId = newPageId;
      $log.info('npState::showPageId:', npstate.pageId);
      $rootScope.$broadcast('npPageChanged', npstate.pageId);
    }


  }
})();
