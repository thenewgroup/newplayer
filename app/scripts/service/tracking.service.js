/* jshint -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .factory('TrackingService', TrackingService);

  /*
   * console:
   * angular.element(document.body).injector().get('TrackingService')
   */

  /** @ngInject */
  function TrackingService($log, $rootScope, ConfigService /*, $timeout, $http, $q */) {
    $log.debug('\nTrackingService::Init\n');

    var Service = function () {
      var self = this;

      this.trackPageView = function (pageId) {
      	ConfigService.tracking('pageView', pageId);
      };

      this.trackExternalLinkClick = function (link) {
      	ConfigService.tracking('externalLink', link);
      };

      this.trackApiCall = function (api) {
      	ConfigService.tracking('apiCall', api);
      };
    };

    return new Service();
  }
})();