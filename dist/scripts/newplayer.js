(function() {
  'use strict';

  angular.module('newplayer.service', []);
})();

/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .factory('APIService', APIService);

  /** @ngInject */
  function APIService($log, $http/*, $timeout, $q, $rootScope*/) {
    $log.debug('\nApiService: Init\n');

    var Service = function () {
      var self = this;

      this.getData = function (url) {
        $log.debug('APIService::getData: URL:', url);
        var aPromise =
          $http.get(
            url,
            {
              cache: true
            }
          )
            .then(
            function (data) {
              $log.debug('APIService::Received data from server ', data);
              return data.data;
            }
          );
        return aPromise;
      };

      this.postData = function (url) {
        $log.debug('APIService::postData: URL:', url);
        var aPromise =
          $http.post(
            url,
            {
              cache: true
            }
          )
            .then(
            function (data) {
              $log.debug('APIService::Received data from server ', data);
              return data.data;
            }
          );
        return aPromise;
      };

      /*,
       sendData:function(data){
       $log.debug('APIService::Sending data to '+baseUrl+'/npAPI/',data);
       return $http({
       method: 'POST',
       url: baseUrl+'/npAPI/',
       data: data
       });
       }
       */
    };
    return new Service();

  }

})();

/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .factory('ConfigService', ConfigService);

  /** @ngInject */
  function ConfigService($log, APIService, ManifestService/*, $timeout, $q, $rootScope*/) {
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

/* jshint -W003, -W117, -W004 */
(function () {
  'use strict';

  angular
    .module('newplayer.service')
    .service('i18nService', i18nService);

  /** @ngInject */
  function i18nService($log) {
    var key,
      /* jshint validthis:true */
      vm = this,
      dict = {
        submit: 'Submit',
        next: 'Next',
        pass: 'Congratulations, you scored :USERSCORE:% and have passed this module.',
        fail: 'Sorry, you scored :USERSCORE:% and you needed to score :MINSCORE:% to pass. Try it again!'
      };

    $log.debug('i18n | init');

    function initWithDict(newDict) {
      $log.debug('i18n | initWithDict', newDict);

      for(key in newDict) {
        dict[key] = newDict[key];
      }

      $log.debug('i18n | initWithDict internal dict updated', dict);
    }

    function get(forKey) {
      if( dict.hasOwnProperty(forKey)) {
        return dict[forKey];
      }

      return '';
    }

    var service = {
      initWithDict: initWithDict,
      get: get
    };

    $log.debug('i18n | service init');

    return service;
  }
})();

/* jshint -W004 */
(function () {
  'use strict';
  angular
    .module('newplayer.service')
    .factory('ManifestService', ManifestServiceWrapper);

  /** @ngInject */
  function ManifestServiceWrapper($log, $rootScope) {
    $log.debug('ManifestServiceWrapper');

    var Service = function () {
      var self = this;
      self.ms = null;

      function initialize(data, overrides) {
        //$log.debug('ManifestServiceWrapper initialize w/data');
        self.ms = new ManifestService($log, $rootScope);
        return self.ms.initialize(data, overrides);
      }

      function getAll(cmpType, context) {
        return self.ms.getAll(cmpType, context);
      }

      function getComponent(idx) {
        return self.ms.getComponent(idx);
      }

      function getFirst(cmpType, context) {
        return self.ms.getFirst(cmpType, context);
      }

      function getLang() {
        return self.ms.getLang();
      }

      function getNextPageId() {
        return self.ms.getNextPageId();
      }

      function getPageId() {
        return self.ms.getPageId();
      }

      function goToNextPage() {
        return self.ms.goToNextPage();
      }

      function setLang(lang) {
        return self.ms.setLang(lang);
      }

      function setPageId(pageId, componentIdx) {
        return self.ms.setPageId(pageId, componentIdx);
      }

      self.getAll = getAll;
      self.getComponent = getComponent;
      self.getFirst = getFirst;
      self.getLang = getLang;
      self.getNextPageId = getNextPageId;
      self.getPageId = getPageId;
      self.goToNextPage = goToNextPage;
      self.initialize = initialize;
      self.setLang = setLang;
      self.setPageId = setPageId;
    }; // end Service

    return new Service();
  } // end ManifestServiceWrapper


  /*
   * console:
   * angular.element(document.body).injector().get('ManifestService')
   */

  var ManifestService = function ($log, $rootScope) {
    $log.debug('\nManifestService::Init\n');

    var self = this;
    var manifestInitialized = false;
    var data;
    var overrides;
    var componentIdx;
    var pageComponentIdx;
    // if these are not defined by the route
    // the manifest components will teach this service
    // what the values should be
    var lang;
    var pageId;
    var link;

    function getData() {
      return data;
    }

    function setData(d) {
      data = d;
    }

    function getOverrides() {
      return overrides;
    }

    function setOverrides(data) {
      overrides = data;
    }

    function getComponentIdx() {
      return componentIdx;
    }

    function setComponentIdx(cmpIdx) {
      componentIdx = cmpIdx;
    }

    /*
     * Determines manifest idx of next component when recursing the manifest
     * first looks for sub-component
     * next looks for sibling
     * then it backs up to the parent and looks for sibling until it finds
     * one or gets back to the root
     */
    function getNextComponent() {
      var idx = getComponentIdx();
      var cmp = null;
      if (!idx) {
        idx = [0];
        cmp = self.getComponent(idx);
      } else {
        // get current Component and find next
        cmp = self.getComponent(idx);
        if (!!cmp.components && cmp.components.length > 0) {
          // sub-components exist - go deeper
          idx.push(0);
          cmp = self.getComponent(idx);
        } else {
          // no children - try to find next sibling
          var lastIdx = idx.pop();
          idx.push(++lastIdx);
          cmp = self.getComponent(idx);
          if (!cmp) {
            // no sibling - find closest ancestor's sibling
            var backup = true;
            while (!cmp && backup) {
              if (idx.length > 1) {
                // try parent's sibling
                idx.pop();
                lastIdx = idx.pop();
                idx.push(++lastIdx);
                cmp = self.getComponent(idx);
              } else {
                // back to root - done
                backup = false;
                idx = null;
              }
            }
          }
        }
      }
      setComponentIdx(idx);
      if (!idx) {
        return null;
      }
      return cmp;
    }

    function deserializeIdx(idx) {
      if (angular.isArray(idx)) {
        // return a clone of the array (not the original)
        return idx.slice(0);
      }
      if (typeof (idx) === 'string') {
        // convert string rep of array to integer array
        idx = idx.replace(/[\[\]]/g, '');
        var arr = idx.split(',');
        // force array values to integer
        for (var i = 0; i < arr.length; i++) {
          arr[i] = +arr[i] || 0;  // default to 0 if NaN!?
        }
        return arr;
      }
      return [0];
    }

    function extendDeep(dst) {
      angular.forEach(
        arguments,
        function (obj) {
          if (obj !== dst) {
            angular.forEach(
              obj,
              function (value, key) {
                if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                  extendDeep(dst[key], value);
                } else {
                  dst[key] = value;
                }
              }
            );
          }
        }
      );
      return dst;
    }

    /*
     * Initializes the component for the manifest
     */
    function initializeComponent(cmp) {
      var builderId, newData, localOverrides;
      if (!cmp) {
        return;
      }
      if (!manifestInitialized) {
        // first pass, check overrides and modify this component
        builderId = (cmp.data || {}).builderId;
        localOverrides = getOverrides();
        if (!!localOverrides) {
          newData = localOverrides[builderId];
        }
        if (!!builderId && !!newData) {
          // TBD - improve data sanitization
          if (angular.isString(newData)) {
            newData = newData.replace(/\n/g, ' ');
          }
          // found override for this component!
          $log.debug('ManifestService::initializeComponent: override builderId:', builderId, newData);
          if (typeof (newData) === 'string') {
            switch (newData) {
              case 'delete':
                // get current component's idx
                var cmpIdx = getComponentIdx();
                // get the idx for this component in context of its parent
                var childIdx = cmpIdx.pop();
                // get the parent component
                var parentCmp = self.getComponent(cmpIdx);
                // and delete parent's sub component with index: childIdx
                var thisChild = parentCmp.components.splice(childIdx, 1);
                // parser's current idx is deleted component's parent
                // if deleted component had a older sibling:
                if (childIdx > 0) {
                  // repoint to deleted component's older sibling
                  cmpIdx.push(childIdx - 1);
                  setComponentIdx(cmpIdx);
                }
                break;
              default:
                try {
                  newData = angular.fromJson(newData);
                } catch (e) {
                  //$log.debug('ManifestService::initializeComponent: override: did not know what to do with builderId:', builderId, newData, e);
                }
                break;
            }
          }
          if (typeof (newData) === 'object') {
            //$log.debug('ManifestService::initializeComponent: override: extend:', cmp.data, newData);
            extendDeep(cmp.data, newData);
          }
        }
      }
      // will we ever re-index after manifest initialization!?
      // index component
      cmp.idx = getComponentIdx().slice(0);
      //$log.debug('ManifestService::initializeComponent: initialized:', cmp.idx, cmp);
    }

    /*
     * Gets the component from the manifest specified by the idx array
     * if no idx is specified, use the service's idx
     */
    self.getComponent = function (idx) {
      var cmp;
      if (!idx) {
        // idx not specified, get next using services idx
        //$log.debug('ManifestService::getComponent: getNextComponent');
        cmp = getNextComponent();
        // initialize the component
        initializeComponent(cmp);
      } else {
        idx = deserializeIdx(idx);
        setComponentIdx(idx);
        //$log.debug('ManifestService::getComponent: find component:', idx);
        // traverse idx array to retrieve this particular cmp
        cmp = getData()[idx[0]];
        if (!!cmp) {
          for (var j in idx) {
            if (j > 0) {
              var components = cmp.components;

              //$log.debug('ManifestService::getComponent: looking for components in ', components);
              if (!!components) {
                cmp = components[idx[j]];
                if (!cmp) {
                  //$log.debug('ManifestService::getComponent: no components in travers ', components);
                  // child idx out of range
                  return null;
                }
              } else {
                // no children
                //$log.debug('ManifestService::getComponent: no children ');
                return null;
              }
            }
          }
        } else {
          // root index out of range
          //$log.debug('ManifestService::getComponent: no root');
          return null;
        }
        //$log.debug('ManifestService::getComponent: found:', idx, cmp);
      }
      return cmp;
    };
    /*
     * Searches for the first occurance of the specified component
     * @param {string} cmpType Component type to search for
     * @param {(string|int[])=} context Context in which to do the search
     * @returns {Component}
     */
    self.getFirst = function (cmpType, context) {
      if (!context) {
        context = [0];
      } else {
        context = deserializeIdx(context);
      }
      //$log.debug('ManifestService::getFirst', cmpType, context);
      var cmp = self.getComponent(context);
      while (!!cmp && cmp.type !== cmpType) {
        cmp = getNextComponent();
        // don't search out of context - exclude siblings & parents
        if (!!getComponentIdx() &&
          (getComponentIdx().length < context.length ||
          getComponentIdx()[context.length - 1] !== context[context.length - 1])) {
          return null;
        }
      }
      return cmp;
    };
    /*
     * Searches for all occurances of the specified component
     * @param {string} cmpType Component type to search for
     * @param {(string|int[])=} context Context in which to do the search
     * @returns {Component[]}
     */
    self.getAll = function (cmpType, context) {
      //$log.debug('ManifestService::getAll:initialContext', context);
      if (!context) {
        context = [0];
      } else {
        context = deserializeIdx(context);
      }
      var cmps = [];
      //$log.debug('ManifestService::getAll', cmpType, context);
      var cmp = self.getComponent(context);
      while (!!cmp) {
        //$log.debug('ManifestService::getAll:match?', cmp.type, cmpType);
        if (cmp.type === cmpType) {
          cmps.push(cmp);
          //$log.debug('ManifestService::getAll:match!', cmps);
        }
        cmp = getNextComponent();
        //$log.debug('ManifestService::getAll:in context?', context, getComponentIdx());
        // don't search out of context - exclude siblings & parents
        if (!!getComponentIdx() &&
          (getComponentIdx().length < context.length ||
          getComponentIdx()[context.length - 1] !== context[context.length - 1])) {
          return cmps;
        }
      }
      return cmps;
    };
    self.getLang = function () {
      return self.lang;
    };
    self.setLang = function (lang) {
      self.lang = lang;
    };

    self.getPageId = function () {
      return self.pageId;
    };
    self.setPageId = function (pageId, componentIdx) {
      $log.debug('ManifestService, setPageId', pageId);
      // reset component index for reparsing new page
      if (self.pageId === pageId) {
        return;
      }
      setComponentIdx(null);
      // Not sure if this impacts anything else, so tracking page component ID differently
      self.pageComponentIdx = componentIdx;
      self.pageId = pageId;
      $rootScope.$broadcast('npPageIdChanged', pageId);
    };
    self.getNextPageId = function () {
      var nextPage,
        nextPageComponentIdx,
        i,
        pageParentComponent,
        pageParentComponentIdx,
        thisPageId = self.getPageId();

        $log.debug('ManifestService::getNextPageId', self);
      if (!thisPageId) {
        $log.warn('ManifestService::getNextPageId | thisPage is not valid');
        return;
      }

      pageParentComponentIdx = self.pageComponentIdx.slice(0); // copy the array stack here so we can mangle it

      // We need to start looking for the component after current page component
      i = parseInt(pageParentComponentIdx.pop(), 10); // pop this child off the array so we can have the parent
      i++; // let's always start with the index after ours
      //$log.debug('ManifestService::getNextPageId | for pageId, componentIdx', thisPageId, componentIdx);
      pageParentComponent = self.getComponent(pageParentComponentIdx);
      for (/* initialized above*/; i < pageParentComponent.components.length; i++) {
        var component = pageParentComponent.components[i];
        $log.debug('ManifestService::getNextPageId | -- Evaluating component', component);
        if (component.type === 'npPage') {
          //$log.debug('ManifestService::getNextPageId | --> found npPage');
          if (component.data.id === thisPageId) {
            //$log.debug('ManifestService::getNextPageId | --> ignoring thisPage');
            continue;
          }
          nextPage = component.data.id;
          nextPageComponentIdx = component.idx;
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::component.type======:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::component::', component,
//                                '\n::component.data::', component.data,
//                                '\n::component.data.id::', component.data.id,
//                                '\n::component.data.last::', component.data.last,
//                                '\n::nextPage::', nextPage,
//                                '\n::nextPageComponentIdx::', nextPageComponentIdx,
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
          $log.debug('ManifestService::getNextPageId | --> found nextPage, nextPageComponentIdx', nextPage, nextPageComponentIdx);
          break;
        }
      }
      return nextPage;
    };
    self.getNextPageIdx = function () {
      var thisPageId = self.getPageId();
      var nextPage,
        nextPageComponentIdx,
        i,
        pageParentComponent,
        pageParentComponentIdx = self.pageComponentIdx.slice(0); // copy the array stack here so we can mangle it
      if (!thisPageId) {
        $log.warn('ManifestService::getNextPageIdx | thisPage is not valid');
        return;
      }
      // We need to start looking for the component after current page component
      i = parseInt(pageParentComponentIdx.pop(), 10); // pop this child off the array so we can have the parent
      i++; // let's always start with the index after ours
      //$log.debug('ManifestService::getNextPageIdx | for pageId, componentIdx', thisPageId, componentIdx);
      pageParentComponent = self.getComponent(pageParentComponentIdx);
      for (/* initialized above*/; i < pageParentComponent.components.length; i++) {
        var component = pageParentComponent.components[i];
        $log.debug('ManifestService::getNextPageIdx | -- Evaluating component', component);
        if (component.type === 'npPage') {
          //$log.debug('ManifestService::getNextPageIdx | --> found npPage');
          if (component.data.id === thisPageId) {
            //$log.debug('ManifestService::getNextPageIdx | --> ignoring thisPage');
            continue;
          }
          nextPage = component.data.id;
          nextPageComponentIdx = component.idx;
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::component.type======:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::component::', component,
//                                '\n::component.data::', component.data,
//                                '\n::component.data.id::', component.data.id,
//                                '\n::component.data.last::', component.data.last,
//                                '\n::nextPage::', nextPage,
//                                '\n::nextPageComponentIdx::', nextPageComponentIdx,
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
          $log.debug('ManifestService::getNextPageIdx | --> found nextPage, nextPageComponentIdx', nextPage, nextPageComponentIdx);
          break;
        }
      }
      return nextPageComponentIdx;
    };
    function goToFirstPage() {
      //$log.debug('ManifestService::goToFirstPage | begin');
      var firstPage = self.getFirst('npPage');
      //$log.debug('ManifestService::goToFirstPage | found page', firstPage);

      self.setPageId(firstPage.data.id, firstPage.idx);
    }

    self.goToFirstPage = goToFirstPage;

    self.goToNextPage = function () {
      var thisPageId = self.getPageId();
      var nextPage,
        nextPageComponentIdx,
        i,
        pageParentComponent,
        pageParentComponentIdx = self.pageComponentIdx.slice(0); // copy the array stack here so we can mangle it
      if (!thisPageId) {
        $log.warn('ManifestService::goToNextPage | thisPage is not valid');
        return;
      }
      // We need to start looking for the component after current page component
      i = parseInt(pageParentComponentIdx.pop(), 10); // pop this child off the array so we can have the parent
      i++; // let's always start with the index after ours
      //$log.debug('ManifestService::goToNextPage | for pageId, componentIdx', thisPageId, componentIdx);
      pageParentComponent = self.getComponent(pageParentComponentIdx);
      for (/* initialized above*/; i < pageParentComponent.components.length; i++) {
        var component = pageParentComponent.components[i];
        $log.debug('ManifestService::goToNextPage | -- Evaluating component', component);
        if (component.type === 'npPage') {
          $log.debug('ManifestService::goToNextPage | --> found npPage');
          if (component.data.id === thisPageId) {
            $log.debug('ManifestService::goToNextPage | --> ignoring thisPage');
            continue;
          }
          nextPage = component.data.id;
          nextPageComponentIdx = component.idx;
                        //console.log(
                        //        '\n::::::::::::::::::::::::::::::::::::::component.type======:::::::::::::::::::::::::::::::::::::::::::::::::',
                        //        '\n::component::', component,
                        //        '\n::component.data::', component['data'],
                        //        '\n::component.data.id::', component.data.id,
                        //        '\n::component.data.last::', component.data.last,
                        //        '\n::nextPage::', nextPage,
                        //        '\n::nextPageComponentIdx::', nextPageComponentIdx,
                        //        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                        //        );
          $log.debug('ManifestService::goToNextPage | --> found nextPage, nextPageComponentIdx', nextPage, nextPageComponentIdx);
          break;
        }
      }
      if (!!nextPageComponentIdx) {
        //$log.debug('ManifestService::goToNextPage | sending client to nextPage', nextPage);
        console.log(
          '\n::::::::::::::::::::::::::::::::::::::goToNextPage===goToNextPage:::::::::::::::::::::::::::::::::::::::::::::::::',
          '\n::i::', i,
          '\n::nextPage::', nextPage,
          '\n::thisPageId::', thisPageId,
          '\n::nextPageComponentIdx::', nextPageComponentIdx,
          '\n::pageParentComponentIdx::', pageParentComponentIdx,
          '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
        );
        self.setPageId(nextPage, nextPageComponentIdx);
        return true;
      }
      $log.debug('ManifestService::goToNextPage | no valid next page found, returning false');
      return false;
    };
    self.initialize = function (data, overrides) {
      $log.debug('ManifestService::initialize (now with more init)', data, overrides);
      manifestInitialized = false;
      //pageComponentIdx = null;
      //lang = null;
      //pageId = null;
      //link = null;

      if (!!data) {
        setData(data);
      } else {
        setData(null);
      }
      if (!!overrides) {
        setOverrides(overrides[0]);
      } else {
        setOverrides(null);
      }

      var cmp = self.getComponent();
      //$log.debug('ManifestService::initialize:initialParse', cmp);
      while (!!cmp) {
        cmp = self.getComponent();
      }

      //$log.debug('ManifestService::initialize:manifest data:', getData());
      manifestInitialized = true;

      //goToFirstPage();
      setComponentIdx(null);
    };
  };
})();

/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .factory('ComponentService', ComponentService);

  /** @ngInject */
  function ComponentService($log, $templateCache, $http/*, $timeout, $http, $q, $rootScope*/) {
    //$log.debug('\nComponentService::Init\n');

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
        $log.debug( 'ComponentService::initCmp:', cmpType, COMPONENT_ROOT );

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
            //$log.debug('ComponentService::load: parseTemplate', componentObj, cmpTemplate);
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
    $log.debug('\nTrackingService::Init\n');

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

/* jshint -W003, -W117, -W004 */
(function () {
  'use strict';

  angular
    .module('newplayer.service')
    .service('AssessmentService', AssessmentService);

  /** @ngInject */
  function AssessmentService($log, $rootScope, ConfigService, AssessmentIOService) {
    var assessmentID, pages, questions,
      vm = this,
      isAssessing,
      minPassing = 0,
      io = AssessmentIOService,              // This is the I/O module for saving/restoring assessment stuff
      config = ConfigService.getConfig();

    if (config.hasOwnProperty('assessmentIO') && typeof config.assessmentIO === 'object' && config.assessmentIO.hasOwnProperty('updateFinal')) {
      $log.debug('[Assessment] using assessmentIO from config');
      setIO(config.assessmentIO);
    } else {
      $log.debug('[Assessment] using default assessmentIO');
    }

    // NOTE: this function is run below to initialize this service

    /**
     * Initializes the assessment service back to its 'blank' state.
     */
    function reset() {
      assessmentID = false;
      isAssessing = false;
      minPassing = -1;

      questions = {
        required: 0, total: 0, inventory: {},
        answered: {requiredCorrect: 0, inventory: {}}
      };

      pages = {
        required: 0, total: 0, inventory: {},
        viewed: {required: 0, inventory: {}}
      };
    }

  // NOTE: reset when the IIFE executes after the script is loaded.
    reset();

    /**
     * Begins an assessment session for a given ID and optionally a minimum passing score
     *
     * @param id The unique string for this assessment to identify it to the backend
     * @param newMinPassing A fractional number from 0 to 1 (e.g. 0.75 for 75%)
     */
    function beginFor(id, newMinPassing) {
      //$log.debug('Beginning assessments for ', id, newMinPassing);

      reset();
      assessmentID = id;
      setMinPassing(newMinPassing);

      isAssessing = true;
    }

    /**
     * Mark assessment as complete, whatever that will mean to the end system
     */
    function finalize() {
      if (!isAssessing) {
        //$log.debug('Assessment:finalize | assessment is disabled, ignoring');
        return;
      }

      //$log.debug('NP assessment::finalize | Finalizing assessments for ', assessmentID);

      // TODO - should this wait for a promise?
      io.updateFinal(getAssessment());

      isAssessing = false;
    }


    function getAssessment() {
      return {
        assessmentID: assessmentID,
        isAssessing: isAssessing,
        isPassing: isPassing(),
        minPassing: minPassing,
        pages: pages,
        questions: questions,
        score: getScore()
      };
    }

    /**
     * This sets the mechanism for how the assessment service communicates data
     * to an external data store. See the example in the assessmentio.service.js
     *
     * @see app/scripts/service/assessmentio.service.js
     */
    function setIO(newAssessmentIO) {
      // at some point this may change to validating the plugin
      io = newAssessmentIO;
    }

    // ---------------------------| Scoring

    /**
     * Get the minimum passing score
     * @returns {number} fraction of 1 (e.g. 0.6 for 60%)
     */
    function getMinPassing() {
      return minPassing;
    }

    /**
     * Sets the minimum passing score for this assessment.
     *
     * @param newMinPassing {number} fraction of 1 (e.g. 0.6 for 60%)
     */
    function setMinPassing(newMinPassing) {
      //$log.info('Assessment:setMinPassing', minPassing);

      newMinPassing = parseFloat(newMinPassing);

      if (!isNaN(newMinPassing)) {

        if (newMinPassing > 1) {
          $log.warn('[Assessment::setMinPassing] minPassing should be a fraction of 1. It is unlikely users will pass this assessment.', newMinPassing);
        }

        minPassing = newMinPassing;

      } else if (minPassing === -1 && config.hasOwnProperty('minPassing')) {
        minPassing = config.minPassing;
      } else if( minPassing === -1 ) {
        $log.warn('[Assessment::setMinPassing] no minimum passing score provided to beginFor or in config; any score will pass.');
        minPassing = 0;
      }
    }

    /**
     * Get the user's current score according to page and answer counts
     *
     * @return score from 0..1. Returns 1 if there are no required questions or answers.
     */
    function getScore() {

      if (!isAssessing) {
        return 0;
      }


      /*
       * (# of req. pages viewed + # of correctly answered req. questions) /
       *      (total req. pages + total req. questions)
       */

      var totalRequired = pages.required + questions.required;

      // User scores 100% if there are no requirements...
      if (totalRequired === 0) {
        return 1;
      }

      return Math.min(( pages.viewed.required + questions.answered.requiredCorrect ) / totalRequired, 1);
    }

    /**
     * Determine if the user is passing based on the minPassing score
     *
     * @return bool
     */
    function isPassing() {

      if (!isAssessing) {
        return false;
      }

      if (minPassing === 0) {
        return true;
      }

      return getScore() >= minPassing;
    }

    // ---------------------------| Pages

    function setRequiredPages(newRequiredPages) {

      var requiredPagesInt = parseInt(newRequiredPages);

      if( isNaN(requiredPagesInt)) {
        $log.error('Assessment:setRequiredPages | pages must be a number');
        return;
      }

      pages.required = requiredPagesInt;
    }

    /**
     * Add a potential page to view and whether it is required for score
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param pageIsRequired bool Whether the page was required so it can help user's score.
     */
    function addPage(pageName, pageIsRequired) {

      $log.info('[Assessment::addPage] name, required?', pageName, pageIsRequired);

      // look in the inventory to see if this property already exists
      if (pages.inventory.hasOwnProperty(pageName)) {
        $log.warn('[Assessment::addPage] ignoring duplicate page ' + pageName);
      } else {
        pages.total++;
        pages.inventory[pageName] = pageIsRequired;
        pages.viewed.inventory[pageName] = false;

        // NOTE: commented for now, we're for now declaring the number of required pages directly
        //if (pageIsRequired) {
        //  pages.required++;
        //}
      }
    }

    /**
     * Record that a page was viewed
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     */
    function pageViewed(pageId) {
      //$log.info('[Assessment::pageViewed]  ', pageId);

      if (pages.viewed.inventory[pageId] === false) {
        pages.viewed.inventory[pageId] = new Date();

        if (pages.inventory[pageId] === true) {
          pages.viewed.required++;

          if (isAssessing) {
            io.updatePage(pageId, getAssessment());
          }
        }
      } else {
        $log.warning('Assessment:pageViewed | page already viewed, ', pageId);
      }
    }

    /**
     * Gets all pageview data
     *
     * @return obj of pageview stats
     */
    function getPageStats() {
      return pages;
    }

    /**
     * Gets the count of number of unique pageviews
     * @returns {pages.viewed.total|*}
     */
    function getPageviewsCount() {
      return pages.viewed.total;
    }



    // ---------------------------| Q+A


    function setRequiredQuestions(newRequiredQuestions) {

      var requiredQuestionsInt = parseInt(newRequiredQuestions);

      if( isNaN(requiredQuestionsInt)) {
        $log.error('[Assessment::setRequiredQuestions] questions must be a number');
        return;
      }

      questions.required = requiredQuestionsInt;
      dumpState();
    }

    /**
     * Record that a question was correctly answered and whether it was required
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param pageIsRequired bool Whether the page was required so it can help user's score.
     */
    function addQuestion(questionName, questionIsRequired) {

      $log.info('[Assessment::addQuestion] name, required?', questionName, questionIsRequired);

      // look in the inventory to see if this property already exists
      if (questions.inventory.hasOwnProperty(questionName)) {
        $log.warn('[Assessment::addQuestion] ignoring duplicate page ' + questionName);
      } else {
        questions.total++;
        questions.inventory[questionName] = questionIsRequired;
        questions.answered.inventory[questionName] = {
          isCorrect: null,
          isRequired: questionIsRequired,
          answered: false
        };

        //NOTE: We are setting question required count through setRequiredQuestions()
        //if (questionIsRequired) {
        //  questions.required++;
        //}
      }
    }

    /**
     * Record that a question was correctly answered and whether it was required
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param isCorrect bool Whether the answer provided is correct
     */
    function questionAnswered(questionId, isCorrect) {

      $log.info('[Assessment::questionAnswered] ', questionId, isCorrect);

      // double-check this has an entry
      if (!questions.inventory.hasOwnProperty(questionId)) {
        $log.warn('[Assessment::questionAnswered] answered question has no registered question, defaulting to NOT required.', questionId);
        addQuestion(questionId, false);
      }

      if (questions.answered.inventory[questionId].answered === false) {
        questions.answered.inventory[questionId].answered = new Date();
        questions.answered.inventory[questionId].isCorrect = !!isCorrect;

        if (isCorrect && questions.answered.inventory[questionId].isRequired) {
          questions.answered.requiredCorrect++;
        }

        if (isAssessing) {
          io.updateQuestion(questionId, getAssessment());
        }

      } else {
        $log.warn('[Assessment::questionAnswered] question already answered, ', questionId);
      }
    }

    /**
     * Gets all questions stats
     *
     * @return obj of questions stats
     */
    function getQuestionStats() {
      return questions;
    }

    /**
     * DEBUG ONLY
     */
    function dumpState() {
      $log.info('[Assessment:dumpState] ', getAssessment());
    }

    var service = {
      beginFor: beginFor,
      finalize: finalize,
      getAssessment: getAssessment,
      reset: reset,
      setIO: setIO,

      //--- Scoring
      getMinPassing: getMinPassing,
      getScore: getScore,
      isPassing: isPassing,
      setMinPassing: setMinPassing,

      //--- Pages
      addPage: addPage,
      getPageviewsCount: getPageviewsCount,
      getPageStats: getPageStats,
      pageViewed: pageViewed,
      setRequiredPages: setRequiredPages,

      //--- Questions
      addQuestion: addQuestion,
      getQuestionStats: getQuestionStats,
      questionAnswered: questionAnswered,
      setRequiredQuestions: setRequiredQuestions,

      // DEBUG
      dumpState: dumpState
    };

    $log.info('[Assessment] service init');

    return service;
  }
})();

/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .service('AssessmentIOService', AssessmentIO);

  /** @ngInject */
  function AssessmentIO($log) {
    var vm = this;
      vm.type = 'AssessmentIO (default)';

    vm.updateQuestion = function(questionID, assessment) {
      $log.debug('AssessmentIO::updateQuestion function stub', questionID, assessment);
    };

    vm.updatePage = function(pageID, assessment) {
      $log.debug('AssessmentIO::updatePage function stub', pageID, assessment);
    };

    vm.updateFinal = function(assessment) {
      $log.debug('AssessmentIO::updateFinal function stub', assessment);
    };

    vm.retrieve = function() {
      $log.debug('AssessmentIO.log::retrieve function stub');
    };
  }
})();

