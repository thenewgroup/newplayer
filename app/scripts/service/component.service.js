/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .factory('ComponentService', ComponentService);

  /** @ngInject */
  function ComponentService($log, $templateCache, $http/*, $timeout, $http, $q, $rootScope*/) {
    $log.debug('\nComponentService::Init\n');

    var Service = function () {
      var self = this;

      // const
      var COMPONENT_ROOT = 'scripts/component/';
      var PLUGIN_ROOT = 'scripts/plugin/';
      var DEFAULT_TEMPLATE = 'scripts/component/blank.html';

      // must be used during initial load
      // can't be relied upon after prmoise resolves
      var cmpDependencies = [];
      var cmpPlugins = [];


      var initCmp = function (componentObj) {
        //$log.debug( 'ComponentService::initCmp:', cmpType, COMPONENT_ROOT );

        // reset specific-component values
        setCmpDependencies([]);
        setCmpPlugins([]);

        // parse component "type"
        // TBD validate incoming data
        var cmpType = componentObj.type || 'empty';
        var cmpData = componentObj.data;

        // parse component "data" required during component load
        if (!!cmpType && !!cmpData) {
          // "data"."req" - array of URLs to additional dependencies of this component
          var cmpDependencies = cmpData.req;
          if (!!cmpDependencies) {
            // TBD validate incoming data
            addCmpDependencies(cmpType, cmpDependencies);
          }

          var cmpPlugins = cmpData.plugin;
          if (!!cmpPlugins) {
            // TBD validate incoming data
            addCmpPlugins(cmpPlugins);
          }
        }

        // add base dependency
        addCmpDependencies(cmpType, cmpType + '.js');
      };

      var cleanURL = function (cmpType, cmpURL) {
        //$log.debug( 'ComponentService::cleanURL: in:', cmpType, cmpURL );
        if (!!cmpURL && typeof( cmpURL ) === 'string') {
          if (cmpURL.indexOf(COMPONENT_ROOT) === -1) {
            // dependency doesn't already have root
            if (cmpURL.substr(0, 1) === '/') {
              // component is not relative to component directory
              // for now assume they know where they're pointing
              //return cmpURL;
            } else {
              // add root
              cmpURL = COMPONENT_ROOT + cmpType + '/' + cmpURL;
            }
          }
        }
        //$log.debug( 'ComponentService::cleanURL: out:', cmpURL );
        return cmpURL;
      };

      var getCmpDependencies = function () {
        return cmpDependencies;
      };
      var setCmpDependencies = function (cmpDeps) {
        cmpDependencies = cmpDeps;
      };
      var addCmpDependencies = function (cmpType, cmpDeps) {
        $log.info('ComponentService::addCmpDependencies:', cmpType, cmpDeps);
        if (typeof( cmpDeps ) === 'string') {
          cmpDependencies.push(cleanURL(cmpType, cmpDeps));
        } else {
          for (var i in cmpDeps) {
            var cmpDep = cmpDeps[i];
            cmpDependencies.push(cleanURL(cmpType, cmpDep));
          }
        }
      };

      var getCmpPlugins = function () {
        return cmpPlugins;
      };
      var setCmpPlugins = function (cmpPlgns) {
        cmpPlugins = cmpPlgns;
      };
      var addCmpPlugins = function (cmpPlgns) {
        $log.info('ComponentService::addCmpPlugins:', cmpPlgns);
        if (typeof( cmpPlgns ) === 'string') {
          cmpPlugins.push(PLUGIN_ROOT + cmpPlgns + '.js');
        } else {
          for (var i in cmpPlgns) {
            var cmpDep = cmpPlgns[i];
            cmpPlugins.push(PLUGIN_ROOT + cmpPlgns + '.js');
          }
        }
      };

      var getTemplateURL = function (componentObj) {
        var template = DEFAULT_TEMPLATE;
        // TBD validate incoming data
        if (!!componentObj) {
          var cmpType = componentObj.type;
          if (angular.isString(cmpType)) {
            var cmpTemplate = cmpType + '.html';
            var cmpData = componentObj.data;
            if (
              angular.isObject(cmpData) &&
              angular.isString(cmpData.template)) {
              // "data"."template" - override template with URL
              cmpTemplate = cmpData.template;
            }
            // TBD validate incoming data
            $log.debug('ComponentService::load: parseTemplate', componentObj, cmpTemplate);
            template = cleanURL(cmpType, cmpTemplate);
          }
        }
        return template;
      };

      var getDefaultTemplate = function () {
        return DEFAULT_TEMPLATE;
      };

      //var loadDependencies = function (componentObj) {
      //  var cmpType = componentObj.type || 'empty';
      //  var depPromise =
      //    $ocLazyLoad.load(
      //      {
      //        name: cmpType,
      //        serie: (getCmpDependencies().length > 1 ? true : false),
      //        files: getCmpDependencies()
      //      }
      //    )
      //      .then
      //    (
      //      function (resp) {
      //        // success
      //        self.onLoad(componentObj);
      //      }
      //    )
      //      ['catch']
      //    (
      //      function (resp) {
      //        // error
      //        $log.debug('ComponentService::load err:', resp);
      //        self.onLoad(componentObj);
      //      }
      //    );
      //  return depPromise;
      //};
      //
      //var loadPlugins = function () {
      //  var plugPromise =
      //    $ocLazyLoad.load(
      //      {
      //        name: 'newplayer',
      //        files: getCmpPlugins()
      //      }
      //    )
      //      .then(function (resp) {
      //    })
      //      ['catch']
      //    (
      //      function (resp) {
      //        // error
      //        $log.debug('ComponentService::load plugin err:', resp);
      //      }
      //    );
      //  return plugPromise;
      //};
      //
      this.getTemplate = function (componentObj) {
        var templateURL = getTemplateURL(componentObj);

//        $log.info('ComponentService::getTemplate: cmp,templateURL:', componentObj, templateURL);
        if (!!templateURL) {
          var templateData = $templateCache.get(templateURL);
//          $log.info('templateCache', templateData);
          return templateData;
        }
      };
      //
      //this.load = function (componentObj) {
      //  $log.debug('\nComponentService::load:', componentObj.type);
      //
      //  initCmp(componentObj);
      //
      //  $log.debug('ComponentService::loading:', componentObj.type, getCmpDependencies());
      //  var depPromise, plugPromise;
      //  if (getCmpPlugins().length > 0) {
      //    $log.debug('ComponentService::loading:plugins', getCmpPlugins());
      //
      //    plugPromise = loadPlugins();
      //    plugPromise.then(
      //      function (resp) {
      //        depPromise = loadDependencies(componentObj);
      //      }
      //    );
      //    return plugPromise;
      //  } else {
      //    depPromise = loadDependencies(componentObj);
      //    return depPromise;
      //  }
      //};
      //
      //// loaded component can decorate componentService to change loading behavior!?
      //this.onLoad = function (componentObj) {
      //  $log.debug('ComponentService::loaded', componentObj, '\n');
      //};

    };
    return new Service();

  }
})();
