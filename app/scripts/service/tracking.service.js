/* jshint -W004, -W003, -W026, -W040 */
(function () {
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
    $log.warn('\nTrackingService::Init\n');

    var service = {
      trackEvent: angular.noop,
      setCallback: setCallback,
      trackPageView: trackPageView,
      trackExternalLinkClick: trackExternalLinkClick,
      trackApiCall: trackApiCall
    };
    return service;

    function setCallback(fn) {
      // FIXME: receiving the method in isolate scope is a call to scope to get the actual method
      // so we invoke it here to get the method passed in. Is this necessary?
      var func = fn();
      if (func) {
        this.trackEvent = func;
      }
    }

    function trackPageView(pageId) {
      dispatch.call(this, 'pageView', pageId);
    }

    function trackExternalLinkClick(link) {
      dispatch.call(this, 'externalLink', link);
    }

    function trackApiCall(api) {
      dispatch.call(this, 'apiCall', api);
    }

    function dispatch(event, data) {
      this.trackEvent('newplayer.' + event, data);
    }


  }
})();