(function () {
  'use strict';
  angular.module('newplayer.component', ['newplayer.service']);
})();

/* jshint -W003, -W038, -W004 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .directive('npComponent', ComponentDirective);
    /** @ngInject */
    function ComponentDirective($log, ManifestService, ComponentService, $compile/*, $timeout*/) {
        //$log.debug('\nnpComponent::Init\n');
        var Directive = function () {
            var vm = this;
            this.restrict = 'EA';
            this.scope = true;
            /** @ngInject */
            this.controller =
                    function ($scope, $element, $attrs) {
                        //$log.debug('npComponent::controller', $element, $attrs);
                        /*
                         var $attributes = $element[0].attributes;
                         */
                        //parseComponent( $scope, $element, $attrs );
                    };
            this.controllerAs = 'vm';
            this.compile = function (tElement, tAttrs, transclude) {
                /** @ngInject */
                return function ($scope, $element, $attributes) {
                    //$log.debug('npComponent::compile!');
                    parseComponent($scope, $element, $attributes);
                };
            };
            function compileTemplate(html, $scope, $element) {
                var compiled = $compile(html);
                compiled($scope, function (clone) {
                    $element.append(clone);
                });
                /*
                 // if moving back up to parent
                 if ( !!cmp.components && cmp.components.length > 0 )
                 {} else {
                 compiled = $compile( '<np-component>appended to ' + cmp.type + '</np-component>' );
                 linked = compiled($scope);
                 $element.append( linked );
                 }
                 */
            }
            /*
             * parses a component pulled in from the manifest service
             */
            function parseComponent($scope, $element, $attributes) {
                var cmp = ManifestService.getComponent($attributes.idx);
                var cmpIdx = cmp.idx || [0];
                //$log.debug('npComponent::parseComponent', cmp, cmpIdx, $attributes);
                if (!!cmp) {
                    //ComponentService.load(
                    //  cmp
                    //)
                    //  .then(
                    //  function () {
                    //$log.debug('npComponent::parseComponent then', cmp, cmpIdx);
                    // reset scope!!!
                    $scope.subCmp = false;
                    $scope.component = cmp;
                    $scope.components = null;
                    $scope.cmpIdx = cmpIdx.toString();
                    $element.attr('data-cmpType', cmp.type);
                    $element.addClass('np-cmp-sub');
                    if (!!cmp.data) {
                        // set known data values
                        var attrId = cmp.data.id;
                        if (!attrId) {
                            attrId = cmp.type + ':' + cmpIdx.toString();
                        }
                        // id must start with letter (according to HTML4 spec)
                        if (/^[^a-zA-Z]/.test(attrId)) {
                            attrId = 'np' + attrId;
                        }
                        // replace invalid id characters (according to HTML4 spec)
                        attrId = attrId.replace(/[^\w\-.:]/g, '_');
                        //$element.attr( 'id', attrId );
                        if (!cmp.data.id) {
                            cmp.data.id = attrId;
                        }
                        $element.attr('id', 'np_' + attrId);
                        var attrClass = cmp.data['class'];
                        if (angular.isString(attrClass)) {
                            attrClass = attrClass.replace(/[^\w\- .:]/g, '_');
                            var classArraySpace = attrClass.split(' ');
                            for (var ii in classArraySpace) {
                                $element.addClass('np_' + classArraySpace[ii]);
                            }
                        }
                        var attrPlugin = cmp.data.plugin;
                        if (angular.isString(attrPlugin)) {
                            attrPlugin = attrPlugin.replace(/[^\w\-.:]/g, '_');
                        }
                    }
                    if (!!cmp.components && cmp.components.length > 0) {
                        //$log.debug('npComponent::parseComponent - HAS SUBS:', cmp);
                        $scope.subCmp = true;
                        $scope.components = cmp.components;
                    }
                    var templateData = ComponentService.getTemplate(cmp);
                    //$log.debug('npComponent::parseComponent: template', templateData);
                    // modify template before compiling!?
                    var tmpTemplate = document.createElement('div');
                    tmpTemplate.innerHTML = templateData;
                    var ngWrapperEl, ngMainEl, ngSubEl;
                    ngWrapperEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-wrapper'));
                    ngMainEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-main'));
                    ngSubEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-sub'));
                    if (ngWrapperEl.length) {
                        ngWrapperEl.attr('id', attrId);
                        ngWrapperEl.addClass(attrPlugin);
                        // pass all "data-*" attributes into element
                        angular.forEach(cmp.data, function (val, key) {
                            if (angular.isString(key) && key.indexOf('data-') === 0) {
                                ngWrapperEl.attr(key, val);
                            }
                        });
                    }
                    if (ngMainEl.length) {
                        if (!ngWrapperEl.length) {
                            ngMainEl.attr('id', attrId);
                            ngMainEl.addClass(attrPlugin);
                            // pass all "data-*" attributes into element
                            angular.forEach(cmp.data, function (val, key) {
                                if (angular.isString(key) && key.indexOf('data-') === 0) {
                                    ngMainEl.attr(key, val);
                                }
                            });
                        }
                        ngMainEl.addClass(attrClass);
                    }
                    compileTemplate(tmpTemplate.innerHTML, $scope, $element);
                }
            }
        };
        return new Directive();
    }
})();

(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npAnswerController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data || {};
                        this.id = cmpData.id;
                        this.label = $sce.trustAsHtml(cmpData.label);
                        var vm = this;
//                                checkmark = $element.find('svg#Layer_1'),
//                                cmpData = $scope.component.data || {}; // already defined above
                        vm.isCorrect = cmpData.correct;
                      // updateCheck is currently not defined but needed. Should it be the code below?
                      var updateCheck = angular.noop;
//                        var updateCheck = function () {
//                            var tweenOptions = {ease: Power3.easeOut};

//                            if (vm.checked) {
//                                tweenOptions.autoAlpha = 1;
//                            } else {
//                                tweenOptions.autoAlpha = 0;
//                            }
                        //$log.debug('updateCheck', checkmark, tweenOptions);
//                            TweenMax.to(checkmark, 0.25, tweenOptions);
//                        };
                        //$log.debug('npAnswer::data', cmpData);
                        vm.id = cmpData.id;
                        vm.label = $sce.trustAsHtml(cmpData.label);
                        vm.question = null;
                        vm.checked = false;
                        vm.setQuestion = function (idx, question) {
                            vm.question = question;
                            question.registerAnswer(idx, this);
                        };
                        vm.clicked = function ($event) {
                            //$log.debug('npAnswer clicked', $event, cmpData);
                            if (vm.question.type === 'checkbox') {
                                vm.checked = !vm.checked;
                                vm.question.answerChanged(vm);
                            } else if (vm.question.type === 'radio') {
                                vm.checked = true;
                                vm.question.answerChanged(vm);
                            }
//                            updateCheck();
                        };
                        vm.clear = function () {
                            vm.checked = false;
//                            updateCheck();
                        };
                    }
            )
            .directive('npAnswerCheckbox', function () {
                return function ($scope, $element, $sce) {
                    var cmpData = $scope.component.data || {};
//                    this.label = $sce.trustAsHtml(cmpData.label);
                    console.log(
                            '\n::::::::::::::::::::::::::::::::::::::npAnswerCheckbox::inside:::::::::::::::::::::::::::::::::::::::::::::::::',
                            '\n::this::', this,
                            '\n::cmpData::', cmpData,
                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                            );
                    setTimeout(function () {
                        $scope.$apply(function () {
                            //////////////////////////////////////////////////////////////////////////////////////
                            //set states
                            //////////////////////////////////////////////////////////////////////////////////////
                            var checkboxX = $element.find('.checkbox-x');
                            TweenMax.set(checkboxX, {autoAlpha: 0, scale: 2.5, force3D: true});
                            $scope.update = function (event) {
                                var clickedCheckbox = event.currentTarget;
                                var $checkbox = $(clickedCheckbox).find('.checkbox-x');
                                $checkbox.attr('checked', !$checkbox.attr('checked'), ('true'));
                                //////////////////////////////////////////////////////////////////////////////////////
                                //update states on click
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ($checkbox.attr('checked') === 'checked') {
//                                    console.log(
//                                            '\n::::::::::::::::::::::::::::::::::::::npAnswerCheckbox::inside:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                            '\n::this::', this,
//                                            '\n::this.npAnswer::', this.npAnswer,
//                                            '\n::this.label::', this.label,
//                                            '\n::$checkbox.attr(checked)::', $checkbox.attr('checked'),
//                                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                            );
                                    TweenMax.to($(clickedCheckbox).find('.checkbox-x'), 0.75, {
                                        autoAlpha: 1,
                                        scale: 0.7,
                                        ease: Power3.easeOut
                                    });
                                } else if ($checkbox.attr('checked') !== 'checked') {
                                    TweenMax.to($(clickedCheckbox).find('.checkbox-x'), 0.25, {
                                        autoAlpha: 0,
                                        scale: 2.5,
                                        ease: Power3.easeOut
                                    });
                                }
                            };
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        //$log.debug('npAnswer::component loaded!');
                    }
            );
})();




//(function () {
//  'use strict';
//  angular
//    .module('newplayer.component')
//  /** @ngInject */
//    .controller('npAudioController', function ($log, $scope, $sce, $element) {
//      var cmpData = $scope.component.data;
//      $log.debug('npAudio::data', cmpData, $element);
//      this.id = cmpData.id;
//      this.baseURL = cmpData.baseURL;
//      if (cmpData.poster){
//        $scope.poster = cmpData.poster;
//      }
//      // audio source elements need to be static BEFORE mediaElement is initiated
//      // binding the attributes to the model was not working
//      // alternatively, fire the mediaelement after the source attributes are bound?
//      var types = cmpData.types;
//      if (angular.isArray(types) && types.length > 0){
//        $log.debug('npAudio::data:types', types);
//        var sources = '';
//        for (var typeIdx in types){
//          var type = types[typeIdx];
//          $log.debug('npAudio::data:types:type', typeIdx, type);
//          sources += '<source type="audio/' + type + '" src="' + this.baseURL + '.' + type + '" />';
//          $scope[type] = this.baseURL + '.' + type;
//        }
//        $scope.sources = sources;
//      }
//    }
//  )
//    .directive('mediaelement', npMediaElementDirective)
//  /** @ngInject */
//    .run(
//    function ($log, $rootScope)
//    {
//      $log.debug('npAudio::component loaded!');
//    }
//  );
//  /** @ngInject */
//  function npMediaElementDirective($log) {
//    $log.debug('\nmediaelementDirective::Init\n');
//    var Directive = function () {
//      this.restrict = 'A';
//      this.link = function (scope, element, attrs, controller) {
//        jQuery(element).attr('poster', scope.poster);
//        jQuery(element).attr('src', scope.mp4);
//        jQuery(element).prepend(scope.sources);
//        attrs.$observe('src', function () {
//          $log.debug('mediaelementDirective::element', element);
//          jQuery(element).mediaelementplayer();
//        });
//      };
//    };
//    return new Directive();
//  }
//})();
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/* jshint -W003 */

(function () {
  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .directive('npAudio', NpAudioDirective);
  /** @ngInject */
  function NpAudioDirective($log) {
    $log.info('DEBUG | \npAudio::Init\n');
    return {
      restrict: 'EA',
      controller: NpAudioController,
      controllerAs: 'npAudio',
      bindToController: true
    };
  }
  /** @ngInject */
  function NpAudioController($log, $scope, $sce) {
    var vm = this,
        types = $scope.component.data.types;
    if (angular.isArray(types) && types.length > 0) {
      var sources = [];
      for (var typeIdx in types) {
        var type = types[typeIdx];
        sources.push({
          type: type,
          mime: 'audio/' + type,
          src: $sce.trustAsResourceUrl($scope.component.data.baseURL + '.' + type)
        });
      }
      $scope.npAudio = {
        sources: sources
      };
    }
  }
})();
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//(function () {
//  'use strict';
//  angular
//    .module('newplayer.component')
//  /** @ngInject */
//    .directive('npVideo', NpVideoDirective);
//  /** @ngInject */
//  function NpVideoDirective($log) {
//    $log.info('DEBUG | \npVideo::Init\n');
//    return {
//      restrict: 'EA',
//      controller: NpVideoController,
//      controllerAs: 'npVideo',
//      bindToController: true
//    };
//  }
//  /** @ngInject */
//  function NpVideoController($log, $scope, $sce) {
//    var vm = this,
//        types = $scope.component.data.types;
//    if (angular.isArray(types) && types.length > 0) {
//      var sources = [];
//      for (var typeIdx in types) {
//        var type = types[typeIdx];
//        sources.push({
//          type: type,
//          mime: 'video/' + type,
//          src: $sce.trustAsResourceUrl($scope.component.data.baseURL + '.' + type)
//        });
//      }
//      $scope.npVideo = {
//        sources: sources
//      };
//    }
//  }
//})();

(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npButtonController',
                    function ($log, $scope, $sce, $location, $element, ConfigService, ManifestService, APIService, TrackingService) {
                        var cmpData = $scope.component.data || {};
                        $log.debug('npButton::data', cmpData);
                        this.content = '';
                        var btnContent = cmpData.content;
                        if (angular.isString(btnContent)) {
                            this.content = $sce.trustAsHtml(btnContent);
                        }
                        this.link = '';
                        this.target = cmpData.target;
                        this.npButton = buttonType;
                        this.linkInternal = true;
                        this.apiLink = false;
                        var btnLink = cmpData.link;
                        var buttonType = cmpData.type;
                        //////////////////////////////////////////////////////////////////////////////////////
                        //check type and add class if next button type
                        //////////////////////////////////////////////////////////////////////////////////////
                        if (typeof buttonType !== 'undefined' && buttonType === 'btn-next') {
                            $scope.buttonTypeClass = buttonType;
                        }
                        if (angular.isString(btnLink)) {
                            if (btnLink.indexOf('/') === 0) {
                                if (/^\/api\//.test(btnLink)) {
                                    this.apiLink = true;
                                    this.linkInternal = false;
                                } else {
                                    if (!this.target) {
                                        this.target = '_top';
                                    }
                                    this.linkInternal = false;
                                }
                            } else if (/^([a-zA-Z]{1,10}:)?\/\//.test(btnLink)) {
                                if (!this.target) {
                                    this.target = '_blank';
                                }
                                this.linkInternal = false;
                            } else if (typeof ManifestService.getPageId() === 'undefined' || ManifestService.getPageId() === '') {
                                if (!this.target) {
                                    this.target = '_blank';
                                }
                                ManifestService.goToNextPage();
                            } else {
                                if (btnLink.indexOf('#') === 0) {
                                    btnLink = btnLink.substr(1);
                                } else {
                                    btnLink = '/' + ConfigService.getManifestId() + '/' + btnLink;
                                }
                            }
                            $log.debug('npButton::link', btnLink);
                            this.link = $sce.trustAsResourceUrl(btnLink);
                        }
                        this.go = function () {
                            if (this.linkInternal) {
                                ManifestService.goToNextPage();
                            } else {
                                if (this.apiLink) {
                                    //TODO: we may need a `method` property to know what to use here
                                    // i.e. GET, POST, PUT, DELETE
                                    TrackingService.trackApiCall(btnLink);
                                    APIService.postData(btnLink);
                                    return;
                                }
                                window.open(this.link, this.target);
                            }
                        };
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npButton::component loaded!');
                    }
            );
})();

(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npColumnController',
    function ($log, $scope, $sce) {
      var chunk = function (arr, size) {
        var newArr = [];
        for (var i = 0; i < arr.length; i += size) {
          newArr.push(arr.slice(i, i + size));
        }
        return newArr;
      };


      var cmpData = $scope.component.data || {};
      //$log.debug('npColumn::data', cmpData);

      var childCount = $scope.component.components.length;
      var columns = +cmpData.cols;
      if (!columns) {
        columns = childCount;
      }

      $scope.rows = chunk($scope.component.components, columns);

      this.lastRow = Math.ceil(childCount / columns);
      this.lastRowIndex = columns * Math.floor(childCount / columns);
      this.lastRowColumns = (childCount % columns === 0) ? columns : (childCount % columns);
      this.columns = columns;
      this.columnSpan = Math.floor(12 / columns);
      this.columnSpanLast = Math.floor(12 / this.lastRowColumns);
      this.columnWidth = 100 / columns;
    }
  )

  /** @ngInject */
    .run(
    function ($log) {
      //$log.debug('npColumn::component loaded!');
    }
  );

})();

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


