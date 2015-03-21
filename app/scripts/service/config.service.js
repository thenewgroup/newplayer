/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .factory('ConfigService', ConfigService);

  /** @ngInject */
  function ConfigService($log, $rootScope, APIService, ManifestService/*, $timeout, $q, $rootScope*/) {
    $log.debug('configService::Init');

    var Service = function () {
      var self = this;
      var configData = null;
      var manifestId = null;
      var manifestURL = null;
      var overrideURL = null;
      var overrideData = null;

      this.setManifestId = function (id) {
        $log.debug('ConfigService::setManifestId', id);
        self.manifestId = id;
      };
      this.getManifestId = function () {
        return self.manifestId;
      };

      function setManifestURL(url) {
        $log.debug('ConfigService::setManifestURL', url);
        self.manifestURL = url;
      }
      this.setManifestURL = setManifestURL;

      this.getManifestURL = function () {
        return self.manifestURL;
      };

      function setOverrideURL(url) {
        self.overrideURL = url;
      }

      this.getOverrideURL = function () {
        return self.overrideURL;
      };

      function initialize(npConfig) {
        $log.debug('ConfigService::initialize:config:', npConfig, self.getManifestId());

        if (!!npConfig.manifestId) {
          self.setManifestId(npConfig.manifestId);
        } else {
          throw new Error('manifestId cannot be empty');
        }
        if (!!npConfig.manifestURL) {
          setManifestURL(npConfig.manifestURL);
        } else {
          throw new Error('manifestURL cannot be empty');
        }

        if( !!npConfig.overrideURL ) {
          setOverrideURL(npConfig.overrideURL);
        }

        if( !!npConfig.overrideManifest ) {
          setOverride(npConfig.overrideManifest);
        }

        if (!!npConfig.onPageHandler) {
          // run this when the page changes
          $rootScope.$on('npPageIdChanged', function(pageId) {
            npConfig.onPageHandler(pageId);
          });
        }
      }

      function setConfig(data) {
        self.configData = data;
      }

      this.getConfig = function () {
        return self.configData;
      };
      this.getConfigData = function (url) {
        $log.debug('ConfigService::getConfigData:', url);
        var configPromise = self.getData(url);
        configPromise.then(
          function (configData) {
            $log.debug('ConfigService::config data from server ', configData);
            setConfig(configData[0]);
            initialize(configData[0]);
          }
        );
        return configPromise;
      };

      this.setConfigData = function (configData) {
          $log.debug('ConfigService::config data from server ', configData);
          setConfig(configData);
          initialize(configData);
      };

      function setOverride(data) {
        $log.debug('ConfigService::setOverrideData:', data);
        self.overrideData = data;
      }

      this.getOverride = function () {
        return self.overrideData;
      };
      this.getOverrideData = function (url) {
        $log.debug('ConfigService::getOverrideData:', url);
        var overridePromise = self.getData(url);
        overridePromise.then(
          function (overrideData) {
            angular.extend((self.getOverride() || {}), overrideData[0]);
            $log.debug('ConfigService::getOverrideData: merged:', self.getOverride());
          }
        );
        return overridePromise;
      };

    };

    var configService = new Service();
    angular.extend(configService, APIService);

    $log.debug('ConfigService::', configService);
    return configService;

  }
})();
