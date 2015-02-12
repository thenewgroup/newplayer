(function() {
  'use strict';

  angular
    .module('newplayer')
    .factory('ConfigService', ConfigService);

  /** @ngInject */
  function ConfigService($log, APIService, ManifestService/*, $timeout, $q, $state, $rootScope*/) {
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
        self.manifestURL = url;
      }

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

        var manifestURL = npConfig.manifestURL;
        if (!!manifestURL) {
          setManifestURL(manifestURL.replace('{manifestId}', self.getManifestId()));
        } else {
          setManifestURL('sample.json');
        }

        var overrideURL = npConfig.overrideURL;
        if (!!overrideURL) {
          setOverrideURL(overrideURL.replace('{manifestId}', self.getManifestId()));
        } else {
          setOverrideURL('sample-override.json');
        }

        $log.debug('ConfigService::initialize: config override data:', npConfig.overrideManifest);
        setOverride(npConfig.overrideManifest);
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