(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npFeatureController',
                    function ($log, $scope, ManifestService, $element) {
                        var cmpData = $scope.component.data || {};
                        //$log.debug('npFeature::data', cmpData);
                    }
            )
            .directive('newPlayerPageTop', function () {
                return function ($scope, $element, attrs, ManifestService) {
                    setTimeout(function () {
                        $scope.$apply(function () {
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::ManifestService::Initialize:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::ManifestService.initialize()::', ManifestService,
//                                    '\n::$scope::', $scope,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
//                            var cmpData = $scope.component.data || {};
//                            ManifestService.initialize($scope);
//                            ManifestService.initializeComponent($scope.component);
//                            var np_wrapper = $element.find('.np_outside-padding');
//                            var hotspotImage = $element.find('.hotspotImage');
//                            var page_container = $element.find('.modal-open');
//                            var page_container = $('.modal-open');
//                            TweenMax.to(np_wrapper, 0.25, {
//                                autoAlpha: 0.25,
//                                ease: Power2.easeOut
//                            });
//                            function scroller() {
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::page_container::', page_container,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
//                                TweenMax.to(page_container, .75, {
//                                    scrollTo: {y: 0},
//                                    ease: Power2.easeInOut,
//                                    onComplete: atTop
//                                });
//                            }
//                            function atTop() {
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::page_container::', page_container,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
//                                TweenMax.to(np_wrapper, 0.5, {
//                                    autoAlpha: 1,
//                                    ease: Power2.easeOut
//                                });
//                            }
//                            scroller();
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        //$log.debug('npFeature::component loaded!');
                    }
            );
})();


(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npFooterController',
    function ($log, $scope/*, $sce*/) {
      var cmpData = $scope.component.data || {};
      $log.debug('npFooter::data', cmpData);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npFooter::component loaded!');
    }
  );
})();

(function () {

  'use strict';
  angular
    .module('newplayer.component')


  /** @ngInject */
    .controller('npHeaderController',
    function ($log, $scope, $sce) {
      var cmpData = $scope.component.data || {};
      $log.debug('npHeader::data', cmpData);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npHeader::component loaded!');
    }
  );
})();

/* jshint -W003, -W117 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .controller('npHotspotController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data;
                        var buttonData = $scope.feedback || {};
                        var contentAreaHeight;
                        $log.debug('npHotspot::data', cmpData, buttonData);
                        var hotspotButtons = '';
                        this.hotspotButtons = cmpData.hotspotButtons;
                        this.id = cmpData.id;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        //////////////////////
                        var contentArea = '';
                        setTimeout(function () {
                            $scope.$apply(function () {
                                contentArea = $element.find('.content-area');
                                function onPageLoadSet() {
//                                    hotspotButton = $('.hotspotButton');
                                    TweenMax.set(contentArea, {opacity: 0, force3D: true});
                                }
                                onPageLoadSet();
                            });
                        });
                        $scope.feedback = this.feedback = cmpData.feedback;
                        $scope.image = this.image = cmpData.image;
                        //////////////////////
                        this.update = function (button) {
                            this.feedback = button.feedback;
                            var idx = this.hotspotButtons.indexOf(button);
                            //////////////////////
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::button::', button,
                                    '\n::idx::', idx,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            $scope.$watch('npHotspot.feedback', function (newValue, oldValue) {
                                contentAreaHeight = 0;
                                TweenMax.to(contentArea, 1, {
                                    opacity: 1,
                                    ease: Power4.easeOut
                                });
                                $('.npHotspot-feedback p').each(function (index, totalArea) {
                                    contentAreaHeight = contentAreaHeight + $(this).outerHeight(true);
                                    TweenMax.to($('.content-background'), 1, {
                                        height: contentAreaHeight + 25,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($('.npHotspot-feedback'), 0.1, {
                                        opacity: 0,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($('.npHotspot-feedback'), 0.5, {
                                        delay: 0.5,
                                        opacity: 1,
                                        ease: Power4.easeOut
                                    });
                                });
                            });
                            $('.hotspotButton').each(function (index, totalArea) {
                                contentAreaHeight = contentAreaHeight + $(this).outerHeight(true);
                                TweenMax.to($(this), 1, {
                                    rotation: 0,
                                    ease: Power4.easeOut
                                });
                            });
                            TweenMax.to($('.hotspotButton')[idx], 1, {
                                rotation: -45,
                                ease: Power4.easeOut
                            });
                        };
                    }
            )
            .directive('hotspotButtonBuild', function () {
                return function ($scope, $element, attrs) {
                    var hotspotButton = '';
                    setTimeout(function () {
                        $scope.$apply(function () {
                            hotspotButton = $element.find('.hotspotButton');
                            function onPageLoadBuild() {
                                hotspotButton = $('.hotspotButton');
                                TweenMax.set(hotspotButton, {opacity: 0, scale: 0.25, force3D: true});
                                TweenMax.staggerTo(hotspotButton, 2, {scale: 1, opacity: 1, delay: 0.5, ease: Elastic.easeOut, force3D: true}, 0.2);
                            }
                            onPageLoadBuild();
                        });
                    });
                };
            })
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npHotspot::component loaded!');
                    }
            );
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpHotspot mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
})();

/* jshint -W003, -W117 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .controller('npDragAndDropMatchController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data;
                        var buttonData = $scope.feedback || {};
                        $log.debug('npDragAndDropMatch::data', cmpData, buttonData);
                        var draggableButtons = '';
                        this.draggableButtons = cmpData.draggableButtons;
                        this.id = cmpData.id;
                        this.positiveFeedback = cmpData.positiveFeedback;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.positiveFeedback = this.positiveFeedback = cmpData.positiveFeedback;
                        $scope.image = this.image = cmpData.image;
                        $scope.content = cmpData.content;
                        $scope.ID = cmpData.id;
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set drag and drag end event handlers
                        //////////////////////////////////////////////////////////////////////////////////////
                        $scope.onDrag = function (value) {
                            $scope.currentRotation = value;
                        };
                        $scope.onDragEnd = function (value) {
                            $scope.currentRotation = value;
                        };
                    }
            )
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npDragAndDropMatch::component loaded!');
                    }
            )
//////////////////////////////////////////////////////////////////////////////////////
//GSAP draggable Angular directive
//////////////////////////////////////////////////////////////////////////////////////
            .directive("dragButton", function () {
//            'use strict';
                return {
                    restrict: "A",
                    scope: {
                        onDragEnd: "&",
                        onDrag: "&"
                    },
                    link: function (scope, element, attrs) {
                        var hitArea;
                        var hitAreaWrapper = document.getElementById('draggableContainer');
                        var draggables = document.getElementsByClassName('draggableButton');
                        var currentTarget;
                        var currentElement;
                        console.log(':::::::::::DraggableAngular:::::::::::::');
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set states
                        //////////////////////////////////////////////////////////////////////////////////////
                        TweenMax.to($('#draggableContainer'), 0, {
                            autoAlpha: 0
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        var tid = setInterval(function () {
                            if (document.readyState !== 'complete') {
                                return;
                            }
                            clearInterval(tid);
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on ready set states
                            //////////////////////////////////////////////////////////////////////////////////////
                            hitArea = document.getElementsByClassName('hit-area');
                            TweenMax.to($('.hit-area'), 0, {
                                strokeOpacity: 0
                            });
                            TweenMax.to($(hitArea).find('.button-completion-content'), 0.5, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('#draggableContainer'), 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //shuffle that shit
                            //////////////////////////////////////////////////////////////////////////////////////
                            function shuffle() {
                                $("#draggableButtons").each(function () {
                                    var divs = $(this).find('.draggableButton');
                                    for (var k = 0; k < divs.length; k++) {
                                        $(divs[k]).remove();
                                    }
                                    //the fisher yates algorithm, from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
                                    var l = divs.length;
                                    if (l === 0) {
                                        return false;
                                    }
                                    while (--l) {
                                        var j = Math.floor(Math.random() * (l + 1));
                                        var tempi = divs[l];
                                        var tempj = divs[j];
                                        divs[l] = tempj;
                                        divs[j] = tempi;
                                    }
                                    for (var m = 0; m < divs.length; m++) {
                                        $(divs[m]).appendTo(this);
                                    }
                                });
                            }
                            shuffle();
                            //////////////////////////////////////////////////////////////////////////////////////
                            //get actuall height
                            //////////////////////////////////////////////////////////////////////////////////////
                            $.each($('.boxElements'), function () {
                                var currentHeight = $(this).find('.button-content').outerHeight();
                                $(this).height(currentHeight);
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //finish ready check items
                            //////////////////////////////////////////////////////////////////////////////////////
                        }, 100);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //offset method
                        //////////////////////////////////////////////////////////////////////////////////////
                        function getOffsetRect(elem) {
                            var box = elem.getBoundingClientRect();
                            var body = document.body;
                            var docElem = document.documentElement;
                            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
                            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
                            var clientTop = docElem.clientTop || body.clientTop || 0;
                            var clientLeft = docElem.clientLeft || body.clientLeft || 0;
                            var clientHeight = elem.clientHeight || 0;
                            var offsetHeight = elem.offsetHeight || 0;
                            var scrollHeight = elem.scrollHeight || 0;
                            var top = box.top + scrollTop - clientTop;
                            var left = box.left + scrollLeft - clientLeft;
                            var height = box.height - scrollTop;
                            var bottom = top + (box.bottom - box.top);
                            var right = left + (box.right - box.left);
//                            var height = clientHeight;
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::getOffsetRect:::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::elem.clientHeight::', elem.clientHeight,
                                    '\n::box.height::', box.height,
                                    '\n::box.bottom::', box.bottom,
                                    '\n::clientHeight::', clientHeight,
                                    '\n::offsetHeight::', offsetHeight,
                                    '\n::scrollHeight::', scrollHeight,
                                    '\n::scrollTop::', scrollTop,
                                    '\n::clientTop::', clientTop,
                                    '\n::height::', height,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            return {top: Math.round(top),
                                left: Math.round(left),
                                bottom: Math.round(bottom),
                                right: Math.round(right)
                            };
                        }
                        var hitAreaPosition = 'undefined';
                        var windowOffset;
                        $(window).scroll(function () {
                            windowOffset = $(window).scrollTop();
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //on drag offset method
                        //////////////////////////////////////////////////////////////////////////////////////
//                    var boolean;
//                    function setElementPositions(dragging) {
//                        if (boolean = !boolean) {
//                            $('.draggableButton').each(function () {
//                                draggablePositionTop.push($(this).offset());
//                                console.log(':::::::::::::::::::::::::::::::::::::::', $(this).offset(), ':::', $(this).position(), ':::', Math.round(draggablePositionTop[0].top));
//                            });
//                        }
//                    }
                        function update() {
                            //////////////////////////////////////////////////////////////////////////////////////
                            //create draggable, set vars
                            //////////////////////////////////////////////////////////////////////////////////////
                            Draggable.create(element, {
                                type: "x,y",
                                edgeResistance: 0.65,
//                                autoScroll: 1,
                                bounds: "#draggableContainer",
                                throwProps: true,
                                overlapThreshold: '50%',
                                onDrag: function (e) {
                                    scope.$apply(function () {
                                        scope.onDrag();
//                                        hitArea = document.getElementsByClassName('hit-area');
//                                setElementPositions(true);
                                    });
                                },
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on drag method/vars
                                //////////////////////////////////////////////////////////////////////////////////////
                                onDragEnd: function (e) {
                                    scope.$apply(function () {
                                        scope.onDragEnd();
//                                setElementPositions(false);
                                        var targetNumber = hitArea.length;
                                        var hitAreaPosition;
                                        var rect;
//                                        $(window).scroll(function () {
//                                            clearTimeout($.data(this, 'scrollTimer'));
//                                            $.data(this, 'scrollTimer', setTimeout(function () {
//                                                // do something
//                                                console.log("Haven't scrolled in 250ms!");
//                                                hitArea = document.getElementsByClassName('hit-area');
//                                            }, 250));
//                                        });
//                                        
//                                        document.getElementsByClassName('post-taglist')[0].children[0].getClientRects()[0]

                                        for (var i = 0; i < targetNumber; i++) {
                                            hitArea = document.getElementsByClassName('hit-area');
                                            currentTarget = 'id' + i;
                                            currentElement = element.attr("id");
                                            hitAreaPosition = getOffsetRect(hitArea[i]);
//                                            hitAreaPosition = hitArea[i].getBoundingClientRect();
                                            if (Draggable.hitTest(hitAreaPosition, e) && (currentElement === currentTarget)) {
//                                            if (Draggable.hitTest(hitAreaPosition, e) && (currentElement === currentTarget)) {
//                                            if (Draggable.hitTest(hitArea[i], e) && (currentElement === currentTarget)) {
                                                hitAreaPosition = getOffsetRect(hitAreaWrapper);
                                                var positionX = (hitAreaPosition.left - hitAreaPosition.left);
//                                          var positionY = (hitAreaPosition.top - hitAreaPosition.top) - (Math.round(draggablePositionTop[i].top) - hitAreaPosition.top);
                                                var postionTopOffset = Math.round(windowOffset + hitAreaPosition.top);
                                                console.log(
                                                        '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
                                                        '\n::hitAreaPosition.top::', hitAreaPosition.top,
                                                        '\n::hitAreaPosition.height::', hitAreaPosition.height,
                                                        '\n::postionTopOffset::', postionTopOffset,
                                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                                        );
//                                        console.log('inside this hitAreaPosition.top: ', hitAreaPosition.top, 'positionY: ', positionY);
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                //on drag match set match position/states
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                TweenMax.to(element, 0.15, {
                                                    autoAlpha: 0,
                                                    x: positionX,
//                                            y: positionY,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to(hitArea[i], 0.5, {
                                                    autoAlpha: 0.95,
//                                            fill: '#313131',
                                                    strokeOpacity: 1,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to($(hitArea[i]).find('.button-content'), 0.5, {
                                                    autoAlpha: 0,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to($(hitArea[i]).find('.button-completion-content'), 0.5, {
                                                    autoAlpha: 1,
                                                    ease: Power4.easeOut
                                                });
                                                return;
                                            } else {
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                //on drag no match set state
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                TweenMax.to(element, 1, {
                                                    x: "0px",
                                                    y: '0px',
                                                    ease: Power4.easeOut
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        $(window).scroll(function () {
                            update();
                        });
                        update();
                    }
                };

            });
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpDragAndDropMatch mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
})();

/* jshint -W003, -W117 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .controller('npDragAndDropSelectController',
                    /** @ngInject */
                    function ($log, $scope, $sce, $element, AssessmentService) {
                        var cmpData = $scope.component.data;
                        var buttonData = $scope.feedback || {};
                        $log.debug('npDragAndDropSelect::data', cmpData, buttonData);
                        var draggableButtons = '';
                        this.draggableButtons = cmpData.draggableButtons;
                        this.id = cmpData.id;
                        this.positiveFeedback = cmpData.positiveFeedback;
                        this.negativeFeedback = cmpData.negativeFeedback;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.positiveFeedback = this.positiveFeedback = cmpData.positiveFeedback;
                        $scope.negativeFeedback = this.negativeFeedback = cmpData.negativeFeedback;
                        $scope.image = this.image = cmpData.image;
                        $scope.content = cmpData.content;
                        $scope.ID = cmpData.id;
                        $scope.select = cmpData.select;

                        AssessmentService.addQuestion(cmpData.id, !!cmpData.required);

                        //////////////////////////////////////////////////////////////////////////////////////
                        //set drag and drag end event handlers
                        //////////////////////////////////////////////////////////////////////////////////////
                        $scope.onDrag = function (value) {
                            $scope.currentRotation = value;
                        };
                        $scope.onDragEnd = function (value) {
                            $scope.currentRotation = value;
                        };
                    }
            )
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npDragAndDropSelect::component loaded!');
                    }
            )
            //////////////////////////////////////////////////////////////////////////////////////
            //set evaluate button logic
            //////////////////////////////////////////////////////////////////////////////////////
            /** @ngInject */
            .directive('npDragAndDropSelectEvaluate', function ($log, AssessmentService) {
                return {
                    restrict: 'A',
                    link: function ($scope, $element, $attrs) {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                              var cmpData = $scope.component.data;
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on ready set states
                                //////////////////////////////////////////////////////////////////////////////////////
                                TweenMax.set($('.select-response-correct'), {
                                    scale: 0.25,
                                    autoAlpha: 0
                                });
                                TweenMax.set($('.select-response-incorrect'), {
                                    scale: 0.25,
                                    autoAlpha: 0
                                });
                                var hitAreaLength = 0;
                                var hitAreaSelectedLength = '';
                                var hitAreaSelectedIncorrect = '';
                                hitAreaLength = $("[data-match=true]").length;
                                //////////////////////////////////////////////////////////////////////////////////////
                                //get and set height of elements
                                //////////////////////////////////////////////////////////////////////////////////////
                                var responseHeight = $('.select-response-incorrect').outerHeight(true);
                                var outsidePaddingHeight = $('.np-cmp-wrapper').outerHeight(true);
                                TweenMax.set($('.np_outside-padding'), {
                                    height:  outsidePaddingHeight
                                });
                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::npDragAndDropSelect::maxHeight:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::responseHeight:', responseHeight,
                                        '\n::outsidePaddingHeight:', outsidePaddingHeight,
                                        '\n::maxHeight + outsidePaddingHeight:', responseHeight + outsidePaddingHeight,
                                        '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        );

                                //////////////////////////////////////////////////////////////////////////////////////
                                //evaluate interaction
                                //////////////////////////////////////////////////////////////////////////////////////
                                $scope.evaluate = function () {
                                    hitAreaSelectedLength = $("[data-match=selected]").length;
                                    hitAreaSelectedIncorrect = $("[data-match=skeletor]").length;

                                  var isPassing = false;

                                    // TODO: Remove or re-enable, this doesn't appear to have a correlation with the code below
                                    //$('.hit-area').each(function () {
                                        if (Number(hitAreaLength) === Number(hitAreaSelectedLength) && (hitAreaSelectedIncorrect === 0)) {
                                            TweenMax.to($('.select-response-correct'), 0.75, {
                                                autoAlpha: 1,
                                                scale: 1,
                                                ease: Power4.easeOut
                                            });
                                            TweenMax.to($('.select-response-incorrect'), 0.75, {
                                                autoAlpha: 0,
                                                scale: 0.25,
                                                ease: Power4.easeOut
                                            });
                                          isPassing = true;
                                        } else {
                                            TweenMax.to($('.select-response-correct'), 0.75, {
                                                autoAlpha: 0,
                                                scale: 0.25,
                                                ease: Power4.easeOut
                                            });
                                            TweenMax.to($('.select-response-incorrect'), 0.75, {
                                                autoAlpha: 1,
                                                scale: 1,
                                                ease: Power4.easeOut
                                            });
                                          isPassing = false;
                                        }
                                    //});
                                  AssessmentService.questionAnswered(cmpData.id, isPassing);
                                };
                            });
                        });
                    }
                };
            })
            //////////////////////////////////////////////////////////////////////////////////////
            //GSAP Draggable Angular directive
            //////////////////////////////////////////////////////////////////////////////////////
            .directive("dragButtonSelect", function () {
                return {
                    restrict: "A",
                    scope: {
                        onDragEnd: "&",
                        onDrag: "&"
                    },
                    link: function (scope, element, attrs) {
                        var hitArea;
                        var hitAreaWrapper = document.getElementById('draggableContainer');
                        var draggables = document.getElementsByClassName('draggableButton');
                        var currentTarget;
                        var currentElement;
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set states
                        //////////////////////////////////////////////////////////////////////////////////////
                        TweenMax.to($('#draggableContainer'), 0, {
                            autoAlpha: 0
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            scope.$apply(function () {
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on ready set states
                                //////////////////////////////////////////////////////////////////////////////////////
                                hitArea = document.getElementsByClassName('hit-area');
                                TweenMax.to($('.hit-area'), 0, {
                                    strokeOpacity: 0
                                });
                                TweenMax.set($('.boxElements'), {
                                    autoAlpha: 0
                                });
                                TweenMax.to($(hitArea).find('.button-completion-content'), 0.5, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(hitArea).find('.feedback-draggable-button-image'), 0.5, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(hitArea).find('.feedback-draggable-button-content'), 0.5, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //shuffle that
                                //////////////////////////////////////////////////////////////////////////////////////
                                function shuffle() {
                                    $("#draggableButtons").each(function () {
                                        var divs = $(this).find('.draggableButton');
                                        for (var k = 0; k < divs.length; k++) {
                                            $(divs[k]).remove();
                                        }
                                        //the fisher yates algorithm, from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
                                        var l = divs.length;
                                        if (l === 0) {
                                            return false;
                                        }
                                        while (--l) {
                                            var j = Math.floor(Math.random() * (l + 1));
                                            var tempi = divs[l];
                                            var tempj = divs[j];
                                            divs[l] = tempj;
                                            divs[j] = tempi;
                                        }
                                        for (var m = 0; m < divs.length; m++) {
                                            $(divs[m]).appendTo(this);
                                        }
                                    });
                                }
                                //////////////////////////////////////////////////////////////////////////////////////
                                //build that
                                //////////////////////////////////////////////////////////////////////////////////////
                                shuffle();
                                TweenMax.to($('#draggableContainer'), 0.75, {
                                    autoAlpha: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.staggerTo($(".boxElements"), 2, {
                                    scale: 1,
                                    autoAlpha: 1,
                                    delay: 0.75,
                                    ease: Power4.easeOut,
                                    force3D: true
                                }, 0.2);
                                //////////////////////////////////////////////////////////////////////////////////////
                                //get actuall height
                                //////////////////////////////////////////////////////////////////////////////////////
                                $.each($('.boxElements'), function () {
                                    var currentHeight = $(this).find('.button-content').outerHeight();
                                    $(this).height(currentHeight);
                                });
                                $.each($('.boxElements'), function () {
                                    var currentHeight = $(this).find('.select-button-completion-content').outerHeight();
                                    $(this).height(currentHeight);
                                });
                            });
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //offset method
                        //////////////////////////////////////////////////////////////////////////////////////
                        function getOffsetRect(elem) {
                            var box = elem.getBoundingClientRect();
                            var body = document.body;
                            var docElem = document.documentElement;
                            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
                            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
                            var clientTop = docElem.clientTop || body.clientTop || 0;
                            var clientLeft = docElem.clientLeft || body.clientLeft || 0;
                            var clientHeight = docElem.clientHeight || body.clientHeight || 0;
                            var top = box.top + scrollTop - clientTop;
                            var left = box.left + scrollLeft - clientLeft;
                            var height = box.top + scrollTop - clientHeight;
                            return {top: Math.round(top), left: Math.round(left), height: Math.round(height)};
                        }
                        function update() {
                            //////////////////////////////////////////////////////////////////////////////////////
                            //create draggable, set vars
                            //////////////////////////////////////////////////////////////////////////////////////
                            Draggable.create(element, {
                                type: "x,y",
                                edgeResistance: 0.65,
                                autoScroll: 1,
                                bounds: "#draggableContainer",
                                throwProps: true,
                                overlapThreshold: '50%',
                                onDrag: function (e) {
                                    scope.$apply(function () {
                                        scope.onDrag();
                                    });
                                },
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on drag method/vars
                                //////////////////////////////////////////////////////////////////////////////////////
                                onDragEnd: function (e) {
                                    scope.$apply(function () {
                                        scope.onDragEnd();
                                        var targetNumber = hitArea.length;
                                        var hitAreaPosition;
                                        var hitAreaPositionSelectId;
                                        var hitAreaPositionSelect;
                                        var hitAreaBoolean;
                                        for (var i = 0; i < targetNumber; i++) {
                                            hitArea = document.getElementsByClassName('hit-area');
                                            currentTarget = 'id' + i;
                                            currentElement = element.attr("id");
                                            hitAreaPosition = getOffsetRect(hitArea[i]);
                                            hitAreaPositionSelectId = document.getElementById('select-hit-area-background');
                                            hitAreaPositionSelect = getOffsetRect(hitAreaPositionSelectId);
                                            if (Draggable.hitTest(hitAreaPositionSelect, e) && (currentElement === currentTarget)) {
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                //on drag match set match state
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                hitAreaBoolean = $(hitArea[i]).data('match');
                                                if (Boolean(hitAreaBoolean) === true) {
                                                    $(hitArea[i]).attr('data-match', 'selected');
                                                }
                                                if (Boolean(hitAreaBoolean) === false) {
                                                    $(hitArea[i]).attr('data-match', 'skeletor');
                                                }
                                                hitAreaPosition = getOffsetRect(hitAreaWrapper);
                                                var positionX = (hitAreaPosition.left - hitAreaPosition.left);
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                //on drag match set match position/states
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                TweenMax.to(element, 0.15, {
                                                    autoAlpha: 0,
                                                    x: positionX,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to(hitArea[i], 0.5, {
                                                    autoAlpha: 0.95,
                                                    strokeOpacity: 1,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to($(hitArea[i]).find('.button-content'), 0.5, {
                                                    autoAlpha: 0,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to($(hitArea[i]).find('.button-completion-content'), 0.5, {
                                                    autoAlpha: 1,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to($(hitArea[i]).find('.feedback-draggable-button-image'), 0.5, {
                                                    autoAlpha: 1,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to($(hitArea[i]).find('.feedback-draggable-button-content'), 0.5, {
                                                    autoAlpha: 1,
                                                    ease: Power4.easeOut
                                                });
                                                return;
                                            } else {
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                //on drag no match set state
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                TweenMax.to(element, 1, {
                                                    x: "0px",
                                                    y: '0px',
                                                    ease: Power4.easeOut
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        $(window).scroll(function () {
                            update();
                        });
                        update();
                    }
                };
            });
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpDragAndDropSelect mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
})();

/* jshint -W003, -W117 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .controller('npDragAndDropPrioritizeController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data;
                        var buttonData = $scope.feedback || {};
                        $log.debug('npDragAndDropPrioritize::data', cmpData, buttonData);
                        var draggableButtons = '';
                        this.draggableButtons = cmpData.draggableButtons;
                        this.id = cmpData.id;
                        this.positiveFeedback = cmpData.positiveFeedback;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.positiveFeedback = this.positiveFeedback = cmpData.positiveFeedback;
                        $scope.image = this.image = cmpData.image;
                        $scope.content = cmpData.content;
                        $scope.ID = cmpData.id;
//////////////////////////////////////////////////////////////////////////////////////
//set drag and drag end event handlers
//////////////////////////////////////////////////////////////////////////////////////
                        $scope.onDrag = function (value) {
                            $scope.currentRotation = value;
                        };
                        $scope.onDragEnd = function (value) {
                            $scope.currentRotation = value;
                        };
                    }
            )
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npDragAndDropPrioritize::component loaded!');
                    }
            )
//////////////////////////////////////////////////////////////////////////////////////
//GSAP draggable Angular directive
//////////////////////////////////////////////////////////////////////////////////////
            .directive("dragButtonPrioritize", function () {
//            'use strict';
            return {
                restrict: "A",
                scope: {
                    onDragEnd: "&",
                    onDrag: "&"
                },
                link: function (scope, element, attrs) {
                    var droppables = document.getElementsByClassName('hit-area');
                    var hitAreaWrapper = document.getElementById('draggableContainer');
                    var draggables = document.getElementsByClassName('draggableButton');
                    var currentTarget;
                    var currentElement;
                    //////////////////////////////////////////////////////////////////////////////////////
                    //set states
                    //////////////////////////////////////////////////////////////////////////////////////
                    TweenMax.to($('#draggableContainer'), 0, {
                        autoAlpha: 0
                    });
                    //////////////////////////////////////////////////////////////////////////////////////
                    //get ready
                    //////////////////////////////////////////////////////////////////////////////////////
                    var tid = setInterval(function () {
                        if (document.readyState !== 'complete') {
                            return;
                        }
                        clearInterval(tid);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //on ready set states
                        //////////////////////////////////////////////////////////////////////////////////////
                        TweenMax.to($('.hit-area'), 0, {
                            strokeOpacity: 0
                        });
                        TweenMax.to($(droppables).find('.button-completion-prioritize-content'), 0.5, {
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
                        TweenMax.to($('#draggableContainer'), 1.75, {
                            autoAlpha: 1,
                            ease: Power4.easeOut
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //shuffle that shit
                        //////////////////////////////////////////////////////////////////////////////////////
                        function shuffle() {
                            $("#draggableButtons").each(function () {
                                var divs = $(this).find('.draggableButton');
                                for (var k = 0; k < divs.length; k++) {
                                    $(divs[k]).remove();
                                }
                                //the fisher yates algorithm, from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
                                var l = divs.length;
                                if (l === 0) {
                                    return false;
                                }
                                while (--l) {
                                    var j = Math.floor(Math.random() * (l + 1));
                                    var tempi = divs[l];
                                    var tempj = divs[j];
                                    divs[l] = tempj;
                                    divs[j] = tempi;
                                }
                                for (var m = 0; m < divs.length; m++) {
                                    $(divs[m]).appendTo(this);
                                }
                            });
                        }
                        shuffle();
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get actuall height
                        //////////////////////////////////////////////////////////////////////////////////////
                        $.each($('.boxElements'), function () {
                            var currentHeight = $(this).find('.button-content').outerHeight();
                            $(this).height(currentHeight);
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //finish ready check items
                        //////////////////////////////////////////////////////////////////////////////////////
                    }, 100);
                    //////////////////////////////////////////////////////////////////////////////////////
                    //offset method
                    //////////////////////////////////////////////////////////////////////////////////////
                    function getOffsetRect(elem) {
                        var box = elem.getBoundingClientRect();
                        var body = document.body;
                        var docElem = document.documentElement;
                        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
                        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
                        var clientTop = docElem.clientTop || body.clientTop || 0;
                        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
                        var top = box.top + scrollTop - clientTop;
                        var left = box.left + scrollLeft - clientLeft;
                        return {top: Math.round(top), left: Math.round(left)};
                    }
                    var hitAreaPosition = getOffsetRect(hitAreaWrapper);
                    //////////////////////////////////////////////////////////////////////////////////////
                    //on drag offset method
                    //////////////////////////////////////////////////////////////////////////////////////
//                    var boolean;
//                    function setElementPositions(dragging) {
//                        if (boolean = !boolean) {
//                            $('.draggableButton').each(function () {
//                                draggablePositionTop.push($(this).offset());
//                                console.log(':::::::::::::::::::::::::::::::::::::::', $(this).offset(), ':::', $(this).position(), ':::', Math.round(draggablePositionTop[0].top));
//                            });
//                        }
//                    }
                    //////////////////////////////////////////////////////////////////////////////////////
                    //create draggable, set vars
                    //////////////////////////////////////////////////////////////////////////////////////
                    Draggable.create(element, {
                        type: "x,y",
                        edgeResistance: 0.65,
                        bounds: "#draggableContainer",
                        throwProps: true,
                        overlapThreshold: '50%',
                        onDrag: function (e) {
                            scope.$apply(function () {
                                scope.onDrag();
//                                setElementPositions(true);
                            });
                        },
                        //////////////////////////////////////////////////////////////////////////////////////
                        //on drag method/vars
                        //////////////////////////////////////////////////////////////////////////////////////
                        onDragEnd: function (e) {
                            scope.$apply(function () {
                                scope.onDragEnd();
//                                setElementPositions(false);
                                var targetNumber = droppables.length;
                                var droppablesPosition;
                                for (var i = 0; i < targetNumber; i++) {
                                    currentTarget = 'id' + i;
                                    currentElement = element.attr("id");
                                    if (Draggable.hitTest(droppables[i], e) && (currentElement === currentTarget)) {
                                        droppablesPosition = getOffsetRect(droppables[i]);
                                        var positionX = (droppablesPosition.left - hitAreaPosition.left);
//                                        var positionY = (droppablesPosition.top - hitAreaPosition.top) - (Math.round(draggablePositionTop[i].top) - hitAreaPosition.top);
//                                        console.log('inside this droppablesPosition.top: ', droppablesPosition.top, 'positionY: ', positionY);
                                        //////////////////////////////////////////////////////////////////////////////////////
                                        //on drag match set match position/states
                                        //////////////////////////////////////////////////////////////////////////////////////
                                        TweenMax.to(element, 0.15, {
                                            autoAlpha: 0,
                                            x: positionX,
//                                            y: positionY,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.to(droppables[i], 0.5, {
                                            autoAlpha: 0.95,
//                                            fill: '#313131',
                                            strokeOpacity: 1,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.to($(droppables[i]).find('.hit-area-number'), 0.5, {
                                            autoAlpha: 0,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.to($(droppables[i]).find('.button-completion-prioritize-content'), 0.5, {
                                            autoAlpha: 1,
                                            ease: Power4.easeOut
                                        });
                                        return;
                                    } else {
                                        //////////////////////////////////////////////////////////////////////////////////////
                                        //on drag no match set state
                                        //////////////////////////////////////////////////////////////////////////////////////
                                        TweenMax.to(element, 1, {
                                            x: "0px",
                                            y: '0px',
                                            ease: Power4.easeOut
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            };
        });
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpDragAndDropPrioritize mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
})();

(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npListController',
                    function ($log, $scope, $rootScope) {
                        var vm = this,
                                cmpData = $scope.component.data,
                                content = null;
                        $log.debug('npList::data', cmpData);
                        if (cmpData.link) {
                            this.link = cmpData.link;
                        }
                        this.heading = cmpData.heading;
                        this.content = cmpData.content;
                        this.wrap = cmpData.wrap;
                        $log.info('npList::content', $scope.content, this.content, cmpData.link, 'this.wrap: ', this.wrap);
                        this.handleLink = function () {
                            $log.info('npList:handleLink | link is a manifest');
                            $rootScope.$broadcast('npReplaceManifest', cmpData.link);
                        };
                        var bodyWidth;
                        $scope.$watch(function () {
                            bodyWidth = window.innerWidth;
                        });
                        var columnWrap = 'true';
                        $(".np-cmp-wrapper").each(function () {
                            columnWrap = $(this).attr("data-ng:wrap");
                            if ($(this).attr("data-ng:wrap") === 'true') {
                                $(this).find('.column-1').removeClass('col-md-4');
                                $(this).find('.column-1').addClass('col-md-12');
                                $(this).find('.column-2').removeClass('col-md-8');
                                $(this).find('.column-2').addClass('col-md-12');
                            }
                            if (window.innerWidth < 992) {
                                $(this).find('.list-row').removeClass('vertical-align');
                            } else if ((window.innerWidth > 992) && ($(this).attr("data-ng:wrap") === 'false')) {
                                $(this).find('.list-row').addClass('vertical-align');
                            }
                        });
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npList::component loaded!');
                    }
            );
})();

/* jshint -W003, -W117 */
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
//                        console.log(':: cmpData :: ', cmpData);

                        if (cmpData.link) {
                            this.link = cmpData.link;
                        }
                        this.content = cmpData.content;
                        //$log.debug('npHTML::content', $scope.content, this.content, cmpData.link);
                        this.handleLink = function () {
                            //$log.debug('npHTML:handleLink | link is a manifest');
                            $rootScope.$broadcast('npReplaceManifest', cmpData.link);
                        };
                        ////////////////////////////////////////////////////////////
                        ////////////////////////////////////////////////////////////
                        var isCollapsed = false;
                        var eleHeight;
                        var bodyWidth;
                        $scope.$watch(function () {
                            return window.innerWidth;
                        }, function (value) {
//                            console.log('innerWidth:',value);
                            bodyWidth = value;
                        });
                        $scope.selectLink = function (MyTarget) {
//                            var ele = document.getElementById(MyTarget);
//                            var icon = document.getElementById('caretSVG');
//                            console.log('bodyWidth: ' + bodyWidth);
                            if (bodyWidth < 450) {
                                eleHeight = '2150px';
                            } else if (bodyWidth < 650) {
                                eleHeight = '1650px';
                            } else if (bodyWidth < 750) {
                                eleHeight = '1050px';
                            } else if (bodyWidth < 1250) {
                                eleHeight = '950px';
                            } else {
                                eleHeight = '850px';
                            }
//                            console.log('eleHeight: ' + eleHeight);
                            if (isCollapsed) {
                                TweenMax.to(icon, 0.75, {
                                    css: {
                                        transformOrigin: "50% 50%",
                                        rotation: 0
                                    },
                                    ease: Cubic.easeOut
                                });
                                TweenMax.to(ele, 0.75, {
                                    css: {
                                        autoAlpha: 0,
                                        height: "10px"
                                    },
                                    ease: Cubic.easeOut
                                });
                                isCollapsed = !isCollapsed;
                            } else if (!isCollapsed) {
                                TweenMax.to(icon, 0.75, {
                                    css: {
                                        transformOrigin: "50% 50%",
                                        rotation: 90
                                    },
                                    ease: Cubic.easeOut
                                });
                                TweenMax.to(ele, 1.25, {
                                    css: {
                                        autoAlpha: 1,
                                        height: eleHeight
                                    },
                                    ease: Cubic.easeOut
                                });
                                isCollapsed = !isCollapsed;
                            }
                        };
                        ////////////////////////////////////////////////////////////
                        ////////////////////////////////////////////////////////////
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npHTML::component loaded!');
                    }
            );
})();

(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npImageController',
    function ($log, $scope, $sce) {
      var cmpData = $scope.component.data || {};
      //$log.debug('npImage::data', cmpData);

      this.alt = cmpData.alt;
      // TODO - use sce for URL whitelist?
      this.src = cmpData.src;
      //$log.debug('npImage::src', this.src);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      //$log.debug('npImage::component loaded!');
    }
  );
})();


/* jshint -W003, -W117, -W026, -W040 */
(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npMenuController',
    function ($log, $scope, ManifestService, ConfigService, $sce) {
      var cmpData = $scope.component.data || {};
      $log.debug('npMenu::data', cmpData);

      this.items = (cmpData || {}).items;
      if (!angular.isArray(this.items)) {
        this.items = new Array('pages');
      }

      for (var itemIdx in this.items) {
        var item = this.items[itemIdx];
        if (item === 'pages') {

          // have pages been indexed?
          $log.debug('inside content scope', $scope.currentContent);
          if (!$scope.currentContent.pages) {
            var parentIdx = $scope.component.idx.slice(0);
            parentIdx.pop();

            // index pages
            var pages = ManifestService.getAll('npPage', parentIdx);
            var nestedPages = [];
            for (var pageIdx in pages) {
              var page = pages[pageIdx];
              $log.debug('npPage::index:', page);
              if (!!page.data && page.data.inMenu) {
                var aPage =
                {
                  id: page.data.id,
                  //link: '#/' + ConfigService.getManifestId() + '/' + page.data.id,
                  text: page.data.menuTitle || page.data.title,
                  children: []
                };
                if (ManifestService.getPageId() === aPage.id) {
                  $log.debug('npPage::index:current:', page);
                  // TBD - need to be able to adjust current page
                  // disabling for now
                  //aPage.current = true;
                }

                var parentId = page.data.parentId;
                $log.debug('npPage::index:parent?', parentId);
                if (!parentId) {
                  $log.debug('npPage::index:top level:', aPage);
                  nestedPages.push(aPage);
                } else {
                  $log.debug('npPage::index:nest:', parentId, aPage);
                  for (var parentPage in nestedPages) {
                    $log.debug('npPage::index:nest:isEqual?', parentId, nestedPages[parentPage].id);
                    if (nestedPages[parentPage].id === parentId) {
                      nestedPages[parentPage].children.push(aPage);
                    }
                  }
                }
              }
            }
            $log.debug('npPage::index results:', nestedPages);
            $scope.currentContent.pages = nestedPages;
          } else {
            // TBD - edit pages $scope.currentContent.pages array to reset current page
          }


          $log.debug('npMenu::pages', $scope.pages);
          var spliceArgs = [itemIdx, 1].concat($scope.pages);
          Array.prototype.splice.apply(this.items, spliceArgs);
        }
      }
      $log.debug('npMenu::items', this.items);
    }
  )

    .directive('npMenu', npMenuDirective)

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npMenu::component loaded!');
    }
  );



  /** @ngInject */
  function npMenuDirective($log, $compile, ManifestService/*, $timeout*/) {
    $log.debug('\nnpMenuDirective::Init\n');
    var Directive = function () {
      this.restrict = 'EA';
      this.scope = {'menuitem': '='};
      this.template =
        '<a ng-click="vm.changePageId(menuitem.id);" id="menu{{menuitem.id}}" ng-class="(menuitem.current===true) ? \'selected\' : \'\'">{{ menuitem.text }}</a>' +
        '<ul>' +
        '<li ng-repeat="child in menuitem.children">' +
        '<span np-menu menuitem="child"></span>' +
        '</li>' +
        '</ul>';

      this.controllerAs = 'vm';
      this.controller = npMenuDirectiveController;

      this.compile = function (tElement, tAttrs, transclude) {
        var contents = tElement.contents().remove();
        $log.debug('npMenu::compile', contents);
        var compiled;
        /** @ngInject */
        return function ($scope, $element, $attributes) {
          if (!compiled) {
            compiled = $compile(contents);
          }
          compiled($scope, function (clone) {
            $log.debug('npMenu::compile:linked', clone);
            $element.append(clone);
          });
        };
      };
    };
    return new Directive();

    /** @ngInject */
    function npMenuDirectiveController($log, $compile, ManifestService) {
      var vm = this;
      vm.changePageId = function (toPage) {
        $log.info('changePageId', toPage);
        ManifestService.setPageId(toPage);
      };
    }
  }

})();

/* jshint -W003, -W117 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npPageController',
                    function ($log, $scope, $rootScope, ManifestService, TrackingService) {
                        var cmpData = $scope.component.data || {};
                        //$log.debug('npPage::data', cmpData, $scope.contentTitle);
                        $scope.title = cmpData.title;
                        $scope.subTitle = cmpData.subTitle;
                        $scope.instructional = cmpData.instructional;
                        var parentIdx = $scope.component.idx.slice(0);
                        parentIdx.pop();
                        var pageId = ManifestService.getPageId();
                        if (!pageId) {
                            var firstPageCmp = ManifestService.getFirst('npPage', parentIdx);
                            pageId = firstPageCmp.data.id;
                            ManifestService.setPageId(pageId, firstPageCmp.idx);
                            //$log.debug('npPage::set page', pageId);
                        }
                        npPageIdChanged(null, pageId);
                        $rootScope.$on('npPageIdChanged', npPageIdChanged);
                        function npPageIdChanged(event, newPageId) {
                            pageId = newPageId;
                            // check if current route is for this page
                            //$log.debug('npPage::on current page?', pageId, cmpData.id);
                            if (cmpData.id === pageId) {
                                $scope.currentPage = true;
                                $scope.npPage = $scope;
                                // set page title
                                if ($rootScope.PageTitle) {
                                    $rootScope.PageTitle += ': ' + cmpData.title;
                                } else {
                                    $rootScope.PageTitle = cmpData.title;
                                }
                            } else {
                                $scope.currentPage = false;
                                TrackingService.trackPageView(pageId);
                            }
                        }
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        //$log.debug('npPage::component loaded!');
                    }
            );
})();

(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npQuestionController',
                    function ($log, $scope, $attrs, $rootScope, ManifestService, $sce, $element) {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set that 
                        //////////////////////////////////////////////////////////////////////////////////////
                        var cmpData = $scope.component.data;
                        $log.debug('npQuestion::data', cmpData);
                        this.id = cmpData.id;
                        this.content = $sce.trustAsHtml(cmpData.content);
                        this.type = cmpData.type;
                        this.feedback = '';
                        this.canContinue = false;
                        var feedback = cmpData.feedback;
                        var feedbackLabel = $element.find('.question-feedback-label');
                        var negativeFeedbackIcon = '';
                        var positiveFeedbackIcon = '';
                        //////////////////////////////////////////////////////////////////////////////////////
                        //build that 
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                TweenMax.set($(".response-item"), {
                                    autoAlpha: 0,
                                    scale: 0.5,
                                    force3D: true
                                });
                                TweenMax.staggerTo($(".response-item"), 2, {
                                    scale: 1,
                                    autoAlpha: 1,
                                    delay: 0.75,
                                    ease: Power4.easeOut,
                                    force3D: true
                                }, 0.2);
                            });
                        });
                        this.update = function (event) {
                            $log.debug('npQuestion::answer changed');
                            if (feedback.immediate) {
                                this.feedback = '';
                                negativeFeedbackIcon = $element.find('.negative-feedback-icon');
                                positiveFeedbackIcon = $element.find('.positive-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {
                                    autoAlpha: 0,
                                    scale: 2.5,
                                    force3D: true
                                });
                                TweenMax.set(positiveFeedbackIcon, {
                                    autoAlpha: 0,
                                    scale: 2.5,
                                    force3D: true
                                });
                            }
                        };
                        this.evaluate = function () {
                            var correct = true;
                            var $checkbox = false;
                            var $checked = false;
                            negativeFeedbackIcon = $element.find('.negative-feedback-icon');
                            positiveFeedbackIcon = $element.find('.positive-feedback-icon');
                            TweenMax.to(negativeFeedbackIcon, 0.25, {
                                autoAlpha: 0,
                                scale: 2.5,
                                force3D: true
                            });
                            TweenMax.to(positiveFeedbackIcon, 0.25, {
                                autoAlpha: 0,
                                scale: 2.5,
                                force3D: true
                            });
                            var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
                            $checkbox = $element.find('.checkbox-x');
                            $checked = $element.find('.checkbox-x[checked]');
                            $log.debug('npQuestion::evaluate:', this.answer);
//                            if (!!this.answer) {
                            if (!!$checked) {
                                switch (this.type) {
                                    case 'checkbox':
                                        //var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx); // defined above
                                        var idx;
                                        var $currentCheckbox;
                                        for (idx in chkAnswers) {
                                            $currentCheckbox = $($checkbox[idx]);
                                            if (chkAnswers[idx].data.correct) {
                                                // confirm all correct answers were checked
                                                if (!$currentCheckbox.attr('checked')) {
                                                    correct = false;
                                                }
                                            } else {
                                                // confirm no incorrect answers were checked
                                                if (!!$currentCheckbox.attr('checked')) {
                                                    correct = false;
                                                }
                                            }
                                        }
                                        break;
                                    case 'text':
                                        var txtAnswer = ManifestService.getFirst('npAnswer', $scope.cmpIdx);
                                        var key = txtAnswer.data.correct;
                                        var regExp, pat, mod = 'i';
                                        if (angular.isString(key)) {
                                            if (key.indexOf('/') === 0) {
                                                pat = key.substring(1, key.lastIndexOf('/'));
                                                mod = key.substring(key.lastIndexOf('/') + 1);
                                            }
                                        } else if (angular.isArray(key)) {
                                            pat = '^(' + key.join('|') + ')$';
                                        }
                                        regExp = new RegExp(pat, mod);
                                        if (!regExp.test(this.answer)) {
                                            if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.incorrect)) {
                                                this.feedback = txtAnswer.data.feedback.incorrect;
                                                feedbackLabel.remove();
                                            }
                                            correct = false;
                                        } else {
                                            if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.correct)) {
                                                this.feedback = txtAnswer.data.feedback.correct;
                                                feedbackLabel.remove();
                                            }
                                        }
                                        break;
                                }
                            } else {
                                correct = false;
                            }
                            $log.debug('npQuestion::evaluate:isCorrect', correct);
                            // set by ng-model of npAnswer's input's
//                            if (feedback.immediate && this.feedback === '') {
                            feedbackLabel.remove();
                            if (correct) {
                                this.feedback = feedback.correct;
                                this.canContinue = true;
                                TweenMax.to(positiveFeedbackIcon, 0.75, {
                                    autoAlpha: 1,
                                    scale: 1,
                                    force3D: true
                                });
                            } else {
                                this.feedback = feedback.incorrect;
                                this.canContinue = false;
                                TweenMax.to(negativeFeedbackIcon, 0.75, {
                                    autoAlpha: 1,
                                    scale: 1,
                                    force3D: true
                                });
                            }
//                            }
                        };
                        this.nextPage = function (evt) {
                            evt.preventDefault();
                            if (this.canContinue) {
                                $rootScope.$emit('question.answered', true);
                            }
                        };
                    }
            )
            .directive('questionFeedbackBuild', function () {
                return function ($scope, $element, attrs) {
                    var negativeFeedbackIcon = '';
                    var postiveFeedbackIcon = '';
                    setTimeout(function () {
                        $scope.$apply(function () {
//                            negativeFeedbackIcon = $element.find('.hotspotButton');
                            function onPageLoadBuild() {
                                negativeFeedbackIcon = $('.negative-feedback-icon');
                                postiveFeedbackIcon = $('.positive-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {autoAlpha: 0, scale: 2.5, force3D: true});
                                TweenMax.set(postiveFeedbackIcon, {autoAlpha: 0, scale: 2.5, force3D: true});
                            }
                            onPageLoadBuild();
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npQuestion::component loaded!');
                    }
            );
})();

(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npQuizController',
    function ($log, $scope, AssessmentService) {
      var minPassing, i, j, lastComponent, lastComponentIndex, nLastComponent, nLastComponentIndex, cmpData = $scope.component.data;
      $log.debug('npQuiz::data', cmpData);

      if( cmpData.hasOwnProperty('assessed') && parseInt(cmpData.assessed) === 1 ) {
        if( cmpData.hasOwnProperty('percentage') ) {
          minPassing = parseFloat(cmpData.percentage);

          if( minPassing > 1) {
            minPassing = minPassing / 100;
          }
        }

        var getResultsBtn = {
          "type": "npButton",
          "data": {
            "link": "",
            "type": "btn-next",
            "class": "",
            "content": "See Results"
          },
          "components": [
          ]
        };

        // add the results button if the last page is a npAsResult
        lastComponentIndex = $scope.component.components.length - 1;
        if( lastComponentIndex >= 0 ) {
          lastComponent = $scope.component.components[lastComponentIndex];


          if( lastComponent ) {
            for( i = 0; i < lastComponent.components.length; i++ ) {
              $log.debug('npQuiz: looking for npAsResult', lastComponent.components[i]);
              if( lastComponent.components[i].type === 'npAsResult' ) {
                nLastComponentIndex = $scope.component.components.length - 2;

                if( nLastComponentIndex >= 0 ) {
                  $scope.component.components[nLastComponentIndex].components.push(getResultsBtn);
                }
              }
            }
          }
        }

        AssessmentService.beginFor(cmpData.id, minPassing);
      } else {
        AssessmentService.reset();
      }

      if( cmpData.hasOwnProperty('questions') ) {
        $log.debug('has questions property');
        AssessmentService.setRequiredQuestions(parseInt(cmpData.questions));
      }
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npQuiz::component loaded!');
    }
  );

})();

(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npAsResultController',
                    function ($log, $scope, $rootScope, $sce, $element, $filter, i18nService, ManifestService, AssessmentService) {
                        var i,
                                vm = this,
                                cmpData = $scope.component.data;
                        $log.info('npAsResultController::Init\n');
                        vm.minScore = AssessmentService.getMinPassing();
                        vm.score = AssessmentService.getScore();
                        vm.isPassing = AssessmentService.isPassing();
                        vm.summaryText = '';

                        //////////////////////////////////////////////////////////////////////////////////////
                        //set states
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
//                                TweenMax.set($('.flash-card-front-wrapper'), {
//                                    autoAlpha: 1
//                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //get actuall height
                                //////////////////////////////////////////////////////////////////////////////////////
                                setHeightProperties(function () {
                                    var outsidePaddingHeight = $('.np-result-summary').outerHeight(true);
                                    TweenMax.set($('.np-result-container'), {
                                        height: outsidePaddingHeight
                                    });
                                });
                                setHeightProperties();
                                //////////////////////////////////////////////////////////////////////////////////////
                                //page build
                                //////////////////////////////////////////////////////////////////////////////////////
//                                TweenMax.to($('#draggableContainer'), 1.75, {
//                                    autoAlpha: 1,
//                                    ease: Power4.easeOut
//                                });
                            });
                        });
                        if (vm.isPassing) {
                            TweenMax.set($(['.results-wrapper-incorrect', '.results-wrapper-correct']), {
                                autoAlpha: 0
                            });
                            TweenMax.to($('.results-wrapper-correct'), 0.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            vm.summaryLabelText = cmpData.feedback.passLabel;
                            vm.summaryText = cmpData.feedback.pass;
                            //vm.summaryText = i18nService.get('pass');
                        } else {
                            TweenMax.set($(['.results-wrapper-incorrect', '.results-wrapper-correct']), {
                                autoAlpha: 0
                            });
                            TweenMax.to($('.results-wrapper-incorrect'), 0.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            vm.summaryLabelText = cmpData.feedback.failLabel;
                            vm.summaryText = cmpData.feedback.fail;
                            //vm.summaryText = i18nService.get('fail');
                        }
                        // replace tokens in the string as we go
                        vm.summaryText = vm.summaryText.replace(/:USERSCORE:/, $filter('number')(vm.score * 100, 0));
                        vm.summaryText = vm.summaryText.replace(/:MINSCORE:/, $filter('number')(vm.minScore * 100, 0));
                        vm.summaryPecentage = (vm.score * 100);
                        vm.achievementText = '';
                        if (cmpData.hasOwnProperty('achievements')) {
                            for (i = 0; i < cmpData.achievements.length; i++) {
                                var achievement = cmpData.achievements[i];
                                achievement.score = parseFloat(achievement.score);
                                if (achievement.compare === 'gte' && vm.score >= achievement.score) {
                                    vm.achievementText = achievement.content;
                                } else if (achievement.compare === 'gt' && vm.score > achievement.score) {
                                    vm.achievementText = achievement.content;
                                } else if (achievement.compare === 'eq' && vm.score === achievement.score) {
                                    vm.achievementText = achievement.content;
                                } else if (achievement.compare === 'lte' && vm.score <= achievement.score) {
                                    vm.achievementText = achievement.content;
                                } else if (achievement.compare === 'lt' && vm.score < achievement.score) {
                                    vm.achievementText = achievement.content;
                                }
                            }
                        }
                        // and then once the score is saved on the server and it lets us know
                        // their badge status, then we show the goods?
                        if (vm.score === 100) {
                            vm.badgeEarned = true;
                        } else {
                            vm.badgeEarned = false;
                        }
                        AssessmentService.finalize();
                    });
})();

/* jshint -W003, -W117 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .directive('npVideo', NpVideoDirective);
    /** @ngInject */
    function NpVideoDirective($log) {
        $log.info('DEBUG | \npVideo::Init\n');
        return {
            restrict: 'EA',
            controller: NpVideoController,
            controllerAs: 'npVideo',
            bindToController: true
        };
    }
    /** @ngInject */
    function NpVideoController($log, $scope, $sce) {
        var vm = this,
                types = $scope.component.data.types,
                source = $scope.component.data.baseURL;
        if (angular.isArray(types) && types.length > 0) {
            var sources = [];
            for (var typeIdx in types) {
//                console.log(
//                        '\n::::::::::::::::::::::::::::::::::::::npQuestions::evaluate:::::::::::::::::::::::::::::::::::::::::::::::::',
//                        '\n::$scope::', $scope,
//                        '\n::source::', source,
//                        '\n::$scope.component.data::', $scope.component.data,
//                        '\n::$scope.component.data.baseURL::', $scope.component.data.baseURL,
//                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                        );
                var type = types[typeIdx];
                sources.push({
                    type: type,
                    mime: 'video/' + type,
                    src: $sce.trustAsResourceUrl($scope.component.data.baseURL + '.' + type)
                });
            }
            $scope.npVideo = {
                sources: sources
            };
        }
    }
})();

(function () {
    'use strict';
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpReveal mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
    angular
            .module('newplayer.component')
            .controller('npRevealController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data,
                                revealItems = $scope.component.revealItems,
                                revealItemsIndex = $scope.component.idx,
                                revealItemsButtonImage = $scope.component.revealItems.buttonImage;
                        var buttonData = $scope.feedback || {};
                        this.revealItems = $scope.component.revealItems;
                        this.revealItemComponent = $scope.component.revealItems[0];
                        this.revealItemComponents = $scope.component.revealItems;
                        this.revealItemVideoType = $scope.component.baseURL;
                        this.id = cmpData.id;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.feedback = this.feedback = cmpData.feedback;
                        $scope.image = this.image = cmpData.image;
                        $log.debug('npReveal::data', cmpData, buttonData);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on ready set states
                                //////////////////////////////////////////////////////////////////////////////////////
                                TweenMax.set($(".reveal-object"), {
                                    autoAlpha: 0
                                });
                                TweenMax.set($(".reveal-button"), {
                                    opacity: 0,
                                    scale: 0.25,
                                    force3D: true
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //get actuall height
                                //////////////////////////////////////////////////////////////////////////////////////
                                imagesLoaded(document.querySelector('.reveal-objects-wrapper'), function (instance) {
                                    var maxHeight = Math.max.apply(null, $('.reveal-object').map(function () {
                                        return $(this).outerHeight(true);
                                    }).get());
                                    var npCmpWrapperHeight = $('.np-cmp-wrapper').outerHeight(true);
                                    var outsidePaddingHeight = $('.np_outside-padding').outerHeight(true);
                                    TweenMax.set($('.np_outside-padding'), {
                                        height: maxHeight + npCmpWrapperHeight + 100
                                    });
                                    console.log(
                                            '\n::::::::::::::::::::::::::::::::::::::npFlashCards::maxHeight:::::::::::::::::::::::::::::::::::::::::::::::::',
                                            '\n::maxHeight:', maxHeight,
                                            '\n::outsidePaddingHeight:', outsidePaddingHeight,
                                            '\n::npCmpWrapperHeight:', npCmpWrapperHeight,
                                            '\n::maxHeight + outsidePaddingHeight:', maxHeight + outsidePaddingHeight,
                                            '\n::maxHeight + npCmpWrapperHeight:', maxHeight + npCmpWrapperHeight,
                                            '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                            );
                                    //////////////////////////////////////////////////////////////////////////////////////
                                    //build init state
                                    //////////////////////////////////////////////////////////////////////////////////////
                                    TweenMax.to($(".button-screen"), 1.5, {
                                        autoAlpha: 0.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.staggerTo($(".reveal-button"), 2, {
                                        scale: 1,
                                        opacity: 1,
                                        delay: 0.25,
                                        ease: Power4.easeOut,
                                        force3D: true
                                    }, 0.2);
                                    TweenMax.to($(".button-screen"), 1.5, {
                                        autoAlpha: 0.65,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(".button-screen")[0], 1.75, {
                                        autoAlpha: 0,
                                        delay: 1.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(".reveal-object")[0], 1.75, {
                                        autoAlpha: 1,
                                        delay: 1.75,
                                        ease: Power4.easeOut
                                    });
                                });
                            });
                        });
                        this.update = function (button) {
                            var idx = this.revealItems.indexOf(button);
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change stop and reset all video files
                            //////////////////////////////////////////////////////////////////////////////////////
                            $('video').each(function () {
                                this.pause();
                                this.currentTime = 0;
                                this.load();
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change cross fade items
                            //////////////////////////////////////////////////////////////////////////////////////
                            TweenMax.to($(".button-screen"), 1.5, {
                                autoAlpha: 0.75,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(".button-screen")[idx], 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(".reveal-object"), 1.5, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(".reveal-object")[idx], 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                        };
                    }
            )
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npReveal::component loaded!');
                    }
            );
})();

/* jshint -W003, -W117, -W004 */
(function () {
    'use strict';
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpFlashCards mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
    angular
            .module('newplayer.component')
            .controller('npFlashCardsController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data,
                                flashCards = $scope.component.flashCards;
                        var buttonData = $scope.feedback || {};
                        this.flashCardComponent = $scope.component.flashCards[0];
                        this.flashCardComponents = $scope.component.flashCards;
                        this.flashCardVideoType = $scope.component.baseURL;
                        this.id = cmpData.id;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.feedback = this.feedback = cmpData.feedback;
                        $scope.image = this.image = cmpData.image;
                        $log.debug('npFlashCards::data', cmpData, buttonData);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //on button click do these things
                        //////////////////////////////////////////////////////////////////////////////////////
                        this.update = function (flashCardButton) {
                            var idx = flashCards.indexOf(flashCardButton);
                            var clickedFlashCard = $(".flash-cards-object")[idx];
                            var flipped;
                            TweenMax.killAll(false, true, false);
                            TweenMax.to(clickedFlashCard, 1, {
                                rotationY: 180,
                                ease: Power4.easeOut,
                                overwrite: 0
                            });
                            TweenMax.to(clickedFlashCard.getElementsByClassName('flash-card-back-wrapper'), 1, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.to(clickedFlashCard.getElementsByClassName('flash-card-front-wrapper'), 1, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-button'), 1, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
//                            if (flipped === !flipped){
//                                TweenMax.to($('.flash-card-button'), 1, {
//                                    autoAlpha: 0,
//                                    ease: Power4.easeOut
//                                });
//                                TweenMax.set($('.flash-card-button'), {
//                                    left: '15px'
//                                });
//                                TweenMax.to($('.flash-card-button'), 1, {
//                                    autoAlpha: 1,
//                                    ease: Power4.easeOut
//                                });
//                            }
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change stop and reset all video files
                            //////////////////////////////////////////////////////////////////////////////////////
//                            $('video').each(function () {
//                                this.pause();
//                                this.currentTime = 0;
//                                this.load();
//                            });
                        };
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set drag and drag end event handlers
                        //////////////////////////////////////////////////////////////////////////////////////
                        $scope.onDrag = function (value) {
                            $scope.currentRotation = value;
                        };
                        $scope.onDragEnd = function (value) {
                            $scope.currentRotation = value;
                        };
                    }
            )
            ////////////////////////////////////////////////////////////////////////////////////////
            //GSAP Swipeable/Snapable Angular directive!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            ////////////////////////////////////////////////////////////////////////////////////////
            .directive("npSwipeAngularDraggable", function () {
                return {
                    restrict: "A",
                    scope: {
                        onDragEnd: "&",
                        onDrag: "&"
                    },
                    link: function ($scope, $element, attrs) {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set states
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                TweenMax.set($('.flash-card-front-wrapper'), {
                                    autoAlpha: 1
                                });
                                TweenMax.set($('.flash-card-back-wrapper'), {
                                    autoAlpha: 0
                                });
                                TweenMax.set($('.flash-card-button'), {
                                    autoAlpha: 0
                                });
                                TweenMax.set($('.flash-card-back-wrapper'), {
                                    rotationY: -180
                                });
                                TweenMax.set([$('.flash-card-content-back'), $('.flash-card-content-front')], {
                                    backfaceVisibility: "hidden"
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //get actuall height
                                //////////////////////////////////////////////////////////////////////////////////////
                                imagesLoaded(document.querySelector('.np-flash-card'), function (instance) {
                                    var maxHeight = Math.max.apply(null, $('.flash-card-content-back').map(function () {
                                        return $(this).outerHeight(true);
                                    }).get());
                                    var outsidePaddingHeight = $('.np_outside-padding').outerHeight(true);
                                    TweenMax.set($('.flash-cards-object'), {
                                        height: maxHeight
                                    });
                                    TweenMax.set($('.np_outside-padding'), {
                                        height: maxHeight + outsidePaddingHeight +150
                                    });
                                    TweenMax.set($('.btn-next'), {
                                        marginTop: maxHeight + 150
                                    });
                                    //////////////////////////////////////////////////////////////////////////////////////
                                    //page build
                                    //////////////////////////////////////////////////////////////////////////////////////
                                    TweenMax.to($('#draggableContainer'), 1.75, {
                                        autoAlpha: 1,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.from($('#flash-cards'), 2, {
                                        left: '1000px',
                                        force3D: true,
                                        ease: Power4.easeOut
                                    });
                                    var $cardTwo = $(".flash-cards-object")[1];
                                    TweenMax.set($($cardTwo).find('.flash-card-overlay'), {
                                        force3D: true,
                                        opacity: 0.5
                                    });
                                    TweenMax.to($cardTwo, .75, {
                                        force3D: true,
                                        zIndex: middle,
                                        top: '10px',
                                        rotationY: 0,
                                        marginLeft: '-7em',
                                        marginRight: '7em',
                                        scale: 0.9,
                                        z: '-35',
                                        ease: Power4.easeOut
                                    });
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //offset top on scroll
                                //////////////////////////////////////////////////////////////////////////////////////
                                var flashCardsOffset = $('.npFlashCards').offset();
                                $(window).scroll(function () {
                                    var windowPosition = $(window).scrollTop();
                                    var doc = document.documentElement;
                                    var topOffset = Math.round((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
                                    TweenMax.to($('.npFlashCards'), 1.25, {
                                        force3D: true,
                                        top: -(topOffset - flashCardsOffset.top - 100),
                                        ease: Power4.easeOut
                                    });
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //finish ready check items
                                //////////////////////////////////////////////////////////////////////////////////////
                                var winWidth = 0;
                                setContainerDims();
                                function setContainerDims() {
                                    winWidth = parseInt($(window).width());
                                    $("#flash-cards").css({
                                        "width": winWidth
                                    });
                                }
                                $(window).resize(function () {
                                    setContainerDims();
                                });
                                TweenMax.to($('#draggableContainer'), 5, {
                                    autoAlpha: 0
                                });
                            });
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //offset method
                        //////////////////////////////////////////////////////////////////////////////////////
                        function getOffsetRect(elem) {
                            var box = elem.getBoundingClientRect();
                            var body = document.body;
                            var docElem = document.documentElement;
                            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
                            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
                            var clientTop = docElem.clientTop || body.clientTop || 0;
                            var clientLeft = docElem.clientLeft || body.clientLeft || 0;
                            var top = box.top + scrollTop - clientTop;
                            var left = box.left + scrollLeft - clientLeft;
                            var bottom = top + (box.bottom - box.top);
                            var right = left + (box.right - box.left);
                            return {
                                top: Math.round(top),
                                left: Math.round(left),
                                bottom: Math.round(bottom),
                                right: Math.round(right)
                            };
                        }
                        //////////////////////////////////////////////////////////////////////////////////////
                        //drag and throw vars
                        //////////////////////////////////////////////////////////////////////////////////////
                        var front = '12003';
                        var middle = '12002';
                        var back = '12001';
                        var flashCardsDraggable;
                        var windowWidth;
                        var maxScroll;
                        var elementWrapper;
                        var elementIteration;
                        var sections;
                        var elementWidth;
                        var dragAreaWidth;
                        var dragAreaLeftPadding;
                        var nativeSCrl = true;
                        //////////////////////////////////////////////////////////////////////////////////////
                        //drag and throw conditionals & animation
                        //////////////////////////////////////////////////////////////////////////////////////
                        function updateAnimation() {
                            var windowCenter = $(window).width() / 2;
                            for (var i = elementIteration.length - 1; i >= 0; i--) {
                                TweenMax.set(elementIteration, {
                                    transformPerspective: "1000"
                                });
                                var currentIteration = elementIteration[i];
                                var currentIterationWidth = currentIteration.offsetWidth;
                                var currentIterationCenterWidth = (currentIterationWidth / 2);
                                var itemsOffset = getOffsetRect(currentIteration);
                                var itemsOffsetLeft = itemsOffset.left;
                                var itemsOffsetCenter = (itemsOffsetLeft + currentIterationCenterWidth);
                                var windowCenterOffsetOne = ($(".flash-cards-object").width() / 3);
                                var windowCenterOffsetTwo = $(".flash-cards-object").width();
                                //////////////////////////////////////////////////////////////////////////////////////
                                //drag and throw CENTER item animation
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ((itemsOffsetCenter <= (windowCenter + windowCenterOffsetOne)) && (itemsOffsetCenter >= (windowCenter - windowCenterOffsetTwo))) {
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        top: '10px',
                                        marginLeft: '0em',
                                        marginRight: '0em',
                                        scale: 1,
                                        z: '0',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-content-front'), 1.75, {
                                        force3D: true,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 1,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.set(currentIteration, {
                                        zIndex: front
                                    });
                                }
                                //////////////////////////////////////////////////////////////////////////////////////
                                //drag and throw RIGHT items animation
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ((itemsOffsetCenter >= (windowCenter + (windowCenterOffsetOne + 1))) && (itemsOffsetCenter <= (windowCenter + windowCenterOffsetTwo))) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: middle
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        top: '10px',
                                        rotationY: 0,
                                        marginLeft: '-7em',
                                        marginRight: '7em',
                                        scale: 0.9,
                                        z: '-35',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0.5,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 0,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-front-wrapper'), 1.75, {
                                        autoAlpha: 1,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-back-wrapper'), 1.75, {
                                        autoAlpha: 0,
                                        ease: Power4.easeOut
                                    });
                                } else if (itemsOffsetCenter >= (windowCenter + (windowCenterOffsetTwo + 1))) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: back
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        top: '10px',
                                        marginLeft: '-20em',
                                        marginRight: '20em',
                                        scale: 0.75,
                                        z: '-70',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 0,
                                        ease: Power4.easeOut
                                    });
                                }
                                //////////////////////////////////////////////////////////////////////////////////////
                                //drag and throw LEFT items animation
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ((itemsOffsetCenter <= (windowCenter - (windowCenterOffsetOne + 1))) && (itemsOffsetCenter >= (windowCenter - windowCenterOffsetTwo))) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: middle
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        top: '10px',
                                        rotationY: 0,
                                        marginRight: '-7em',
                                        marginLeft: '7em',
                                        scale: 0.9,
                                        z: '-50',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0.5,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 0,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-front-wrapper'), 1.75, {
                                        autoAlpha: 1,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-back-wrapper'), 1.75, {
                                        autoAlpha: 0,
                                        ease: Power4.easeOut
                                    });
                                } else if (itemsOffsetCenter <= (windowCenter - (windowCenterOffsetTwo + 1))) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: middle
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        top: '10px',
                                        z: '-70',
                                        marginRight: '-20em',
                                        marginLeft: '20em',
                                        scale: 0.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 0,
                                        ease: Power4.easeOut
                                    });
                                }
                            }
                        }
                        function update() {
                            var content;
                            var dragContent;
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    windowWidth = window.innerWidth;
                                    content = document.getElementById("flash-cards");
                                    elementWrapper = document.getElementById("flash-cards-swipe-container");
                                    elementIteration = document.getElementsByClassName("flash-cards-object");
                                    sections = elementIteration.length;
                                    maxScroll = content.scrollWidth - (content.offsetWidth / 2);
                                    elementWidth = elementIteration[0].offsetWidth;
                                    sections = elementIteration.length;
                                    dragAreaLeftPadding = (windowWidth / 2) - (elementWidth / 2);
                                    dragAreaWidth = (elementWidth * sections) + (dragAreaLeftPadding * 2);
                                    TweenMax.set(elementWrapper, {
                                        width: dragAreaWidth,
                                        paddingLeft: dragAreaLeftPadding
                                    });
                                    dragContent = Draggable.get(content);
                                    updateAnimation();
                                });
                            });
                            elementWrapper = document.getElementById("flash-cards-swipe-container");
                            content = document.getElementById("flash-cards");
                            var dragContent = Draggable.get(content);
                            function killTweens() {
                                TweenMax.killTweensOf([dragContent.scrollProxy]);
                            }
                            content.addEventListener("DOMMouseScroll", killTweens);
                            flashCardsDraggable = Draggable.create(content, {
                                type: "scrollLeft",
                                edgeResistance: 0.5,
                                throwProps: true,
                                snap: function (endValue) {
                                    var step = elementWidth;
                                    return Math.round(endValue / step) * -step;
                                },
                                onDrag: function (e) {
                                    updateAnimation();
                                    $scope.onDrag();
                                    nativeSCrl = false;
                                },
                                onThrowUpdate: function (e) {
                                    updateAnimation();
                                    nativeSCrl = true;
                                },
                                onThrowComplete: function () {
                                    nativeSCrl = true;
                                }
                            });
                        }
                        update();
                        // TODO: Refactor this / the below, it's confusing
                        function nScrollSNAP(Array, val) {
                            var SPoint, range = 400, i = 0;
                            for (i in Array) {
                                var MResult = Math.abs(val - Array[i]);
                                if (MResult < range) {
                                    range = MResult;
                                    SPoint = Array[i];
                                }
                            }
                            return SPoint;
                        }
                        // TODO: Refactor this / the above, it's confusing
                        function NScrollSnap() {
                            if (nativeSCrl) {
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::npFlashCards::NScrollSnap:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::nativeSCrl:', nativeSCrl,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
                                var S = nScrollSNAP(flashCardsDraggable[0].vars.snap,
                                        flashCardsDraggable[0].scrollProxy.scrollTop());
                                TweenMax.to(flashCardsDraggable[0].scrollProxy.element,
                                        0.5, {
                                            scrollTo: {x: S}
                                        });
                            }
                        }
                        document.getElementById("flash-cards").onscroll = function () {
                            TweenMax.killDelayedCallsTo(NScrollSnap);
                            TweenMax.delayedCall(0.35, NScrollSnap);
                        };
                    }
                };
            })
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npFlashCards::component loaded!');
                    }
            );
})();

/* jshint -W003, -W117 */
(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npMatchController',
    function ($log, $scope, $rootScope, $timeout, ManifestService, $sce, sliders) {
      var cmpData = $scope.component.data;
      $log.debug('npQuestion::data', cmpData);

      this.id = cmpData.id;
      this.content = $sce.trustAsHtml(cmpData.content);
      this.type = cmpData.type;
      this.feedback = '';
      this.canContinue = false;
      var self = this;

      var feedback = cmpData.feedback;

      this.changed = function () {
        $log.debug('npQuestion::answer changed');
        if (feedback.immediate) {
          this.feedback = '';
        }
      };

      this.evaluate = function () {
        var correct = true;
        var allCorrect = true;
        $log.debug('npQuestion::evaluate:', this.answer);
        var answer;
        _.each(sliders, function (slide) {
          var s = slide.currSlide.holder;
          var cmp = ManifestService.getComponent(s.children().attr('idx'));
          var cmpData  = cmp.data;
          if (!answer) {
            answer = cmpData.correct;
            return;
          } else {
            if (cmpData.correct === answer) {
              return;
            }
           correct = false;
          }
        });

        $log.debug('npMatch::evaluate:isCorrect', correct);

        // set by ng-model of npAnswer's input's
        if (feedback.immediate) {
          if (correct) {
            $rootScope.$emit('slider-disable-wrong');
            this.feedback = feedback.correct;
            this.feedbackBad = false;
          } else {
            this.feedback = feedback.incorrect;
            this.feedbackBad = true;
          }
        }

        // timeout and wait for dom manipulation to finish
        $timeout(function () {
          // check that alll are matched
          _.each(sliders[0].slidesJQ, function (slide) {
            if (!slide.data('correct')) {
              allCorrect = false;
              return false;
            }
          });

          if (allCorrect) {
              self.canContinue = true;
          }
        });
      };

      this.nextPage = function (evt) {
        // TODO - have a better way to go to the next page in the manifest service
        // si: I'd like to see a next page and previous page methods
        ManifestService.goToNextPage();
        evt.preventDefault();
      };
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npQuestion::component loaded!');
    }
  );
})();

/* jshint -W003, -W117 */
(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npMatchRowController',
    function ($log, $scope, $sce) {
      var cmpData = $scope.component.data || {};
      $log.debug('npMatchRow::data', cmpData);

      this.id = cmpData.id;
      this.label = $sce.trustAsHtml(cmpData.label);
      // shuffle em up
      $scope.components = _.shuffle($scope.components);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npMatchRow::component loaded!');
    }
  );
})();

/* jshint -W003, -W117, -W064 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npTriviaController',
                    function ($log, $scope, $rootScope, $timeout, $sce, ManifestService, AssessmentService) {
                        var vm = this;
                        var cmpData = $scope.component.data;
//                        var pagesLen = $scope.components.length;
                        $log.debug('npTrivia::data', cmpData);
                        vm.id = cmpData.id;
                        vm.content = $sce.trustAsHtml(cmpData.content);
                        vm.type = cmpData.type;
                        vm.currentPage = 0;
                        vm.feedback = '';
                        vm.pageId = cmpData.id;
                        vm.difficulty = cmpData.difficulty || 0;
                        //AssessmentService.addPage(cmpData.id, cmpData.required);

                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on ready set states
                                //////////////////////////////////////////////////////////////////////////////////////
                                var btnNextHeight = $('.btn-next ').outerHeight(true);
                                var pageHeight = $('.npPage').outerHeight(true);
                                TweenMax.set($('.npPage'), {
                                    height: btnNextHeight + pageHeight
                                });
                            });
                        });

                        /* NOTE: commented 2015-04-20 cw77, this disables shuffling of pages */
                        // go to the first page, since pages were shuffled
//                        vm.assment = AssessmentService();
//                        vm.assment.setRequiredPages(pagesLen);
//                        vm.seenComponents = _.shuffle($scope.components); // re-enable for more shuffle
//                        vm.seenComponents = $scope.components;
//                        vm.pageId = vm.seenComponents[0].data.id;
//                        vm.difficulty = vm.seenComponents[0].components[0].data.difficulty || 0;
                        //$timeout(function () {
                        //    ManifestService.setPageId(vm.pageId);
                        //});
                        $rootScope.$on('question.answered', function (evt, correct) {
                            if (correct) {
                              /* NOTE: commented 2015-04-20 cw77, this disables shuffling of pages */
                              //AssessmentService.pageViewed();
                              //vm.currentPage = vm.assment.getPageviewsCount();
                              //vm.pageId = vm.seenComponents[vm.currentPage] ? vm.seenComponents[vm.currentPage].data.id : '';
                              //  ManifestService.setPageId(vm.pageId);
                                $rootScope.$emit('spin-to-win');
                                // end of the trivia questions
                                // TODO - add this message the template and set the two values
                                // here in the controller
                                // NOTE: This text should come from the app
//  min-height: 740px;
                                if (!vm.pageId) {
                                    vm.feedback = 'Good job, you scored 5,000 points out of 7,500 possible.';
                                }
                            }
                        });
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npTrivia::component loaded!');
                    }
            );
})();

(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npAsQuestionController',
                    function ($log, $scope, $attrs, $rootScope, ManifestService, $sce, $element, AssessmentService) {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set that
                        //////////////////////////////////////////////////////////////////////////////////////
                        var cmpData = $scope.component.data,
                          vm = this;
                        $log.debug('npAsQuestion::data', cmpData);
                        vm.id = cmpData.id;
                        vm.content = $sce.trustAsHtml(cmpData.content);
                        vm.type = cmpData.type;
                        vm.feedback = '';
                        vm.canContinue = false;
                        vm.answers = [];
                        var feedback = cmpData.feedback;
                        var feedbackLabel = $element.find('.question-feedback-label');
                        var negativeFeedbackIcon = '';
                        var positiveFeedbackIcon = '';

                      AssessmentService.addQuestion(vm.id, !!cmpData.required);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //build that
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                TweenMax.set($(".response-item"), {
                                    autoAlpha: 0,
                                    scale: 0.5,
                                    force3D: true
                                });
                                TweenMax.staggerTo($(".response-item"), 2, {
                                    scale: 1,
                                    autoAlpha: 1,
                                    delay: 0.75,
                                    ease: Power4.easeOut,
                                    force3D: true
                                }, 0.2);
                            });
                        });
                      vm.registerAnswer = function(idx, answer) {
                        vm.answers[idx] = answer;
                      };
                        vm.update = function (event) {
                            $log.debug('npAsQuestion::answer changed');
                            if (feedback.immediate) {
                                vm.feedback = '';
                                negativeFeedbackIcon = $element.find('.negative-feedback-icon');
                                positiveFeedbackIcon = $element.find('.positive-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {
                                    autoAlpha: 0,
                                    scale: 2.5,
                                    force3D: true
                                });
                                TweenMax.set(positiveFeedbackIcon, {
                                    autoAlpha: 0,
                                    scale: 2.5,
                                    force3D: true
                                });
                            }
                        };
                        vm.evaluate = function () {
                            var answerIdx,chkAnswers,
                                isCorrectAnswer = true,
                                $checkbox = false,
                                $checked = false;
                            negativeFeedbackIcon = $element.find('.negative-feedback-icon');
                            positiveFeedbackIcon = $element.find('.positive-feedback-icon');
                            TweenMax.to(negativeFeedbackIcon, 0.25, {
                                autoAlpha: 0,
                                scale: 2.5,
                                force3D: true
                            });
                            TweenMax.to(positiveFeedbackIcon, 0.25, {
                                autoAlpha: 0,
                                scale: 2.5,
                                force3D: true
                            });
                            //chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
                            //$checkbox = $element.find('.checkbox-x');
                            //$checked = $element.find('.checkbox-x[checked]');
                            $log.debug('npAsQuestion::evaluating type to check', cmpData);



                                switch (cmpData.type) {
                                    case 'checkbox':

                                      $log.debug('npAsQuestion::evaluating checkboxes', vm.answers, vm.answers.length);
                                      for( answerIdx in vm.answers )   {
                                        var answer = vm.answers[answerIdx];

                                        $log.debug('npAsQuestion: evaluating checkbox', answerIdx, answer);
                                        isCorrectAnswer = isCorrectAnswer && answer.checked === answer.isCorrect;

                                        if( !isCorrectAnswer ) {
                                          break;
                                        }
                                      }
                                        break;
                                    case 'text':
                                        var txtAnswer = ManifestService.getFirst('npAnswer', $scope.cmpIdx);
                                        var key = txtAnswer.data.correct;
                                        var regExp, pat, mod = 'i';
                                        if (angular.isString(key)) {
                                            if (key.indexOf('/') === 0) {
                                                pat = key.substring(1, key.lastIndexOf('/'));
                                                mod = key.substring(key.lastIndexOf('/') + 1);
                                            }
                                        } else if (angular.isArray(key)) {
                                            pat = '^(' + key.join('|') + ')$';
                                        }
                                        regExp = new RegExp(pat, mod);
                                        if (!regExp.test(vm.answer)) {
                                            if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.incorrect)) {
                                                vm.feedback = txtAnswer.data.feedback.incorrect;
                                                feedbackLabel.remove();
                                            }
                                            isCorrectAnswer = false;
                                        } else {
                                            if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.correct)) {
                                                vm.feedback = txtAnswer.data.feedback.correct;
                                                feedbackLabel.remove();
                                            }
                                        }
                                        break;
                                }


                          AssessmentService.questionAnswered(vm.id, isCorrectAnswer);
                            $log.debug('npAsQuestion::evaluate:isCorrect', isCorrectAnswer);
                            // set by ng-model of npAnswer's input's
//                            if (feedback.immediate && vm.feedback === '') {
                            feedbackLabel.remove();
                            if (isCorrectAnswer) {
                                vm.feedback = feedback.correct;
                                vm.canContinue = true;
                                TweenMax.to(positiveFeedbackIcon, 0.75, {
                                    autoAlpha: 1,
                                    scale: 1,
                                    force3D: true
                                });
                            } else {
                                vm.feedback = feedback.incorrect;
                                vm.canContinue = false;
                                TweenMax.to(negativeFeedbackIcon, 0.75, {
                                    autoAlpha: 1,
                                    scale: 1,
                                    force3D: true
                                });
                            }
//                            }
                        };
                        vm.nextPage = function (evt) {
                            evt.preventDefault();
                            if (vm.canContinue) {
                                $rootScope.$emit('question.answered', true);
                            }
                        };
                    }
            )
            .directive('questionFeedbackBuild', function () {
                return function ($scope, $element, attrs) {
                    var negativeFeedbackIcon = '';
                    var postiveFeedbackIcon = '';
                    setTimeout(function () {
                        $scope.$apply(function () {
//                            negativeFeedbackIcon = $element.find('.hotspotButton');
                            function onPageLoadBuild() {
                                negativeFeedbackIcon = $('.negative-feedback-icon');
                                postiveFeedbackIcon = $('.positive-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {autoAlpha: 0, scale: 2.5, force3D: true});
                                TweenMax.set(postiveFeedbackIcon, {autoAlpha: 0, scale: 2.5, force3D: true});
                            }
                            onPageLoadBuild();
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npAsQuestion::component loaded!');
                    }
            );
})();

(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npAsAnswerController',
                    function ($log, $scope, $sce, $element) {
                        var vm = this;
                        var cmpData = $scope.component.data || {};
                        this.id = cmpData.id;
                        this.label = $sce.trustAsHtml(cmpData.label);

//                                checkmark = $element.find('svg#Layer_1'),
//                                cmpData = $scope.component.data || {}; // already defined above
                        vm.isCorrect = cmpData.correct;
                      // updateCheck is currently not defined but needed. Should it be the code below?
                      var updateCheck = angular.noop;
//                        var updateCheck = function () {
//                            var tweenOptions = {ease: Power3.easeOut};

//                            if (vm.checked) {
//                                tweenOptions.autoAlpha = 1;
//                            } else {
//                                tweenOptions.autoAlpha = 0;
//                            }
                        //$log.debug('updateCheck', checkmark, tweenOptions);
//                            TweenMax.to(checkmark, 0.25, tweenOptions);
//                        };
                        //$log.debug('npAsAnswer::data', cmpData);
                        vm.id = cmpData.id;
                        vm.label = $sce.trustAsHtml(cmpData.label);
                        vm.question = null;
                        vm.checked = false;
                        vm.answer = vm;

                        vm.setQuestion = function (idx, question) {
                          $log.debug('setQuestion', idx, question);
                            //$scope.question = question;
                            question.registerAnswer(idx, this);
                        };


//                        vm.clicked = function ($event) {
//                            //$log.debug('npAsAnswer clicked', $event, cmpData);
//                            if (vm.question.type === 'checkbox') {
//                                vm.checked = !vm.checked;
//                                vm.question.answerChanged(vm);
//                            } else if (vm.question.type === 'radio') {
//                                vm.checked = true;
//                                vm.question.answerChanged(vm);
//                            }
////                            updateCheck();
//                        };
//                        vm.clear = function () {
//                            vm.checked = false;
////                            updateCheck();
//                        };
                    }
            )
            .directive('npAsAnswerCheckbox', function () {
                return function ($scope, $element, $sce, $log) {
                    var cmpData = $scope.component.data || {};
//                    this.label = $sce.trustAsHtml(cmpData.label);

                    setTimeout(function () {
                        $scope.$apply(function () {
                            //////////////////////////////////////////////////////////////////////////////////////
                            //set states
                            //////////////////////////////////////////////////////////////////////////////////////
                            var checkboxX = $element.find('.checkbox-x');
                            TweenMax.set(checkboxX, {autoAlpha: 0, scale: 2.5, force3D: true});
                            $scope.update = function (event) {

                                var clickedCheckbox = event.currentTarget;
                                var $checkbox = $(clickedCheckbox).find('.checkbox-x');
                                $checkbox.attr('checked', !$checkbox.attr('checked'), ('true'));
                                //////////////////////////////////////////////////////////////////////////////////////
                                //update states on click
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ($checkbox.attr('checked') === 'checked') {
//                                    console.log(
//                                            '\n::::::::::::::::::::::::::::::::::::::npAsAnswerCheckbox::inside:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                            '\n::this::', this,
//                                            '\n::this.npAsAnswer::', this.npAsAnswer,
//                                            '\n::this.label::', this.label,
//                                            '\n::$checkbox.attr(checked)::', $checkbox.attr('checked'),
//                                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                            );

                                    $scope.npAnswer.checked = true;
                                    TweenMax.to($(clickedCheckbox).find('.checkbox-x'), 0.75, {
                                        autoAlpha: 1,
                                        scale: 0.7,
                                        ease: Power3.easeOut
                                    });
                                } else if ($checkbox.attr('checked') !== 'checked') {
                                    TweenMax.to($(clickedCheckbox).find('.checkbox-x'), 0.25, {
                                        autoAlpha: 0,
                                        scale: 2.5,
                                        ease: Power3.easeOut
                                    });

                                  $scope.npAnswer.checked = false;
                                }

                              //console.debug('npAsAnswer directive answer changed', $scope.npQuestion, $scope.npAnswer);
                              //$scope.npQuestion.answerChanged($scope.answer);
                            };
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        //$log.debug('npAsAnswer::component loaded!');
                    }
            );
})();




(function() {
  'use strict';

  angular
    .module(
    'newplayer',
    [
      'ui.bootstrap',
      'ngSanitize',
      'newplayer.service',
      'newplayer.component',
      'angular-royalslider',
      'matchMedia'
    ]
  )

  /** @ngInject */
    //.factory('AssessmentService', AssessmentService) // no longer using this
    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(true);
    });
})();

/* jshint -W004 */
(function () {

  'use strict';
  angular
    .module('newplayer')
    .controller('AppController', AppController)
    .value('sliders', {});

  /** @ngInject */
  function AppController($log, $scope, AssessmentIOService/*, ImagePreloadFactory, HomeService, $scope*/) {
    $log.debug('AppController::Init');

    var vm = this;
    vm.doTrack = function (event, data) {
      $log.warn('AppController', event, data);
    };

    vm.assessmentIO = AssessmentIOService;

    vm.i18n = {
      submit: 'Submit',
      next: 'Next',
      pass: 'Congratulations, you scored :USERSCORE:% and have passed this module.',
      fail: 'Sorry, you scored :USERSCORE:% and you needed to score :MINSCORE:% to pass. Try it again!'
    };

    //AssessmentService.setRequirements(10,5,0.8);
    //
    //$log.info('Initial------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //
    //$log.info('Page stats', AssessmentService.getPageStats());
    //$log.info('Question stats', AssessmentService.getQuestionStats());


    /*
     var loader = ImagePreloadFactory.createInstance();
     loader.addImages([
     '/images/bigBlueArrow.png'
     ]);
     loader.start();
     */
    /*
     $scope.date = new Date().getFullYear();
     var cover = (function(){
     var supported = ('backgroundSize' in document.documentElement.style);
     if(supported){
     var temp = document.createElement('div');
     temp.style.backgroundSize = 'cover';
     supported = temp.style.backgroundSize == 'cover';
     }
     return supported;
     })();
     */
    /*
     $scope.coverSupported = cover;
     if (isMobile.other.windows){
     $scope.coverSupported = false;
     }
     */
  }
})();

/* jshint -W003,-W004, -W038, -W117 */

(function () {

    'use strict';
    angular
            .module('newplayer')
            .directive('npLayer', NpLayer);

    /** @ngInject */
    function NpLayer($log/*,  $timeout*/) {
        $log.info('NpLayer::Init\n');

        var directive = {
            restrict: 'E',
            scope: {
                manifestId: '@npId',
                manifestURL: '@npUrl',
                overrideURL: '@npOverrideUrl',
                overrideData: '@npOverrideData',
                minPassing: '@npMinPassing',
                language: '@npLang',
                onTrackService: '&npAnalyticsService',
                assessmentIO: '=assessmentIo',
                manifestData: '=?',
                i18n: '=?'
            },
            //compile: function (tElement, tAttrs, transclude, ConfigService)
            //{
            //  /** @ngInject */
            //  return function ($scope, $element, $attributes)
            //  {
            //    $log.info('ComponentDirective::compile!', $attributes);
            //    var vm = $scope.vm;
            //
            //
            //
            //    parseComponent( $scope, $element, $attributes );
            //  };
            //},
            controller: NpLayerController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    /** @ngInject */
    function NpLayerController($scope, $rootScope, $element, $attrs, $log, $compile,
            APIService, ComponentService, ConfigService, i18nService, ManifestService, TrackingService) {
        var vm = this;
        vm.manifestData = null;
        vm.overrideData = null;

        // $rootScope.$on('npLangChanged', npLangChanged);
        // $rootScope.$on('npPageWantsChange', npPageChanged);
        //.on('npManifestChanged', npManifestChanged)

        ConfigService.setConfigData(vm);
        loadManifests();
        TrackingService.setCallback(vm.onTrackService);

        if( typeof vm.i18n === 'object' ) {
          i18nService.initWithDict(vm.i18n);
        }

        //function npManifestChanged(event, toManifest, toPage) {
        //
        //}
        function npLangChanged(event, toLang) {
            $log.info('npLangChanged', event, toLang);
            if (!!toLang) {
                ManifestService.setLang(toLang);
                parseComponent($scope, $element, $attrs, $compile);
            }
        }

        function npPageWantsChange(event, toPage) {
            $log.info('npPageWantsChange', event, toPage);
            if (!!toPage) {
                ManifestService.setPageId(toPage);
                //$element.empty();
                //parseComponent($scope, $element, $attrs, $compile);
            }
        }

        //$log.info('NpLayer ConfigService:', ConfigService);

        /*
         * ---------------- supporting functions INSIDE function to keep scope
         */

        function loadManifests() {
            var manifestURL = ConfigService.getManifestURL();
            APIService.getData(manifestURL).then(function (md) {
                vm.manifestData = md;

                var overrideURL = ConfigService.getOverrideURL();

                if (!!vm.language) {
                    ManifestService.setLang(lang);
                }

                if (!!overrideURL) {
                    $log.info('NpLayer: getting override data from:', overrideURL);
                    ConfigService.getOverrideData(overrideURL).then(function (od) {
                        vm.overrideData = od;
                        renderComponent(vm, $scope, $element, $attrs, $compile);
                    });

                } else {
                    $log.info('NpLayer: init manifest', vm.manifestData);
                    renderComponent(vm, $scope, $element, $attrs, $compile);
                }
            });
        }

        $rootScope.$on('npReplaceManifest', function (obj, newManifest) {
            $log.info('NpLayer:changeManifestTo | ', newManifest);
            ConfigService.setManifestURL(newManifest);
            loadManifests();
        });


        function renderComponent(vm, $scope, $element, $attrs, $compile) {
            $element.empty();
            ManifestService.initialize(vm.manifestData, vm.overrideData);
            parseComponent($scope, $element, $attrs, $compile);
        }

        function parseComponent($scope, $element, $attributes, $compile) {
            var cmp = ManifestService.getComponent($attributes.idx);
            var cmpIdx = cmp.idx || [0];

            //$log.debug('NpLayer::parseComponent', cmp, cmpIdx, $attributes);
            if (!!cmp) {

                //$log.debug('NpLayer::parseComponent then', cmp, cmpIdx);
                // reset scope!!!
                $scope.subCmp = false;
                $scope.component = cmp;
                $scope.components = null;

                $scope.cmpIdx = cmpIdx.toString();

                $element.attr('data-cmpType', cmp.type);
                $element.addClass('np-cmp-sub');

                if (!!cmp.data) {
                    // set known data values
                    var attrId = cmp.data.id;
                    if (!attrId) {
                        attrId = cmp.type + ':' + cmpIdx.toString();
                    }
                    // id must start with letter (according to HTML4 spec)
                    if (/^[^a-zA-Z]/.test(attrId)) {
                        attrId = 'np' + attrId;
                    }
                    // replace invalid id characters (according to HTML4 spec)
                    attrId = attrId.replace(/[^\w\-.:]/g, '_');
                    //$element.attr( 'id', attrId );
                    if (!cmp.data.id) {
                        cmp.data.id = attrId;
                    }
                    $element.attr('id', 'np_' + attrId);

                    var attrClass = cmp.data['class'];
                    if (angular.isString(attrClass)) {
                        attrClass = attrClass.replace(/[^\w\-.:]/g, '_');
                        $element.addClass('np_' + attrClass);
                    }

                    var attrPlugin = cmp.data.plugin;
                    if (angular.isString(attrPlugin)) {
                        attrPlugin = attrPlugin.replace(/[^\w\-.:]/g, '_');
                    }
                }
                if (!!cmp.components && cmp.components.length > 0) {
                    //$log.debug('NpLayer::parseComponent - HAS SUBS:', cmp);
                    $scope.subCmp = true;
                    $scope.components = cmp.components;
                }

                var templateData = ComponentService.getTemplate(cmp);
                //$log.debug('npComponent::parseComponent: template', templateData);

                // modify template before compiling!?
                var tmpTemplate = document.createElement('div');
                tmpTemplate.innerHTML = templateData;

                var ngWrapperEl, ngMainEl, ngSubEl;
                ngWrapperEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-wrapper'));
                ngMainEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-main'));
                ngSubEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-sub'));
                if (ngWrapperEl.length) {
                    ngWrapperEl.attr('id', attrId);
                    ngWrapperEl.addClass(attrPlugin);

                    // pass all "data-*" attributes into element
                    angular.forEach(cmp.data, function (val, key) {
                        if (angular.isString(key) && key.indexOf('data-') === 0) {
                            ngWrapperEl.attr(key, val);
                        }
                    });
                }
                if (ngMainEl.length) {
                    if (!ngWrapperEl.length) {
                        ngMainEl.attr('id', attrId);
                        ngMainEl.addClass(attrPlugin);

                        // pass all "data-*" attributes into element
                        angular.forEach(cmp.data, function (val, key) {
                            if (angular.isString(key) && key.indexOf('data-') === 0) {
                                ngMainEl.attr(key, val);
                            }
                        });
                    }
                    ngMainEl.addClass(attrClass);
                }

                var compiledTemplate = $compile(tmpTemplate.innerHTML);
                compiledTemplate($scope, function (clone) {
                    $element.append(clone);
                });

                //  }
                //);
            }
        }
    }

})();

/* jshint -W003,-W004, -W038, -W117, -W106, -W026, -W040 */
(function () {
    'use strict';
    angular
            .module('newplayer')
            .directive('npPriceIsRightSpinner', npPriceIsRightSpinner);
    /** @ngInject */
    function npPriceIsRightSpinner($log, $timeout, $rootScope) {
        $log.debug('npPriceIsRightSpinner::Init\n');
        var directive = {
            restrict: 'E',
            scope: {
                spinTime: '@',
                delayTime: '@',
                shuffleSpaces: '@'
            },
            link: link,
            controller: npPriceIsRightSpinnerController,
            controllerAs: 'vm',
            transclude: true,
            replace: true,
            template: '<div class="wheels"><div class="wheel" ng-transclude></div></div>'
        };
        return directive;
        function link(scope, element, attrs) {
            var spin_time = attrs.spintime || 2000,
                    delay_time = attrs.delaytime || 1000,
                    shuffle_spaces = attrs.shufflespaces || true;
            var $wheel = element.find('.wheel');
            var $wheel_div = element.find('.wheel div');
            TweenMax.set($wheel, {
                alpha: 0
            });
            function shuffle() {
                element.find('.wheel div[data-pick="true"]').removeAttr('data-pick');
                var difficulty = element.data('difficulty');
                element.find('.wheel div:eq(' + difficulty + ')').attr('data-pick', 'true');
                if (shuffle_spaces) {
                    var spaces = element.find('.wheel div').detach();
                    element.find('.wheel').append(_.shuffle(spaces));
                }
            }
            function spin() {
                var $choice = element.find('.wheel div[data-pick="true"]').remove();
                element.find('.wheel').append($choice);
                //////////////////////////////////////////////////////////////////////////////////////
                // using clipping now :: no spin for you! //
                //////////////////////////////////////////////////////////////////////////////////////
                TweenMax.to($choice, 0.25, {
                    alpha: 0
                });
                TweenMax.to($wheel, 0.25, {
                    alpha: 0
                });
                if (!Modernizr.csstransforms3d) {
                    element.find('.wheel').append(element.find('.wheel div').clone());
                    element.find('.wheel div').css({
                        'position': 'relative',
                        'margin-bottom': '0px'
                    });
                    element.find('.wheel').animate({"top": "-=1250px"}, 5000);
                    return;
                }
                TweenMax.set($wheel, {
                    transformStyle: 'preserve-3d',
                    alpha: 0
                });
                _.each(element.find('.wheel div'), function (elem, index) {
//                    console.log(
//                            '\n::::::::::::::::::::::::::::::::::::::npSpinner::data tests:::::::::::::::::::::::::::::::::::::::::::::::::',
//                            '\n::index::', index,
//                            '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                            );
                    //////////////////////////////////////////////////////////////////////////////////////
                    // adjust index amount (number in template) vs numberDisplayed to detirmine facete
                    // number displayed.
                    //////////////////////////////////////////////////////////////////////////////////////
                    var numberDisplayed = 20;
                    TweenMax.to(elem, 0, {
                        rotationX: (numberDisplayed * index),
                        transformOrigin: '0 10 -200px'
                    });
                });
                //////////////////////////////////////////////////////////////////////////////////////
                // test code for use in the console, select the
                // s='10% 10% -100px';e='10% 10% -100px';wheel = $('.wheel');TweenMax.fromTo(wheel, 5,
                // {rotationX:-360,transformOrigin:s}, {rotationX:0,transformOrigin:e})
                //////////////////////////////////////////////////////////////////////////////////////
                var transformOrigin = '0% 5% -200px';
                TweenMax.fromTo($wheel, 5, {
                    alpha: 0,
                    rotationX: 900,
                    transformOrigin: transformOrigin
                }, {
                    alpha: 1,
                    rotationX: 0,
                    transformOrigin: transformOrigin
//                    ease: Elastic.easeOut.config(1, 0.3)
                });
                TweenMax.to($choice, 0.25, {
                    alpha: 1,
                    ease: Power3.easeOut
                });
            }
            $timeout(function () {
                shuffle();
                spin();
            }, delay_time);
            function spinAgain() {
                shuffle();
                spin();
            }
            $rootScope.$on('spin-to-win', spinAgain);
        }
    }
    /** @ngInject */
    function npPriceIsRightSpinnerController($scope, $rootScope) {
        var vm = this;
        init();
        function init() {
        }
    }
})();

angular.module('newplayer').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('scripts/component/blank.html',
    "<div class=\"{{component.type}}\" ngcontroller=\"{{component.type}}Controller\">\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n"
  );


  $templateCache.put('scripts/component/component.html',
    "<div>\n" +
    "\tCOMPONENT.HTML\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAnswer/npAnswer.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "<div np-answer-checkbox ng-if=\"npQuestion.type === 'checkbox'\" class=\"row np-cmp-wrapper {{component.type}} checkbox answer-wrapper\" ng-controller=\"npAnswerController as npAnswer\" ng-click=\"update($event)\">\n" +
    "    <div class=\"col-xs-1 npAnswer-checkbox np-cmp-main answer-checkbox\" name=\"checkbox{{npAnswer.id}}\" ng-model=\"npQuestion.answer[component.idx]\" value=\"{{component.idx}}\" id=\"{{npAnswer.id}}\">\n" +
    "        <div class=\"checkbox-box\">\n" +
    "            <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                <style type=\"text/css\">\n" +
    "                    <![CDATA[\n" +
    "                    .st0{fill:url(#SVGID_1_);}\n" +
    "                    .st1{display:inline;}\n" +
    "                    .st2{display:none;}\n" +
    "                    ]]>\n" +
    "                </style>\n" +
    "                <g id=\"Layer_2\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                        <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                        <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                        <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                        <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"3\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox-x\">\n" +
    "            <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.121px\" height=\"22.121px\" viewBox=\"796.393 809.141 22.121 22.121\" style=\"enable-background:new 796.393 809.141 22.121 22.121;\" xml:space=\"preserve\">\n" +
    "                <g>\n" +
    "                    <line style=\"fill:none;stroke:#9a7d46;stroke-width:2;stroke-miterlimit:10;\" x1=\"797.453\" y1=\"830.201\" x2=\"817.453\" y2=\"810.201\"/>\n" +
    "                    <line style=\"fill:none;stroke:#9a7d46;stroke-width:2;stroke-miterlimit:10;\" x1=\"817.453\" y1=\"830.201\" x2=\"797.453\" y2=\"810.201\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-9 answer-content-wrapper\">\n" +
    "        <span class=\"npAnswer-label  body-copy\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"npQuestion.type === 'text'\" class=\"np-cmp-wrapper {{component.type}} input-group\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <!--<label class=\"npAnswer-label \" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></label>-->\n" +
    "    <span class=\"npAnswer-label input-group-addon answer-text-input\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    <input type=\"text\" class=\"npAnswer-text np-cmp-main form-control answer-text-input\" name=\"text{{npAnswer.id}}\" ng-model=\"npQuestion.answer\" value=\"\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"npMatch\" class=\"np-cmp-wrapper {{component.type}} matchbox\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <div class=\"slide-wrapper reveal-slide rsContent\">\n" +
    "        <label>\n" +
    "            <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "        </label>\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAsAnswer/npAsAnswer.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "<div np-as-answer-checkbox ng-if=\"npQuestion.type === 'checkbox'\" class=\"row np-cmp-wrapper {{component.type}} checkbox answer-wrapper\" ng-controller=\"npAnswerController as npAnswer\" ng-init=\"npAnswer.setQuestion(component.idx, npQuestion);\" ng-click=\"update($event)\">\n" +
    "    <div class=\"col-xs-1 npAnswer-checkbox np-cmp-main answer-checkbox\" name=\"checkbox{{npAnswer.id}}\" ng-model=\"npQuestion.answer[component.idx]\" value=\"{{component.idx}}\" id=\"{{npAnswer.id}}\">\n" +
    "        <div class=\"checkbox-box\">\n" +
    "            <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                <style type=\"text/css\">\n" +
    "                    <![CDATA[\n" +
    "                    .st0{fill:url(#SVGID_1_);}\n" +
    "                    .st1{display:inline;}\n" +
    "                    .st2{display:none;}\n" +
    "                    ]]>\n" +
    "                </style>\n" +
    "                <g id=\"Layer_2\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                        <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                        <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                        <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                        <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"3\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox-x\">\n" +
    "            <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.121px\" height=\"22.121px\" viewBox=\"796.393 809.141 22.121 22.121\" style=\"enable-background:new 796.393 809.141 22.121 22.121;\" xml:space=\"preserve\">\n" +
    "                <g>\n" +
    "                    <line style=\"fill:none;stroke:#9a7d46;stroke-width:2;stroke-miterlimit:10;\" x1=\"797.453\" y1=\"830.201\" x2=\"817.453\" y2=\"810.201\"/>\n" +
    "                    <line style=\"fill:none;stroke:#9a7d46;stroke-width:2;stroke-miterlimit:10;\" x1=\"817.453\" y1=\"830.201\" x2=\"797.453\" y2=\"810.201\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-9 answer-content-wrapper\">\n" +
    "        <span class=\"npAnswer-label  body-copy\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"npQuestion.type === 'text'\" class=\"np-cmp-wrapper {{component.type}} input-group\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <!--<label class=\"npAnswer-label \" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></label>-->\n" +
    "    <span class=\"npAnswer-label input-group-addon answer-text-input\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    <input type=\"text\" class=\"npAnswer-text np-cmp-main form-control answer-text-input\" name=\"text{{npAnswer.id}}\" ng-model=\"npQuestion.answer\" value=\"\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n" +
    "<div ng-if=\"npMatch\" class=\"np-cmp-wrapper {{component.type}} matchbox\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <div class=\"slide-wrapper reveal-slide rsContent\">\n" +
    "        <label>\n" +
    "            <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "        </label>\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAsQuestion/npAsQuestion.html',
    "<div class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npAsQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">\n" +
    "    <!--<form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">-->\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <p class=\"h5 quiz-label\">question:</p>\n" +
    "    <div class=\"npQuestion-content question-text h4\" ng-bind-html=\"npQuestion.content\"></div>\n" +
    "    <p class=\"h5 quiz-label\">answers:</p>\n" +
    "    <div np-component class=\"response-item\" ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-6 question-submit-wrapper\">\n" +
    "            <button type=\"submit\" class=\"btn-submit btn\" ng-click=\"npQuestion.evaluate()\">\n" +
    "                <span>Submit</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            <div question-feedback-build >\n" +
    "                <div  class=\"question-feedback\">\n" +
    "                    <div class=\"question-feedback-wrapper vertical-centered\">\n" +
    "                        <div class=\"positive-feedback-icon\">\n" +
    "                            <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "                                 width=\"139.535px\" height=\"139.536px\" viewBox=\"665.896 1118.26 139.535 139.536\"\n" +
    "                                 enable-background=\"new 665.896 1118.26 139.535 139.536\" xml:space=\"preserve\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.9971\" y1=\"-44.001\" x2=\"475.1884\" y2=\"-58.8622\" gradientTransform=\"matrix(6.1102 0.342 0.342 -6.1102 -2188.8755 702.1841)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                </linearGradient>\n" +
    "                                <polygon fill=\"url(#SVGID_1_)\" points=\"784.624,1164.16 768.712,1150.084 722.812,1203.939 695.271,1180.684 681.195,1196.596  724.648,1233.316 \"/>\n" +
    "                                <path fill=\"#9A7D46\" d=\"M735.664,1257.796c-38.556,0-69.768-31.212-69.768-69.769c0-38.556,31.212-69.768,69.768-69.768  s69.768,31.212,69.768,69.768C805.432,1226.584,774.22,1257.796,735.664,1257.796z M735.664,1124.38  c-34.884,0-63.648,28.765-63.648,63.648s28.765,63.647,63.648,63.647s63.648-28.764,63.648-63.647S770.548,1124.38,735.664,1124.38z  \"/>\n" +
    "                            </svg>\n" +
    "                        </div>\n" +
    "                        <div class=\"negative-feedback-icon\">\n" +
    "                            <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"599.8 837.1 22.8 22.801\" enable-background=\"new 599.8 837.1 22.8 22.801\" xml:space=\"preserve\">\n" +
    "                                <path fill=\"#9A7D46\" d=\"M611.2,859.9c-6.3,0-11.4-5.101-11.4-11.4s5.101-11.4,11.4-11.4S622.6,842.2,622.6,848.5 S617.5,859.9,611.2,859.9z M611.2,838.1c-5.7,0-10.4,4.7-10.4,10.4s4.7,10.4,10.4,10.4s10.399-4.7,10.399-10.4 S616.9,838.1,611.2,838.1z\"/>\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"874.293\" y1=\"-1086.3877\" x2=\"861.2496\" y2=\"-1099.811\" gradientTransform=\"matrix(1 0 0 -1 -256 -245)\">\n" +
    "                                    <stop  offset=\"0.1642\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.1698\" style=\"stop-color:#CCA352\"/>\n" +
    "                                    <stop  offset=\"0.2532\" style=\"stop-color:#E4C682\"/>\n" +
    "                                    <stop  offset=\"0.3167\" style=\"stop-color:#F2DCA0\"/>\n" +
    "                                    <stop  offset=\"0.3527\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                                    <stop  offset=\"0.4062\" style=\"stop-color:#EBD191\"/>\n" +
    "                                    <stop  offset=\"0.48\" style=\"stop-color:#DDBC74\"/>\n" +
    "                                    <stop  offset=\"0.5532\" style=\"stop-color:#D2AC5F\"/>\n" +
    "                                    <stop  offset=\"0.6249\" style=\"stop-color:#CCA352\"/>\n" +
    "                                    <stop  offset=\"0.6933\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.7957\" style=\"stop-color:#D5B05B\"/>\n" +
    "                                    <stop  offset=\"0.9955\" style=\"stop-color:#F2DA7E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                </linearGradient>\n" +
    "                                <polygon fill=\"url(#SVGID_1_)\" points=\"605.8,856.5 611.2,851.2 616.5,856.5 619,854 613.7,848.7 619,843.4 616.5,840.8 611.2,846.1 605.9,840.8 603.4,843.4 608.7,848.7 603.3,854 \"/>\n" +
    "                            </svg>\n" +
    "                        </div>\n" +
    "                        <div class=\"npQuestion-feedback body-copy question-feedback-text\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "                        <div class=\"question-feedback-label\">Feedback area</div>\n" +
    "                    </div\n" +
    "                </div\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAsResult/npAsResult.html',
    "<div class=\"np-cmp-wrapper {{component.type}} np-result row\" ng-controller=\"npAsResultController as npResult\">\n" +
    "    <div class=\"summary np-result-summary \">\n" +
    "        <div class=\"np-result-container\">\n" +
    "            <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 368 222\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                <style type=\"text/css\">\n" +
    "                    <![CDATA[\n" +
    "                    .st0{fill:url(#SVGID_1_);}\n" +
    "                    .st1{display:inline;}\n" +
    "                    .st2{display:none;}\n" +
    "                    ]]>\n" +
    "                </style>\n" +
    "                <g id=\"Layer_2\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                        <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                        <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                        <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                        <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"12\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                </g>\n" +
    "            </svg>\n" +
    "        </div>\n" +
    "        <div class=\"results-wrapper-correct\">\n" +
    "            <div class=\"results-summary-text-wrapper col-xs-12\">\n" +
    "                <div class=\"results-summary-text\">{{npResult.summaryText}}</div>\n" +
    "            </div>\n" +
    "            <div class=\"results-summary-amount-wrapper row\">\n" +
    "                <div class=\"results-summary-label-text col-xs-6\">{{npResult.summaryLabelText}}</div>\n" +
    "                <div class=\"results-summary-pecentage col-xs-6\">{{npResult.summaryPecentage}}<div class=\"results-summary-pecentage-character\">%</div></div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"npResult.achievementText\">{{npResult.achievementText}}</div>\n" +
    "        </div>\n" +
    "        <div class=\"results-wrapper-incorrect\">\n" +
    "            <div class=\"results-summary-amount-wrapper row\">\n" +
    "                <div class=\"results-summary-label-text col-xs-6\">{{npResult.summaryLabelText}}</div>\n" +
    "                <div class=\"results-summary-pecentage col-xs-6\">{{npResult.summaryPecentage}}<div class=\"results-summary-pecentage-character\">%</div></div>\n" +
    "            </div>\n" +
    "            <div class=\"results-summary-text-wrapper col-xs-12\">\n" +
    "                <div class=\"results-summary-text\">{{npResult.summaryText}}</div>\n" +
    "            </div>\n" +
    "            <!--<div ng-show=\"npResult.achievementText\">{{npResult.achievementText}}</div>-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npAudio/npAudio.html',
    "<!--<div class=\"{{component.type}}\" ng-controller=\"npAudioController as npAudio\" id=\"{{npAudio.id}}\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    \n" +
    "    <videogular vg-theme=\"npAudio.config.theme.url\">\n" +
    "            <vg-video vg-src=\"npAudio.config.sources\" vg-native-controls=\"true\"></vg-video>\n" +
    "    </videogular>\n" +
    "    \n" +
    "    <audio\n" +
    "        width=\"100%\"\n" +
    "        preload=\"auto\"\n" +
    "        mediaelement>\n" +
    "        \n" +
    "                        <source type=\"video/{{npAudio.types[0]}}\" src=\"{{npAudio.baseURL}}.{{npAudio.types[0]}}\" />\n" +
    "                        <source ng-repeat=\"type in npAudio.types\" type=\"video/{{type}}\" src=\"{{npAudio.baseURL}}.{{type}}\" />\n" +
    "        \n" +
    "        <object width=\"100%\"  type=\"application/x-shockwave-flash\" data=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\">\n" +
    "            <param name=\"movie\" value=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\" />\n" +
    "            <param name=\"flashvars\" value=\"controls=true&file={{npAudio.baseURL}}.mp3\" />\n" +
    "             Image as a last resort \n" +
    "            <img src=\"myvideo.jpg\" width=\"320\" height=\"240\" title=\"No video playback capabilities\" />\n" +
    "        </object>\n" +
    "    </audio>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>-->\n" +
    "\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "\n" +
    "<np-audio component=\"component\" class=\"{{component.type}}\" id=\"{{component.data.id}}\">\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    <h3>{{component.type}} --\n" +
    "      <small>{{component.idx}}</small>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "\n" +
    "  <audio\n" +
    "    width=\"{{component.data.width}}\"\n" +
    "    preload=\"{{component.data.preload}}\"\n" +
    "    ng-src=\"{{component.data.src}}\"\n" +
    "    controls=\"controls\"\n" +
    "    mediaelelement>\n" +
    "\n" +
    "    <source ng-repeat=\"source in npAudio.sources\" type=\"audio/{{source.type}}\" ng-src=\"{{source.src}}\" />\n" +
    "\n" +
    "    <object width=\"{{component.data.width}}\" height=\"{{component.data.height}}\" type=\"application/x-shockwave-flash\"\n" +
    "            data=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\">\n" +
    "      <param name=\"movie\" value=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\"/>\n" +
    "      <param name=\"flashvars\" value=\"controls=true&file={{component.data.baseURL}}.mp3\"/>\n" +
    "      <!--<param name=\"allowfullscreen\" value=\"false\"/>-->\n" +
    "    </object>\n" +
    "  </audio>\n" +
    "\n" +
    "  <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</np-audio>\n" +
    "\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "<!--////////////////////////////////////////////////////////////////////////////////-->\n" +
    "\n" +
    "<!--<np-video component=\"component\" class=\"{{component.type}}\" id=\"{{component.data.id}}\">\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    <h3>{{component.type}} --\n" +
    "      <small>{{component.idx}}</small>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "\n" +
    "  <video\n" +
    "    height=\"{{component.data.height}}\"\n" +
    "    width=\"{{component.data.width}}\"\n" +
    "    poster=\"{{component.data.poster}}\"\n" +
    "    preload=\"{{component.data.preload}}\"\n" +
    "    ng-src=\"{{component.data.src}}\"\n" +
    "    controls=\"controls\"\n" +
    "    mediaelelement>\n" +
    "\n" +
    "    <source ng-repeat=\"source in npVideo.sources\" type=\"video/{{source.type}}\" ng-src=\"{{source.src}}\" />\n" +
    "\n" +
    "    <object width=\"{{component.data.width}}\" height=\"{{component.data.height}}\" type=\"application/x-shockwave-flash\"\n" +
    "            data=\"scripts/component/npVideo/mediaelement/flashmediaelement.swf\">\n" +
    "      <param name=\"movie\" value=\"scripts/component/npVideo/mediaelement/flashmediaelement.swf\"/>\n" +
    "      <param name=\"flashvars\" value=\"controls=true&file={{component.data.baseURL}}.mp4\"/>\n" +
    "      <param name=\"allowfullscreen\" value=\"false\"/>\n" +
    "    </object>\n" +
    "  </video>\n" +
    "\n" +
    "  <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</np-video>-->\n"
  );


  $templateCache.put('scripts/component/npButton/npButton.html',
    "<!--<div class=\"{{component.type}} {{npButton.type}} np-cmp-main btn\"  ng-controller=\"npButtonController as npButton\" ng-click=\"npButton.go()\">-->\n" +
    "<button class=\"{{component.type}} {{npButton.type}} {{buttonTypeClass}} np-cmp-main btn\"  ng-controller=\"npButtonController as npButton\" ng-click=\"npButton.go($event)\">\n" +
    "    <span class=\"debug\">\n" +
    "        <span class=\"h3\">{{component.type}} -- <small>{{component.idx}}</small></span>\n" +
    "    </span>\n" +
    "    <span ng-bind-html=\"npButton.content\"></span>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</button>\n" +
    "<!--</div>-->"
  );


  $templateCache.put('scripts/component/npColumn/npColumn.html',
    "<div class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npColumnController as npColumn\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <div\n" +
    "        ng-if=\"subCmp\"\n" +
    "        ng-repeat=\"row in rows\"\n" +
    "        ng-class=\"\n" +
    "                            [\n" +
    "                                    ($index + 1 === npColumn.lastRow) ? 'col-{{npColumn.lastRowColumns}}' : 'col-{{npColumn.columns}}'\n" +
    "                                                                        ]\"\n" +
    "        class=\"row\">\n" +
    "        <!--index:{{$index}}, lastRow:{{npColumn.lastRow}}, lastRowColumns:{{npColumn.lastRowColumns}}-->\n" +
    "        <div\n" +
    "            ng-repeat=\"component in row\"\n" +
    "            np-component\n" +
    "            idx=\"{{component.idx}}\" data-width=\"{{npColumn.columnWidth}}%\"\n" +
    "            ng-class=\"[ ( ($index+1) % npColumn.columns === 0 ) ? 'col-last' : '',\n" +
    "\t\t\t\t( $parent.$parent.$index+1 === npColumn.lastRow ) ? 'col-sm-{{npColumn.columnSpanLast}}' : 'col-sm-{{npColumn.columnSpan}}'\n" +
    "                                                                            ]\"\n" +
    "            class=\"column\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npContent/npContent.html',
    "<div class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npContentController as npContent\" ng-show=\"currentLang\">\n" +
    "\n" +
    "\t<div ng-if=\"currentLang\" class=\"np-cmp-main\">\n" +
    "\n" +
    "\t\t<div class=\"debug\">\n" +
    "\t\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "\t</div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npDragAndDropMatch/npDragAndDropMatch.html',
    "<div class=\"{{component.type}} npDragAndDropMatch\" ng-controller=\"npDragAndDropMatchController as npDragAndDropMatch\" id=\"{{npDragAndDropMatch.id}}\">\n" +
    "    <div id=\"draggableContainer\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"debug\">\n" +
    "                <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "            </div>\n" +
    "            <div id=\"draggableButtons\" class=\"col-xs-6\">\n" +
    "                <div drag-button ng-repeat=\"draggableButton in npDragAndDropMatch.draggableButtons\" data-reference=\"{{$index}}\"  id=\"id{{$index}}\" ng-click=\"npDragAndDropMatch.update(draggableButton)\" class=\"draggableButton box boxElements\">\n" +
    "                    <svg class=\"completeCheck\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                        <style type=\"text/css\">\n" +
    "                            <![CDATA[\n" +
    "                            .st0{fill:url(#SVGID_1_);}\n" +
    "                            .st1{display:inline;}\n" +
    "                            .st2{display:none;}\n" +
    "                            ]]>\n" +
    "                        </style>\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"400\" y2=\"200\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <rect fill=\"\" stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\"  x=\"0\" y=\"0\" width=\"99%\" height=\"99%\"/>\n" +
    "                        <foreignObject x=\"0%\" y=\"0\" width=\"100%\" height=\"100%\">\n" +
    "                            <div class=\"{{draggableButton.class}} button-content\">\n" +
    "                                <img class=\"draggableButtonImage\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                <div class=\"draggableButtonContent body-copy-strong\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                            </div>\n" +
    "                        </foreignObject>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--<div class=\"col-two\">-->\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div id=\"hitAreaWrapper\">                    \n" +
    "                    <div ng-repeat=\"draggableButton in npDragAndDropMatch.draggableButtons\" class=\"{{hitArea.class}} hit-area boxElements\">\n" +
    "                        <div class=\"hit-area-background\"></div>\n" +
    "                        <svg class=\"complete-background\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                            <g class=\"complete-background-Layer_1\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.5701\" y1=\"836.5667\" x2=\"474.7614\" y2=\"851.428\" gradientTransform=\"matrix(0.9984 5.588965e-02 -5.588965e-02 0.9984 48.0441 -25.572)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_2\">\n" +
    "                                <rect stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" fill=\"none\"  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_4\">\n" +
    "                                <foreignObject  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" >\n" +
    "\n" +
    "<!--                                    <div question-feedback-build class=\"row\">\n" +
    "                                        <div  class=\"col-sm-7 question-feedback\">\n" +
    "                                            <div class=\"question-feedback-wrapper vertical-centered\">\n" +
    "                                                <div class=\"positive-feedback-icon\">\n" +
    "                                                    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "                                                         width=\"139.535px\" height=\"139.536px\" viewBox=\"665.896 1118.26 139.535 139.536\"\n" +
    "                                                         enable-background=\"new 665.896 1118.26 139.535 139.536\" xml:space=\"preserve\">\n" +
    "                                                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.9971\" y1=\"-44.001\" x2=\"475.1884\" y2=\"-58.8622\" gradientTransform=\"matrix(6.1102 0.342 0.342 -6.1102 -2188.8755 702.1841)\">\n" +
    "                                                            <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                                            <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                                            <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                                            <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                                            <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                                            <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                                        </linearGradient>\n" +
    "                                                        <polygon fill=\"url(#SVGID_1_)\" points=\"784.624,1164.16 768.712,1150.084 722.812,1203.939 695.271,1180.684 681.195,1196.596  724.648,1233.316 \"/>\n" +
    "                                                        <path fill=\"#9A7D46\" d=\"M735.664,1257.796c-38.556,0-69.768-31.212-69.768-69.769c0-38.556,31.212-69.768,69.768-69.768  s69.768,31.212,69.768,69.768C805.432,1226.584,774.22,1257.796,735.664,1257.796z M735.664,1124.38  c-34.884,0-63.648,28.765-63.648,63.648s28.765,63.647,63.648,63.647s63.648-28.764,63.648-63.647S770.548,1124.38,735.664,1124.38z  \"/>\n" +
    "                                                    </svg>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"npQuestion-feedback body-copy question-feedback-text\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "                                                <div class=\"question-feedback-label\">Feedback area</div>\n" +
    "                                            </div\n" +
    "                                        </div>\n" +
    "                                        <div  class=\"col-sm-5\">\n" +
    "                                        </div>\n" +
    "                                    </div>-->\n" +
    "                                    <div class=\"button-content\">\n" +
    "                                        <img class=\"hitAreaImage\" ng-src=\"{{draggableButton.matchingImage}}\" alt=\"{{hitArea.alt}}\" />\n" +
    "                                        <div class=\"hitAreaContent body-copy\" ng-bind-html=\"draggableButton.matchingContent\" ></div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"button-completion-content vertical-centered\">\n" +
    "                                        <div class=\"row \" >\n" +
    "                                            <!--<div class=\" col-xs-2\" >-->\n" +
    "                                                <div class=\"positive-feedback-image\">\n" +
    "                                                <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "                                                     width=\"139.535px\" height=\"139.536px\" viewBox=\"665.896 1118.26 139.535 139.536\"\n" +
    "                                                     enable-background=\"new 665.896 1118.26 139.535 139.536\" xml:space=\"preserve\">\n" +
    "                                                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.9971\" y1=\"-44.001\" x2=\"475.1884\" y2=\"-58.8622\" gradientTransform=\"matrix(6.1102 0.342 0.342 -6.1102 -2188.8755 702.1841)\">\n" +
    "                                                        <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                                        <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                                        <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                                        <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                                        <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                                        <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                                    </linearGradient>\n" +
    "                                                    <polygon fill=\"url(#SVGID_1_)\" points=\"784.624,1164.16 768.712,1150.084 722.812,1203.939 695.271,1180.684 681.195,1196.596  724.648,1233.316 \"/>\n" +
    "                                                    <path fill=\"#9A7D46\" d=\"M735.664,1257.796c-38.556,0-69.768-31.212-69.768-69.769c0-38.556,31.212-69.768,69.768-69.768  s69.768,31.212,69.768,69.768C805.432,1226.584,774.22,1257.796,735.664,1257.796z M735.664,1124.38  c-34.884,0-63.648,28.765-63.648,63.648s28.765,63.647,63.648,63.647s63.648-28.764,63.648-63.647S770.548,1124.38,735.664,1124.38z  \"/>\n" +
    "                                                </svg>\n" +
    "                                            </div>\n" +
    "                                            <!--<div class=\"\" >-->\n" +
    "                                                <div class=\"positive-feedback-content body-copy \" ng-bind-html=\"positiveFeedback\"></div>\n" +
    "                                            <!--</div>-->\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </foreignObject>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div> \n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npDragAndDropPrioritize/npDragAndDropPrioritize.html',
    "<div class=\"{{component.type}} npDragAndDropPrioritize\" ng-controller=\"npDragAndDropPrioritizeController as npDragAndDropPrioritize\" id=\"{{npDragAndDropPrioritize.id}}\">\n" +
    "    <div id=\"draggableContainer\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"debug\">\n" +
    "                <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "            </div>\n" +
    "            <div id=\"draggableButtons\" class=\"col-xs-6\">\n" +
    "                <div drag-button-prioritize ng-repeat=\"draggableButton in npDragAndDropPrioritize.draggableButtons\" data-reference=\"{{$index}}\"  id=\"id{{$index}}\" ng-click=\"npDragAndDropPrioritize.update(draggableButton)\" class=\"draggableButton box boxElements\">\n" +
    "                    <svg class=\"completeCheck\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                        <style type=\"text/css\">\n" +
    "                            <![CDATA[\n" +
    "                            .st0{fill:url(#SVGID_1_);}\n" +
    "                            .st1{display:inline;}\n" +
    "                            .st2{display:none;}\n" +
    "                            ]]>\n" +
    "                        </style>\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"400\" y2=\"200\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <rect fill=\"\" stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\"  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                        <foreignObject x=\"0%\" y=\"0\" width=\"100%\" height=\"100%\">\n" +
    "                            <div class=\"{{draggableButton.class}} button-content\">\n" +
    "                                <img class=\"draggableButtonImage\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                <div class=\"draggableButtonContent\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                            </div>\n" +
    "                        </foreignObject>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div id=\"hitAreaWrapper\">                    \n" +
    "                    <div ng-repeat=\"draggableButton in npDragAndDropPrioritize.draggableButtons\" class=\"{{hitArea.class}} hit-area boxElements\">\n" +
    "                        <svg class=\"complete-background\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                            <g class=\"complete-background-Layer_1\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.5701\" y1=\"836.5667\" x2=\"474.7614\" y2=\"851.428\" gradientTransform=\"matrix(0.9984 5.588965e-02 -5.588965e-02 0.9984 48.0441 -25.572)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_2\">\n" +
    "                                <rect stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" fill=\"none\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_4\">\n" +
    "                                <foreignObject  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" >\n" +
    "                                    <div class=\"button-prioritize-content\">\n" +
    "                                        <div class=\"hit-area-prioritize-content hit-area-number\">{{$index + 1}}</div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"button-completion-prioritize-content\">\n" +
    "                                        <div class=\"centered-prioritize-content\" >\n" +
    "                                            <div class=\"positive-feedback-image \"></div>\n" +
    "                                            <div class=\"positive-feedback-content h4\" ng-bind-html=\"positiveFeedback\"></div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </foreignObject>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "                        <div class=\"hit-area-background\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div> \n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npDragAndDropSelect/npDragAndDropSelect.html',
    "<div class=\"{{component.type}} npDragAndDropSelect\" ng-controller=\"npDragAndDropSelectController as npDragAndDropSelect\" id=\"{{npDragAndDropSelect.id}}\">\n" +
    "    <div id=\"draggableContainer\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"debug\">\n" +
    "                <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "            </div>\n" +
    "            <div id=\"draggableButtons\" class=\"col-xs-6\">\n" +
    "                <div drag-button-select ng-repeat=\"draggableButton in npDragAndDropSelect.draggableButtons\" data-reference=\"{{$index}}\" id=\"id{{$index}}\" ng-click=\"npDragAndDropSelect.update(draggableButton)\" class=\"draggableButton box boxElements\">\n" +
    "                    <svg class=\"completeCheck\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                        <style type=\"text/css\">\n" +
    "                            <![CDATA[\n" +
    "                            .st0{fill:url(#SVGID_1_);}\n" +
    "                            .st1{display:inline;}\n" +
    "                            .st2{display:none;}\n" +
    "                            ]]>\n" +
    "                        </style>\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"400\" y2=\"200\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <rect fill=\"\" stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                        <foreignObject x=\"0%\" y=\"0\" width=\"100%\" height=\"100%\">\n" +
    "                            <div class=\"{{draggableButton.class}} button-content\">\n" +
    "                                <img class=\"draggableButtonImage\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                <div class=\"draggableButtonContent subhead-copy\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                            </div>\n" +
    "                        </foreignObject>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--<div class=\"col-two\">-->\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div id=\"hit-area-wrapper\">        \n" +
    "                    <div id=\"select-hit-area-background\"></div>            \n" +
    "                    <div ng-repeat=\"draggableButton in npDragAndDropSelect.draggableButtons\" data-match=\"{{draggableButton.select}}\" class=\"{{hitArea.class}} hit-area boxElements\">\n" +
    "                        <svg class=\"complete-background\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                            <g class=\"complete-background-Layer_1\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.5701\" y1=\"836.5667\" x2=\"474.7614\" y2=\"851.428\" gradientTransform=\"matrix(0.9984 5.588965e-02 -5.588965e-02 0.9984 48.0441 -25.572)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                    <defs>\n" +
    "                                    </defs>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_2\">\n" +
    "                                <rect stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" fill=\"none\"  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_4\">\n" +
    "                                <foreignObject  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" >\n" +
    "                                    <div class=\"select-button-completion-content\">\n" +
    "                                        <div class=\"row\" >\n" +
    "                                            <img class=\"feedback-draggable-button-image\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                            <div class=\"feedback-draggable-button-content body-copy\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </foreignObject>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div> \n" +
    "            <div np-drag-and-drop-select-evaluate class=\"row\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <div class=\"select-button-wrapper\">\n" +
    "                        <button class=\"btn-select-submit btn\" is-clickable=\"true\" ng-click=\"evaluate()\">\n" +
    "                            <span>SUBMIT</span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                    <div class=\"select-response-wrapper\">\n" +
    "                        <div class=\"select-response-correct row\">\n" +
    "                            <div class=\"select-response-background\"></div>\n" +
    "                            <div class=\"col-xs-1 left-column-select\">              \n" +
    "                                <div class=\"response-icon-wrapper\">             \n" +
    "                                    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"58.368 58.368 22.8 22.801\" enable-background=\"new 58.368 58.368 22.8 22.801\" xml:space=\"preserve\">\n" +
    "                                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"425.3076\" y1=\"46.0552\" x2=\"423.378\" y2=\"48.4836\" gradientTransform=\"matrix(6.1102 0.342 -0.342 6.1102 -2507.3147 -365.3418)\">\n" +
    "                                            <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                            <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                            <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                            <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                            <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                            <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                        </linearGradient>\n" +
    "                                        <polygon fill=\"url(#SVGID_1_)\" points=\"77.768,65.868 75.168,63.568 67.667,72.369 63.167,68.568 60.867,71.168 67.968,77.168 \"/>\n" +
    "                                        <path fill=\"#9A7D46\" d=\"M69.768,81.168c-6.3,0-11.4-5.1-11.4-11.4c0-6.3,5.1-11.4,11.4-11.4s11.4,5.101,11.4,11.4 C81.168,76.069,76.067,81.168,69.768,81.168z M69.768,59.368c-5.7,0-10.4,4.7-10.4,10.4c0,5.7,4.7,10.4,10.4,10.4  c5.7,0,10.4-4.7,10.4-10.4C80.168,64.068,75.468,59.368,69.768,59.368z\"/>\n" +
    "                                    </svg>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-11 right-column-select body-copy\" ng-bind-html=\"npDragAndDropSelect.positiveFeedback\" >\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"select-response-incorrect row\">\n" +
    "                            <div class=\"select-response-background\"></div>\n" +
    "                            <div class=\"col-xs-1 left-column-select\">\n" +
    "                                <div class=\"response-icon-wrapper\">\n" +
    "                                    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"0 0 22.8 22.801\" style=\"enable-background:new 0 0 22.8 22.801;\" xml:space=\"preserve\">\n" +
    "                                        <path style=\"fill:#9A7D46;\" d=\"M11.4,22.801C5.101,22.801,0,17.7,0,11.4S5.101,0,11.4,0S22.8,5.101,22.8,11.4  S17.7,22.801,11.4,22.801z M11.4,1C5.7,1,1,5.7,1,11.4s4.7,10.4,10.4,10.4S21.8,17.101,21.8,11.4S17.101,1,11.4,1z\"/>\n" +
    "                                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"274.4922\" y1=\"-249.2896\" x2=\"261.4488\" y2=\"-262.713\" gradientTransform=\"matrix(1 0 0 -1 -256 -245)\">\n" +
    "                                            <stop  offset=\"0.1642\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                            <stop  offset=\"0.1698\" style=\"stop-color:#CCA352\"/>\n" +
    "                                            <stop  offset=\"0.2532\" style=\"stop-color:#E4C682\"/>\n" +
    "                                            <stop  offset=\"0.3167\" style=\"stop-color:#F2DCA0\"/>\n" +
    "                                            <stop  offset=\"0.3527\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                                            <stop  offset=\"0.4062\" style=\"stop-color:#EBD191\"/>\n" +
    "                                            <stop  offset=\"0.48\" style=\"stop-color:#DDBC74\"/>\n" +
    "                                            <stop  offset=\"0.5532\" style=\"stop-color:#D2AC5F\"/>\n" +
    "                                            <stop  offset=\"0.6249\" style=\"stop-color:#CCA352\"/>\n" +
    "                                            <stop  offset=\"0.6933\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                            <stop  offset=\"0.7957\" style=\"stop-color:#D5B05B\"/>\n" +
    "                                            <stop  offset=\"0.9955\" style=\"stop-color:#F2DA7E\"/>\n" +
    "                                            <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                        </linearGradient>\n" +
    "                                        <polygon style=\"fill:url(#SVGID_1_);\" points=\"6,19.4 11.4,14.101 16.7,19.4 19.2,16.9 13.9,11.601 19.2,6.301 16.7,3.7 11.4,9 6.101,3.7 3.601,6.301 8.9,11.601 3.5,16.9 \"/>\n" +
    "                                    </svg>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-xs-11 right-column-select body-copy\" ng-bind-html=\"npDragAndDropSelect.negativeFeedback\" >\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npFeature/npFeature.html',
    "<div new-player-page-top class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npFeatureController as npFeature\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npFlashCards/npFlashCards.html',
    "<div np-flash-cards id=\"{{npFlashCards.id}} \" class=\"{{component.type}} np-cmp-wrapper np-flash-card\" ng-controller=\"npFlashCardsController as npFlashCards\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- \n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <!--::::::::::::  flash-card  ::::::::::::::::-->\n" +
    "    <div id=\"flash-cards\" class=\"row\">\n" +
    "        <div np-swipe-angular-draggable  class=\"col-sm-12\">\n" +
    "            <div id=\"flash-cards-swipe-container\">\n" +
    "                <div flash-card class=\"flash-cards-object \" ng-repeat=\"flashCardComponent in npFlashCards.flashCardComponents\">\n" +
    "                    <div class=\"flash-card-front-wrapper\">\n" +
    "                        <div class=\"flash-card-background\"></div>\n" +
    "                        <p class=\"body-copy flash-card-content-front\" ng-bind-html=\"flashCardComponent.contentFront\"></p>\n" +
    "                        <div class=\"flash-card-border\"></div>\n" +
    "                        <div class=\"flash-card-overlay\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"flash-card-back-wrapper\">\n" +
    "                        <div class=\"flash-card-background\"></div>\n" +
    "                        <p class=\"flash-card-content-back\" ng-bind-html=\"flashCardComponent.contentBack\"></p>\n" +
    "                    </div>\n" +
    "                    <div class=\"flash-card-button\" ng-click=\"npFlashCards.update(flashCardComponent)\">\n" +
    "                        <svg version=\"1.0\"  class='button-holder' xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"25px\" height=\"19.7px\" viewBox=\"343.2 692.6 25 19.7\" xml:space=\"preserve\">\n" +
    "                            <g id=\"refresh-icon\">\n" +
    "                                <path id=\"refresh-icon-shape\" d=\"M362.8,695.6l-2.3,2.301c-1.2-1.2-2.9-2-4.8-2c-3.8,0-6.8,3.1-6.8,6.8l0,0h2.699  l-4.199,4.2l-4.2-4.2h2.6l0,0c0-5.601,4.5-10.101,10.101-10.101C358.4,692.6,360.9,693.7,362.8,695.6z M368.2,702.3l-4.2-4.2  l-4.2,4.2h2.7l0,0c0,3.8-3.1,6.8-6.8,6.8c-1.9,0-3.601-0.8-4.8-2L348.6,709.4c1.801,1.8,4.301,2.899,7.101,2.899  c5.6,0,10.1-4.5,10.1-10.1l0,0h2.4V702.3z\"/>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div> \n" +
    "    </div> \n" +
    "</div> \n" +
    "<!--::::::::::::  flash-card  ::::::::::::::::-->\n" +
    "<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>"
  );


  $templateCache.put('scripts/component/npFooter/npFooter.html',
    "<footer class=\"np-cmp-wrapper {{component.type}} navbar navbar-inverse navbar-fixed-bottom\" ng-controller=\"npFooterController as npFooter\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"debug\">\n" +
    "            <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "        </div>\n" +
    "\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "</footer>\n"
  );


  $templateCache.put('scripts/component/npHTML/npHTML.html',
    "<section class=\"{{component.type}} np-cmp-wrapper\" ng-controller=\"npHTMLController as npHTML\">\n" +
    "  <div class=\"debug\">\n" +
    "    <h3>{{component.type}} --\n" +
    "      <small>{{component.idx}}</small>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "  <div class=\"np-cmp-main\" ng-if=\"!!npHTML.link\">\n" +
    "    <a ng-click=\"npHTML.handleLink(); $event.stopPropagation();\" ng-bind-html=\"npHTML.content\"></a>\n" +
    "  </div>\n" +
    "  <div ng-bind-html=\"npHTML.content\" class=\"np-cmp-main\" ng-if=\"!npHTML.link\"></div>\n" +
    "  <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</section>\n"
  );


  $templateCache.put('scripts/component/npHeader/npHeader.html',
    "<!--I once read in a comment that 'smart developers read comments', so go ahead and pat yourself on the back.-->\n" +
    "\n" +
    "<header class=\"np-cmp-wrapper {{component.type}} navbar navbar-default navbar-fixed-top navbar-inverse\" ng-controller=\"npHeaderController as npHeader\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"debug\">\n" +
    "            <h2>{{component.type}} -- <small>{{component.idx}}</small></h2>\n" +
    "        </div>\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "</header>\n"
  );


  $templateCache.put('scripts/component/npHotspot/npHotspot.html',
    "<div class=\"{{component.type}} npHotspot\" ng-controller=\"npHotspotController as npHotspot\" id=\"{{npHotspot.id}}\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-7 \">\n" +
    "            <div class=\"hotspotImage\">\n" +
    "                <div class=\"debug\">\n" +
    "                    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "                </div>\n" +
    "                <img class=\"{{component.type}} np-cmp-main img-responsive\" ng-controller=\"npHotspotController as npHotspot\" ng-src=\"{{npHotspot.src}}\" alt=\"{{npHotspot.alt}}\" />\n" +
    "                <div hotspot-button-build ng-repeat=\"hotspotButton in npHotspot.hotspotButtons\">\n" +
    "                    <div class=\"{{hotspotButton.class}} hotspotButton\" ng-click=\"npHotspot.update(hotspotButton)\">\n" +
    "                        <!--<img class=\"hotspotButtonImage\" ng-src=\"{{hotspotButton.image}}\" alt=\"{{npHotspot.alt}}\" />-->\n" +
    "                        <div class=\"hotspotButtonImage\" ></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-5\">\n" +
    "            <div class=\"content-area\">\n" +
    "                <div class=\"content-background\">\n" +
    "                    <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                        <style type=\"text/css\">\n" +
    "                            <![CDATA[\n" +
    "                            .st0{fill:url(#SVGID_1_);}\n" +
    "                            .st1{display:inline;}\n" +
    "                            .st2{display:none;}\n" +
    "                            ]]>\n" +
    "                        </style>\n" +
    "                        <g id=\"Layer_2\">\n" +
    "                            <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                                <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                                <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                                <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                                <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                            </linearGradient>\n" +
    "                            <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"3\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                        </g>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "                <div class=\"npHotspot-feedback body-copy\" ng-bind-html=\"npHotspot.feedback\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>"
  );


  $templateCache.put('scripts/component/npImage/npImage.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "\n" +
    "<img\n" +
    "    class=\"{{component.type}} np-cmp-main img-responsive\"\n" +
    "    ng-controller=\"npImageController\n" +
    "                as npImage\"\n" +
    "    ng-src=\"{{npImage.src}}\"\n" +
    "    alt=\"{{npImage.alt}}\" \n" +
    "    />\n" +
    "\n" +
    "<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>"
  );


  $templateCache.put('scripts/component/npList/npList.html',
    "\n" +
    "<div class=\"{{component.type}} np-cmp-wrapper\" ng-controller=\"npListController as npList\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} --\n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <div class=\"row media list-row\">\n" +
    "        <div class=\"column-1 col-md-4\">\n" +
    "            <div class=\"media-left media-middle\">\n" +
    "                <div np-component class=\"media-object list-object\" ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"column-2 col-md-8\">\n" +
    "            <div class=\"media-body\">\n" +
    "                <div ng-bind-html=\"npList.heading\" class=\"media-heading subhead-copy\"></div>\n" +
    "                <div ng-bind-html=\"npList.content\" class=\"np-cmp-main body-copy\" ng-if=\"!npList.link\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npMatch/npMatch.html',
    "<section id=\"np_matchgame\" class=\"col-xs-12\"> \n" +
    "    <form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npMatchController as npMatch\" ng-submit=\"npMatch.evaluate()\">\n" +
    "        <div class=\"debug\">\n" +
    "            <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "        </div>\n" +
    "        <!--<h5 class=\"text-uppercase\">question:</h5>-->\n" +
    "        <div class=\"npMatch-content\" ng-bind-html=\"npMatch.content\"></div>\n" +
    "        <!--<h5 class=\"text-uppercase\">answers:</h5>-->\n" +
    "        <div np-component ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <button type=\"submit\" class=\"col-xs-offset-6 btn-primary\">Submit</button>        \n" +
    "            <button id=\"next_button\" class=\"btn-default\" ng-click=\"npMatch.nextPage($event)\" ng-show=\"npMatch.canContinue\">Next</button>\n" +
    "        </div>\n" +
    "    <!--    <div class=\"btn btn-default\">\n" +
    "            <input type=\"submit\" />\n" +
    "        </div>-->\n" +
    "        <!-- <div class=\"npMatch-feedback question-feedback col-xs-offset-5\" ng-bind-html=\"npMatch.feedback\"></div> -->\n" +
    "        <div question-feedback-build class=\"row\">\n" +
    "            <div  class=\"col-xs-12 col-md-4 col-md-offset-4 question-feedback\">\n" +
    "                <div class=\"question-feedback-wrapper\">\n" +
    "                    <div class=\"negative-feedback-icon\" ng-class=\"{'bad-feedback' : npMatch.feedbackBad}\">\n" +
    "                        <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"599.8 837.1 22.8 22.801\" enable-background=\"new 599.8 837.1 22.8 22.801\" xml:space=\"preserve\">\n" +
    "                            <path fill=\"#9A7D46\" d=\"M611.2,859.9c-6.3,0-11.4-5.101-11.4-11.4s5.101-11.4,11.4-11.4S622.6,842.2,622.6,848.5 S617.5,859.9,611.2,859.9z M611.2,838.1c-5.7,0-10.4,4.7-10.4,10.4s4.7,10.4,10.4,10.4s10.399-4.7,10.399-10.4 S616.9,838.1,611.2,838.1z\"/>\n" +
    "                            <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"874.293\" y1=\"-1086.3877\" x2=\"861.2496\" y2=\"-1099.811\" gradientTransform=\"matrix(1 0 0 -1 -256 -245)\">\n" +
    "                                <stop  offset=\"0.1642\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                <stop  offset=\"0.1698\" style=\"stop-color:#CCA352\"/>\n" +
    "                                <stop  offset=\"0.2532\" style=\"stop-color:#E4C682\"/>\n" +
    "                                <stop  offset=\"0.3167\" style=\"stop-color:#F2DCA0\"/>\n" +
    "                                <stop  offset=\"0.3527\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                                <stop  offset=\"0.4062\" style=\"stop-color:#EBD191\"/>\n" +
    "                                <stop  offset=\"0.48\" style=\"stop-color:#DDBC74\"/>\n" +
    "                                <stop  offset=\"0.5532\" style=\"stop-color:#D2AC5F\"/>\n" +
    "                                <stop  offset=\"0.6249\" style=\"stop-color:#CCA352\"/>\n" +
    "                                <stop  offset=\"0.6933\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                <stop  offset=\"0.7957\" style=\"stop-color:#D5B05B\"/>\n" +
    "                                <stop  offset=\"0.9955\" style=\"stop-color:#F2DA7E\"/>\n" +
    "                                <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                            </linearGradient>\n" +
    "                            <polygon fill=\"url(#SVGID_1_)\" points=\"605.8,856.5 611.2,851.2 616.5,856.5 619,854 613.7,848.7 619,843.4 616.5,840.8 611.2,846.1 605.9,840.8 603.4,843.4 608.7,848.7 603.3,854 \"/>\n" +
    "                        </svg>\n" +
    "                    </div>\n" +
    "                    <div class=\"question-feedback-label\" ng-bind-html=\"npMatch.feedback\">Feedback area</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</section>"
  );


  $templateCache.put('scripts/component/npMatchRow/npMatchRow.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"np-cmp-wrapper {{component.type}} rsDefault visibleNearby\" royalslider data-match=\"true\">\n" +
    "    <div np-component ng-repeat=\"component in components | orderBy:random\" idx=\"{{component.idx}}\"  class=\"matching-game-row\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npMenu/npMenu.html',
    "<nav class=\"np-cmp-wrapper {{component.type}}\" ng-class=\"menuStatus\" ng-controller=\"npMenuController as npMenu\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<a class=\"hamburger fa fa-bars\" ng-click=\"menuStatus=(menuStatus==='show')?'':'show'\"></a>\n" +
    "\t<ul class=\"np-cmp-main\">\n" +
    "\t\t<li ng-repeat=\"child in npMenu.items\">\n" +
    "\t\t\t<span np-menu menuitem=\"child\"></span>\n" +
    "\t\t</li>\n" +
    "\t</ul>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</nav>\n"
  );


  $templateCache.put('scripts/component/npPage/npPage.html',
    "<div class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npPageController as npPage\" ng-show=\"currentPage\">\n" +
    "    <main ng-if=\"currentPage\" class=\"np-cmp-main\">\n" +
    "        <div class=\"debug\">\n" +
    "            <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "        </div>\n" +
    "        <div ng-bind-html=\"npPage.title\" class=\"npPage-title h3\">{{npPage.title}}</div>\n" +
    "        <div ng-bind-html=\"npPage.subTitle\" class=\"npPage-subTitle h4\">{{npPage.subTitle}}</div>\n" +
    "        <div ng-bind-html=\"npPage.instructional\" class=\"npPage-instructional\">{{npPage.instructional}}</div>\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </main>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npQuestion/npQuestion.html',
    "<div class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">\n" +
    "    <!--<form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">-->\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <p class=\"h5 quiz-label\">question:</p>\n" +
    "    <div class=\"npQuestion-content question-text h4\" ng-bind-html=\"npQuestion.content\"></div>\n" +
    "    <p class=\"h5 quiz-label\">answers:</p>\n" +
    "    <div np-component class=\"response-item\" ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-6 question-submit-wrapper\">\n" +
    "            <button type=\"submit\" class=\"btn-submit btn\" ng-click=\"npQuestion.evaluate()\">\n" +
    "                <span>Submit</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "            <div question-feedback-build >\n" +
    "                <div  class=\"question-feedback\">\n" +
    "                    <div class=\"question-feedback-wrapper vertical-centered\">\n" +
    "                        <div class=\"positive-feedback-icon\">\n" +
    "                            <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n" +
    "                                 width=\"139.535px\" height=\"139.536px\" viewBox=\"665.896 1118.26 139.535 139.536\"\n" +
    "                                 enable-background=\"new 665.896 1118.26 139.535 139.536\" xml:space=\"preserve\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.9971\" y1=\"-44.001\" x2=\"475.1884\" y2=\"-58.8622\" gradientTransform=\"matrix(6.1102 0.342 0.342 -6.1102 -2188.8755 702.1841)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                </linearGradient>\n" +
    "                                <polygon fill=\"url(#SVGID_1_)\" points=\"784.624,1164.16 768.712,1150.084 722.812,1203.939 695.271,1180.684 681.195,1196.596  724.648,1233.316 \"/>\n" +
    "                                <path fill=\"#9A7D46\" d=\"M735.664,1257.796c-38.556,0-69.768-31.212-69.768-69.769c0-38.556,31.212-69.768,69.768-69.768  s69.768,31.212,69.768,69.768C805.432,1226.584,774.22,1257.796,735.664,1257.796z M735.664,1124.38  c-34.884,0-63.648,28.765-63.648,63.648s28.765,63.647,63.648,63.647s63.648-28.764,63.648-63.647S770.548,1124.38,735.664,1124.38z  \"/>\n" +
    "                            </svg>\n" +
    "                        </div>\n" +
    "                        <div class=\"negative-feedback-icon\">\n" +
    "                            <svg version=\"1.0\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"22.8px\" height=\"22.801px\" viewBox=\"599.8 837.1 22.8 22.801\" enable-background=\"new 599.8 837.1 22.8 22.801\" xml:space=\"preserve\">\n" +
    "                                <path fill=\"#9A7D46\" d=\"M611.2,859.9c-6.3,0-11.4-5.101-11.4-11.4s5.101-11.4,11.4-11.4S622.6,842.2,622.6,848.5 S617.5,859.9,611.2,859.9z M611.2,838.1c-5.7,0-10.4,4.7-10.4,10.4s4.7,10.4,10.4,10.4s10.399-4.7,10.399-10.4 S616.9,838.1,611.2,838.1z\"/>\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"874.293\" y1=\"-1086.3877\" x2=\"861.2496\" y2=\"-1099.811\" gradientTransform=\"matrix(1 0 0 -1 -256 -245)\">\n" +
    "                                    <stop  offset=\"0.1642\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.1698\" style=\"stop-color:#CCA352\"/>\n" +
    "                                    <stop  offset=\"0.2532\" style=\"stop-color:#E4C682\"/>\n" +
    "                                    <stop  offset=\"0.3167\" style=\"stop-color:#F2DCA0\"/>\n" +
    "                                    <stop  offset=\"0.3527\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                                    <stop  offset=\"0.4062\" style=\"stop-color:#EBD191\"/>\n" +
    "                                    <stop  offset=\"0.48\" style=\"stop-color:#DDBC74\"/>\n" +
    "                                    <stop  offset=\"0.5532\" style=\"stop-color:#D2AC5F\"/>\n" +
    "                                    <stop  offset=\"0.6249\" style=\"stop-color:#CCA352\"/>\n" +
    "                                    <stop  offset=\"0.6933\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.7957\" style=\"stop-color:#D5B05B\"/>\n" +
    "                                    <stop  offset=\"0.9955\" style=\"stop-color:#F2DA7E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                </linearGradient>\n" +
    "                                <polygon fill=\"url(#SVGID_1_)\" points=\"605.8,856.5 611.2,851.2 616.5,856.5 619,854 613.7,848.7 619,843.4 616.5,840.8 611.2,846.1 605.9,840.8 603.4,843.4 608.7,848.7 603.3,854 \"/>\n" +
    "                            </svg>\n" +
    "                        </div>\n" +
    "                        <div class=\"npQuestion-feedback body-copy question-feedback-text\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "                        <div class=\"question-feedback-label\">Feedback area</div>\n" +
    "                    </div\n" +
    "                </div\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-6\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npQuiz/npQuiz.html',
    "<form class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npQuizController as npQuiz\"\n" +
    "      ng-submit=\"npQuiz.evaluate()\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} --\n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"npQuiz-content h4\" ng-bind-html=\"npQuiz.content\"></div>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "    <div class=\"npQuiz-feedback\" ng-if=\"npQuiz.feedback\" ng-bind-html=\"npQuiz.feedback\"></div>\n" +
    "</form>"
  );


  $templateCache.put('scripts/component/npReveal/npReveal.html',
    "<div npReveal np-reveal-build id=\"{{npReveal.id}}\" class=\"{{component.type}} np-cmp-wrapper np-reveal\" ng-controller=\"npRevealController as npReveal\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- \n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <!--:::::::::::: buttons ::::::::::::::::--> \n" +
    "    <div class=\"reveal-navigation col-md-12\">\n" +
    "        <div class=\" reveal-button-container center-block\">\n" +
    "            <div revealButton class=\"reveal-button\" ng-repeat=\"revealItem in npReveal.revealItems\" ng-click=\"npReveal.update(revealItem)\">\n" +
    "                <div class=\"reveal-button-wrap\">\n" +
    "                    <img class=\"reveal-button-image img-responsive\" ng-src=\"{{revealItem.buttonImage}}\" alt=\"{{revealItem.buttonAlt}}\" />\n" +
    "                </div>\n" +
    "                <div class=\"button-screen\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--:::::::::::: buttons ::::::::::::::::-->\n" +
    "\n" +
    "    <!--::::::::::::  reveal  ::::::::::::::::-->\n" +
    "    <div class=\"col-md-12 reveal-objects-wrapper\">\n" +
    "        <div class=\"reveal-object\" ng-repeat=\"revealItemComponent in npReveal.revealItemComponents\">\n" +
    "            <div class=\"reveal-wrapper\">\n" +
    "                <div class=\"reveal-item-wrapper\">\n" +
    "                    <img ng-if=\"revealItemComponent.components[0].type == 'npImage'\" class=\"reveal-item reveal-image img-responsive\" ng-src=\"{{revealItemComponent.components[0].data.src}}\" alt=\"{{component.alt}}\" />\n" +
    "                    <video controls ng-if=\"revealItemComponent.components[0].type == 'npVideo'\" class=\"reveal-item reveal-video\" poster=\"{{revealItemComponent.components[0].data.poster}}\">\n" +
    "                        <source ng-src=\"{{revealItemComponent.components[0].data.baseURL+'.mp4'}}\"/>\n" +
    "                    </video>\n" +
    "                </div>\n" +
    "                <div class=\"reveal-content-wrapper\">\n" +
    "                    <div class=\"reveal-background\"></div>\n" +
    "                    <div class=\"reveal-content-text\">\n" +
    "                        <p class=\"subhead-copy\" ng-bind-html=\"revealItemComponent.heading\"></p>\n" +
    "                        <p class=\"body-copy reveal-text-body\" ng-bind-html=\"revealItemComponent.content\"></p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div> \n" +
    "    </div> \n" +
    "    <!--::::::::::::  reveal  ::::::::::::::::-->\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npTrivia/npTrivia.html',
    "<form class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npTriviaController as npTrivia\" ng-submit=\"npTrivia.evaluate()\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <!--    <div class=\"row\">\n" +
    "            <div class=\"npTrivia-content h4 col-xs-12\" ng-bind-html=\"npTrivia.content\"></div>\n" +
    "        </div>-->\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-2 np-spinner\">\n" +
    "            <div class=\"np-spinner-wrapper\">\n" +
    "                <np-price-is-right-spinner class=\"np-spinner\" spinTime=\"2000\" ng-hide=\"!npTrivia.pageId\" data-difficulty=\"{{npTrivia.difficulty}}\">\n" +
    "                    <div>0</div>\n" +
    "                    <div>100</div>\n" +
    "                    <div>200</div>\n" +
    "                    <div>300</div>\n" +
    "                    <div>400</div>\n" +
    "                    <div>500</div>\n" +
    "                    <div>600</div>\n" +
    "                    <div>700</div>\n" +
    "                    <div>800</div>\n" +
    "                    <div>0</div>\n" +
    "                    <div>100</div>\n" +
    "                    <div>200</div>\n" +
    "                    <div>300</div>\n" +
    "                    <div>400</div>\n" +
    "                    <div>500</div>\n" +
    "                    <div>600</div>\n" +
    "                    <div>700</div>\n" +
    "                    <div>800</div>\n" +
    "                    <div>900</div>\n" +
    "                    <div>1000</div>\n" +
    "                </np-price-is-right-spinner>\n" +
    "                <div class=\"np-gold-border\">\n" +
    "                    <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 368 222\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                    <style type=\"text/css\">\n" +
    "                        <![CDATA[\n" +
    "                        .st0{fill:url(#SVGID_1_);}\n" +
    "                        .st1{display:inline;}\n" +
    "                        .st2{display:none;}\n" +
    "                        ]]>\n" +
    "                    </style>\n" +
    "                    <g id=\"Layer_2\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                    <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                    <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                    <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                    <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <rect fill=\"url(#MyGradient)\" stroke=\"url(#SVGID_1_)\" vector-effect=\"non-scaling-stroke\" stroke-width=\"3\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                    </g>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "                <div class=\"np-gold-pointer h1\">\n" +
    "                    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"66.096px\" height=\"126.685px\" viewBox=\"308.824 1129.275 66.096 126.685\" style=\"enable-background:new 308.824 1129.275 66.096 126.685;\" xml:space=\"preserve\">\n" +
    "                    <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"118.5967\" y1=\"-46.6729\" x2=\"105.6811\" y2=\"-62.1192\" gradientTransform=\"matrix(6.12 0 0 -6.12 -324.0952 866.6157)\">\n" +
    "                    <stop  offset=\"0.2306\" style=\"stop-color:#CAA04E\"/>\n" +
    "                    <stop  offset=\"0.3901\" style=\"stop-color:#F8E4AB\"/>\n" +
    "                    <stop  offset=\"0.4768\" style=\"stop-color:#E1C27C\"/>\n" +
    "                    <stop  offset=\"0.5692\" style=\"stop-color:#CAA04E\"/>\n" +
    "                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                    </linearGradient>\n" +
    "                    <polygon style=\"fill:url(#SVGID_1_);\" points=\"374.92,1129.275 374.92,1255.96 308.824,1191.7 \"/>\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!--<div class=\"col-xs-10 np_row\" np-component ng-if=\"subCmp\" ng-repeat=\"component in npTrivia.seenComponents\" idx=\"{{component.idx}}\" ng-hide=\"npTrivia.pageId !== component.data.id\"></div>-->\n" +
    "        <div class=\"col-xs-10 np_row\">\n" +
    "            <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "            <div class=\"npTrivia-feedback\" ng-if=\"npTrivia.feedback\" ng-bind-html=\"npTrivia.feedback\"></div>\n" +
    "        </div> \n" +
    "    </div>\n" +
    "</form>\n"
  );


  $templateCache.put('scripts/component/npVideo/npVideo.html',
    "<np-video component=\"component\" class=\"{{component.type}}\" id=\"{{component.data.id}}\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} --\n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <video\n" +
    "        height=\"{{component.data.height}}\"\n" +
    "        width=\"{{component.data.width}}\"\n" +
    "        poster=\"{{component.data.poster}}\"\n" +
    "        preload=\"{{component.data.preload}}\"\n" +
    "        ng-src=\"{{component.data.src}}\"\n" +
    "        controls=\"controls\" mediaelelement>\n" +
    "        <source ng-repeat=\"source in npVideo.sources\" type=\"video/{{source.type}}\" ng-src=\"{{source.src}}\" />\n" +
    "        <object width=\"{{component.data.width}}\" height=\"{{component.data.height}}\" type=\"application/x-shockwave-flash\" data=\"scripts/component/npVideo/mediaelement/flashmediaelement.swf\">\n" +
    "            <param name=\"movie\" value=\"scripts/component/npVideo/mediaelement/flashmediaelement.swf\"/>\n" +
    "            <param name=\"flashvars\" value=\"controls=true&file={{component.data.baseURL}}.mp4\"/>\n" +
    "            <param name=\"allowfullscreen\" value=\"false\"/>\n" +
    "        </object>\n" +
    "    </video>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</np-video>\n"
  );


  $templateCache.put('scripts/manifest/init.html',
    "<div id=\"manifestWrapper\" class=\"xdebug\">\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    Manifest - init - {{vm.manifestId}}.json\n" +
    "  </div>\n" +
    "\n" +
    "  <div ui-view=\"load\" autoscroll='true'>\n" +
    "    Manifest - initializing.\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/manifest/load.html',
    "<div>\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    Manifest - load - {{vm.manifestId}}.json\n" +
    "  </div>\n" +
    "\n" +
    "  <div ui-view=\"manifest\" autoscroll='true'>\n" +
    "    <div class=\"preloader\">\n" +
    "      <i class=\"fa fa-refresh fa-spin\"></i>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/manifest/manifest.html',
    "<h1 class=\"debug\">Manifest</h1>\n" +
    "\n" +
    "<!--\n" +
    "<dl>\n" +
    "\t<dt>manifestID</dt>\n" +
    "\t<dd>{{vm.manifestId}}</dd>\n" +
    "\n" +
    "\t<dt>language</dt>\n" +
    "\t<dd>{{vm.lang}}</dd>\n" +
    "\n" +
    "\t<dt>pageId</dt>\n" +
    "\t<dd>{{vm.pageId}}</dd>\n" +
    "</dl>\n" +
    "-->\n" +
    "\n" +
    "<div np-component class=\"manifest\">\n" +
    "  <div class=\"debug\">Here's the root component:</div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"tpl-content\" ng-include src=\"load.html\"></div>\n" +
    "\n"
  );


  $templateCache.put('scripts/manifest/page.html',
    "<h1>Manifest - page</h1>\n" +
    "\n" +
    "<dl>\n" +
    "  <dt>manifestID</dt>\n" +
    "  <dd>{{vm.manifestId}}</dd>\n" +
    "\n" +
    "  <dt>language</dt>\n" +
    "  <dd>{{vm.lang}}</dd>\n" +
    "\n" +
    "  <dt>pageId</dt>\n" +
    "  <dd>{{vm.pageId}}</dd>\n" +
    "</dl>\n"
  );

}]);
