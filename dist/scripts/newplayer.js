(function() {
  'use strict';

  angular.module('newplayer.service', []);
})();

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

(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .factory('ManifestService', ManifestService);

  /*
   * console:
   * angular.element(document.body).injector().get('ManifestService')
   */

  /** @ngInject */
  function ManifestService($log, $rootScope /*, $timeout, $http, $q */) {
    $log.debug('\nManifestService::Init\n');

    var Service = function () {
      var self = this;
      var manifestInitialized = false;
      var data;
      var overrides;

      var componentIdx;
      // if these are not defined by the route
      // the manifest components will teach this service
      // what the values should be
      var lang;
      var pageId;

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
        if (typeof( idx ) === 'string') {
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
        angular.forEach
        (
          arguments,
          function (obj) {
            if (obj !== dst) {
              angular.forEach
              (
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
          if( !!localOverrides ) {
            newData = localOverrides[builderId];
          }

          if (!!builderId && !!newData) {
            // TBD - improve data sanitization
            if (angular.isString(newData)) {
              newData = newData.replace(/\n/g, ' ');
            }
            // found override for this component!
            $log.debug('ManifestService::initializeComponent: override builderId:', builderId, newData);
            if (typeof( newData ) === 'string') {
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
                    $log.debug('ManifestService::initializeComponent: override: did not know what to do with builderId:', builderId, newData, e);
                  }
                  break;
              }
            }
            if (typeof( newData ) === 'object') {
              $log.debug('ManifestService::initializeComponent: override: extend:', cmp.data, newData);
              extendDeep(cmp.data, newData);
            }
          }
        }

        // will we ever re-index after manifest initialization!?
        // index component
        cmp.idx = getComponentIdx().slice(0);
        $log.debug('ManifestService::initializeComponent: initialized:', cmp.idx, cmp);
      }

      /*
       * Gets the component from the manifest specified by the idx array
       * if no idx is specified, use the service's idx
       */
      this.getComponent = function (idx) {
        var cmp;
        if (!idx) {
          // idx not specified, get next using services idx
          $log.debug('ManifestService::getComponent: getNextComponent');
          cmp = getNextComponent();

          // initialize the component
          initializeComponent(cmp);
        } else {

          idx = deserializeIdx(idx);
          setComponentIdx(idx);
          $log.debug('ManifestService::getComponent: find component:', idx);

          // traverse idx array to retrieve this particular cmp
          cmp = getData()[idx[0]];
          if (!!cmp) {
            for (var j in idx) {
              if (j > 0) {
                var components = cmp.components;
                if (!!components) {
                  cmp = components[idx[j]];
                  if (!cmp) {
                    // child idx out of range
                    return null;
                  }
                } else {
                  // no children
                  return null;
                }
              }
            }
          } else {
            // root index out of range
            return null;
          }
          $log.debug('ManifestService::getComponent: found:', idx, cmp);
        }
        return cmp;
      };

      /*
       * Searches for the first occurance of the specified component
       * @param {string} cmpType Component type to search for
       * @param {(string|int[])=} context Context in which to do the search
       * @returns {Component}
       */
      this.getFirst = function (cmpType, context) {
        if (!context) {
          context = [0];
        } else {
          context = deserializeIdx(context);
        }

        $log.debug('ManifestService::getFirst', cmpType, context);
        var cmp = self.getComponent(context);
        while (!!cmp && cmp.type !== cmpType) {
          cmp = getNextComponent();

          // don't search out of context - exclude siblings & parents
          if (!!getComponentIdx() &&
            ( getComponentIdx().length < context.length ||
            getComponentIdx()[context.length - 1] !== context[context.length - 1] )) {
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
      this.getAll = function (cmpType, context) {
        $log.debug('ManifestService::getAll:initialContext', context);
        if (!context) {
          context = [0];
        } else {
          context = deserializeIdx(context);
        }
        var cmps = [];

        $log.debug('ManifestService::getAll', cmpType, context);
        var cmp = self.getComponent(context);
        while (!!cmp) {
          $log.debug('ManifestService::getAll:match?', cmp.type, cmpType);
          if (cmp.type === cmpType) {
            cmps.push(cmp);
            $log.debug('ManifestService::getAll:match!', cmps);
          }
          cmp = getNextComponent();

          $log.debug('ManifestService::getAll:in context?', context, getComponentIdx());
          // don't search out of context - exclude siblings & parents
          if (!!getComponentIdx() &&
            ( getComponentIdx().length < context.length ||
            getComponentIdx()[context.length - 1] !== context[context.length - 1] )) {
            return cmps;
          }
        }

        return cmps;
      };

      this.getLang = function () {
        return this.lang;
      };
      this.setLang = function (lang) {
        this.lang = lang;
      };

      this.getPageId = function () {
        return this.pageId;
      };
      this.setPageId = function (pageId) {
        $log.debug('ManifestService, setPageId', pageId);
        // reset component index for reparsing new page
        setComponentIdx(null);

        this.pageId = pageId;
        $rootScope.$broadcast('npPageIdChanged', pageId);
      };

      this.goToNextPage = function () {
        var thisPage = this.getPageId();
        var nextPage, i;
        if (!thisPage) {
          return;
        }

        var parent = this.getComponent(this.getPageId());
        for (i = 0; i < parent.components.length; i++) {
          var component = parent.components[i];
          if (component.type === 'npPage') {
            if (component.data.id === thisPage) {
              continue;
            }
            nextPage = component.data.id;
            break;
          }
        }
        this.setPageId(nextPage);
      };

      this.initialize = function (data, overrides) {
        $log.debug('ManifestService::initialize:', data, overrides);

        if( !!data ) {
          setData(data);
        }
        if( !! overrides ) {
          setOverrides(overrides[0]);
        }
        manifestInitialized = false;

        // index all components
        setComponentIdx(null);
        var cmp = self.getComponent();
        $log.debug('ManifestService::initialize:initialParse', cmp);
        while (!!cmp) {
          cmp = self.getComponent();
        }

        manifestInitialized = true;

        $log.debug('ManifestService::initialize:manifest data:', getData());
      };

    };
    return new Service();

  }
})();

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

        $log.info('ComponentService::getTemplate: cmp,templateURL:', componentObj, templateURL);
        if (!!templateURL) {
          var templateData = $templateCache.get(templateURL);
          $log.info('templateCache', templateData);
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

(function () {
  'use strict';
  angular.module('newplayer.component', ['newplayer.service']);
})();

'use strict';

/** @ngInject */
function AssessmentService ( $log ) {

  var pages = { required: 0, viewed: { required: 0, total: 0, log: []}};
  var questions = { required: 0, answered: { required: 0, total: 0, log: []}};
  var minimumPassing = 0.8;

  /**
   * Initializes the assessment service for this page/session
   *
   * @param ??
   */
  function setRequirements(requiredPages, requiredQuestions, minimumPassing) {
    pages.required = requiredPages;
    questions.required = requiredQuestions;
    minimumPassing = minimumPassing;
  }

  /** 
   * Get the user's current score according to page and answer counts
   *
   * @return score from 0..1. Returns 1 if there are no required questions or answers.
   */
  function getScore() {
    /*
     * (# of req. pages viewed + # of correctly answered req. questions) / 
     *      (total req. pages + total req. questions)
     */

      var totalRequired = pages.required + questions.required;

      // User scores 100% if there are no requirements...
      if( totalRequired === 0 ) {
          return 1;
      } 

      return Math.min(( pages.viewed.required + questions.answered.required ) / totalRequired, 1);
  }

  /** 
   * Determine if the user is passing based on the minimumPassing score
   *
   * @return bool
   */
  function isPassing() {

      if( minimumPassing === 0 ) {
          return true;
      }

    return getScore() >= minimumPassing;
  }
  
  /**
   * Record that a page was viewed and whether it was required
   *
   * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
   * @param pageIsRequired bool Whether the page was required so it can help user's score.
   */
  function pageViewed(pageName, pageIsRequired) {
      pages.viewed.total++;
      pages.viewed.log.push(pageName);

      if( pageIsRequired ) {
        pages.viewed.required++;
      }
  }

  /**
   * Record that a question was correctly answered and whether it was required 
   *
   * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
   * @param pageIsRequired bool Whether the page was required so it can help user's score.
   */
  function questionCorrectlyAnswered(questionName, questionIsRequired) {
      questions.answered.total++;
      questions.answered.log.push(questionName);

      if( questionIsRequired ) {
        questions.answered.required++;
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
   * Gets all questions stats
   *
   * @return obj of questions stats
   */
  function getQuestionStats() {
    return questions;
  }

  var service = {
      getScore: getScore,
      isPassing: isPassing,
      setRequirements: setRequirements,
      pageViewed: pageViewed,
      questionCorrectlyAnswered: questionCorrectlyAnswered,
      getPageStats: getPageStats,
      getQuestionStats: getQuestionStats
  };

  return service;
}

(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .directive('npComponent', ComponentDirective);
    /** @ngInject */
    function ComponentDirective($log, ManifestService, ComponentService, $compile/*, $timeout*/) {
        $log.debug('\nnpComponent::Init\n');
        var Directive = function () {
            var vm = this;
            this.restrict = 'EA';
            this.scope = true;
            /** @ngInject */
            this.controller =
                    function ($scope, $element, $attrs) {
                        $log.debug('npComponent::controller', $element, $attrs);
                        /*
                         var $attributes = $element[0].attributes;
                         */
                        //parseComponent( $scope, $element, $attrs );
                    };
            this.controllerAs = 'vm';
            this.compile = function (tElement, tAttrs, transclude) {
                /** @ngInject */
                return function ($scope, $element, $attributes) {
                    $log.debug('npComponent::compile!');
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
                $log.debug('npComponent::parseComponent', cmp, cmpIdx, $attributes);
                if (!!cmp) {
                    //ComponentService.load(
                    //  cmp
                    //)
                    //  .then(
                    //  function () {
                    $log.debug('npComponent::parseComponent then', cmp, cmpIdx);
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
                        $log.debug('npComponent::parseComponent - HAS SUBS:', cmp);
                        $scope.subCmp = true;
                        $scope.components = cmp.components;
                    }
                    var templateData = ComponentService.getTemplate(cmp);
                    $log.debug('npComponent::parseComponent: template', templateData);
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
    function ($log, $scope, $sce) {
      var cmpData = $scope.component.data || {};
      $log.debug('npAnswer::data', cmpData);

      this.id = cmpData.id;
      this.label = $sce.trustAsHtml(cmpData.label);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npAnswer::component loaded!');
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
    function ($log, $scope, $sce, $location, $element, ConfigService, ManifestService, APIService) {
      var cmpData = $scope.component.data || {};
      $log.debug('npButton::data', cmpData);

      this.content = '';
      var btnContent = cmpData.content;
      if (angular.isString(btnContent)) {
        this.content = $sce.trustAsHtml(btnContent);
        //$element.append( btnContent );
      }

      this.link = '';
      this.target = cmpData.target;
      this.linkInternal = true;
      this.apiLink = false;
      var btnLink = cmpData.link;
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
          //$location.url(this.link);
          ManifestService.setPageId(cmpData.link);
        } else {
          if (this.apiLink) {
            //TODO: we may need a `method` property to know what to use here
            // i.e. GET, POST, PUT, DELETE
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
      $log.debug('npColumn::data', cmpData);

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
      $log.debug('npColumn::component loaded!');
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
      $log.debug('npContent::data', cmpData);

      this.contentTitle = cmpData.title;

      var manifestLang = ManifestService.getLang();

      if (!manifestLang) {
        var firstContentCmp = ManifestService.getFirst('npContent');
        manifestLang = firstContentCmp.data.language;
        $log.debug('npContent::set lang', manifestLang);
        ManifestService.setLang(manifestLang);
      }

      var cmpLang = cmpData.language;
      if (cmpLang === manifestLang) {
        $log.debug('npContent::lang match', cmpLang, manifestLang);
        $scope.currentLang = true;
        $scope.currentContent = $scope;

        // set page title
        $rootScope.PageTitle = cmpData.title;
      } else {
        $log.debug('npContent::wrong lang', cmpLang, manifestLang);
        $scope.currentLang = false;
      }
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npContent component loaded!');
    }
  );
})();


(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npFeatureController',
    function ($log, $scope/*, ManifestService*/) {
      var cmpData = $scope.component.data || {};
      $log.debug('npFeature::data', cmpData);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npFeature::component loaded!');
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
                        $scope.feedback = this.feedback = cmpData.feedback;
                        $scope.image = this.image = cmpData.image;
                        //////////////////////
                        this.update = function (button) {
                            this.feedback = button.feedback;
                            var idx = this.hotspotButtons.indexOf(button);
                            //////////////////////
                            $scope.$watch('npHotspot.feedback', function (newValue, oldValue) {
                                $('.npHotspot-feedback p').each(function (index, totalArea) {
                                    var contentAreaHeight = $(this).outerHeight(true) + 50;
                                    TweenMax.to($('.content-background'), 1, {
                                        height: contentAreaHeight,
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
                        };
                    }
            )
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
                    var droppables = document.getElementsByClassName('hit-area');
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
                        TweenMax.to($('.hit-area'), 0, {
                            strokeOpacity: 0
                        });
                        TweenMax.to($(droppables).find('.button-completion-content'), 0.5, {
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
                                        TweenMax.to($(droppables[i]).find('.button-content'), 0.5, {
                                            autoAlpha: 0,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.to($(droppables[i]).find('.button-completion-content'), 0.5, {
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
        $log.debug('\nnpDragAndDropMatch mediaelementDirective::Init\n');
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
                        $log.debug('npHTML::data', cmpData);
//                        console.log(':: cmpData :: ', cmpData);

                        if (cmpData.link) {
                            this.link = cmpData.link;
                        }
                        this.content = cmpData.content;
                        $log.info('npHTML::content', $scope.content, this.content, cmpData.link);
                        this.handleLink = function () {
                            $log.info('npHTML:handleLink | link is a manifest');
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
                            console.log('innerWidth:',value);
                            bodyWidth = value;
                        });
                        $scope.selectLink = function (MyTarget) {
//                            var ele = document.getElementById(MyTarget);
//                            var icon = document.getElementById('caretSVG');
                            console.log('bodyWidth: ' + bodyWidth);
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
                            console.log('eleHeight: ' + eleHeight);
                            if (isCollapsed) {
                                TweenMax.to(icon, .75, {
                                    css: {
                                        transformOrigin: "50% 50%",
                                        rotation: 0
                                    },
                                    ease: Cubic.easeOut
                                });
                                TweenMax.to(ele, .75, {
                                    css: {
                                        autoAlpha: 0,
                                        height: "10px"
                                    },
                                    ease: Cubic.easeOut
                                });
                                isCollapsed = !isCollapsed;
                            } else if (!isCollapsed) {
                                TweenMax.to(icon, .75, {
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
      $log.debug('npImage::data', cmpData);

      this.alt = cmpData.alt;
      // TODO - use sce for URL whitelist?
      this.src = cmpData.src;
      $log.debug('npImage::src', this.src);
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npImage::component loaded!');
    }
  );
})();


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
      }
    };
  }

})();

(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npPageController',
    function ($log, $scope, $rootScope, ManifestService) {
      var cmpData = $scope.component.data || {};
      $log.debug('npPage::data', cmpData, $scope.contentTitle);

      this.title = cmpData.title;
      var parentIdx = $scope.component.idx.slice(0);
      parentIdx.pop();

      var pageId = ManifestService.getPageId();
      if (!pageId) {
        var firstPageCmp = ManifestService.getFirst('npPage', parentIdx);
        pageId = firstPageCmp.data.id;
        ManifestService.setPageId(pageId);
        $log.debug('npPage::set page', pageId);
      }

      npPageIdChanged(null, pageId);

      $rootScope.$on('npPageIdChanged', npPageIdChanged);

      function npPageIdChanged(event, newPageId) {

        pageId = newPageId;

        // check if current route is for this page
        $log.debug('npPage::on current page?', pageId, cmpData.id);
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
        }
      }
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npPage::component loaded!');
    }
  );
})();

(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npQuestionController',
    function ($log, $scope, $rootScope, ManifestService, $sce) {
      var cmpData = $scope.component.data;
      $log.debug('npQuestion::data', cmpData);

      this.id = cmpData.id;
      this.content = $sce.trustAsHtml(cmpData.content);
      this.type = cmpData.type;
      this.feedback = '';
      this.canContinue = false;

      var feedback = cmpData.feedback;

      this.changed = function () {
        $log.debug('npQuestion::answer changed');
        if (feedback.immediate) {
          this.feedback = '';
        }
      };

      this.evaluate = function () {
        var correct = true;
        $log.debug('npQuestion::evaluate:', this.answer);
        if (!!this.answer) {
          switch (this.type) {
            case 'radio':
              var radAnswer = ManifestService.getComponent(this.answer);
              if (angular.isString(radAnswer.data.feedback)) {
                this.feedback = radAnswer.data.feedback;
              }
              correct = radAnswer.data.correct;
              break;
            case 'checkbox':
              var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
              var idx;
              for (idx in chkAnswers) {
                if (chkAnswers[idx].data.correct) {
                  // confirm all correct answers were checked
                  if (!this.answer[chkAnswers[idx].idx]) {
                    correct = false;
                  }
                } else {
                  // confirm no incorrect answers were checked
                  if (this.answer[chkAnswers[idx].idx]) {
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
                }
                correct = false;
              } else {
                if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.correct)) {
                  this.feedback = txtAnswer.data.feedback.correct;
                }
              }
              break;
          }
        } else {
          correct = false;
        }
        $log.debug('npQuestion::evaluate:isCorrect', correct);

        // set by ng-model of npAnswer's input's
        if (feedback.immediate && this.feedback === '') {
          if (correct) {
            this.feedback = feedback.correct;
            this.canContinue = true;
          } else {
            this.feedback = feedback.incorrect;
            this.canContinue = false;
          }
        }
      };

      this.nextPage = function (evt) {
        evt.preventDefault();
        if (this.canContinue) {
          $rootScope.$emit('question.answered', true);
        }
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
(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npQuizController',
    function ($log, $scope, ManifestService, $sce) {
      var cmpData = $scope.component.data;
      $log.debug('npQuiz::data', cmpData);

      this.id = cmpData.id;
      this.content = $sce.trustAsHtml(cmpData.content);
      this.type = cmpData.type;
      this.feedback = '';

      var feedback = cmpData.feedback;

      this.changed = function () {
        $log.debug('npQuiz::answer changed');
        if (feedback.immediate) {
          this.feedback = '';
        }
      };

      this.evaluate = function () {
        $log.debug('npQuiz::evaluate:', this.answer);
        var correct = true;

        if (!!this.answer) {
          switch (this.type) {
            case 'radio':
              var radAnswer = ManifestService.getComponent(this.answer);
              if (!radAnswer.data.correct) {
                correct = false;
              }
              break;
            case 'checkbox':
              var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
              var idx;
              for (idx in chkAnswers) {
                if (chkAnswers[idx].data.correct) {
                  // confirm all correct answers were checked
                  if (!this.answer[chkAnswers[idx].idx]) {
                    correct = false;
                  }
                } else {
                  // confirm no incorrect answers were checked
                  if (this.answer[chkAnswers[idx].idx]) {
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
                correct = false;
              }
              break;
          }
        } else {
          correct = false;
        }
        $log.debug('npQuiz::evaluate:isCorrect', correct);

        // set by ng-model of npAnswer's input's
        if (feedback.immediate) {
          if (correct) {
            this.feedback = feedback.correct;
          } else {
            this.feedback = feedback.incorrect;
          }
        }
      };
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
        types = $scope.component.data.types;

    if (angular.isArray(types) && types.length > 0) {
      var sources = [];
      for (var typeIdx in types) {
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
        $log.debug('\nnpHotspot mediaelementDirective::Init\n');
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
                        var tid = setInterval(function () {
                            if (document.readyState !== 'complete') {
                                return;
                            }
                            clearInterval(tid);
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on ready set states
                            //////////////////////////////////////////////////////////////////////////////////////
                            TweenMax.to($(".reveal-object"), 0, {
                                autoAlpha: 0
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //finish ready check items
                            //////////////////////////////////////////////////////////////////////////////////////
                        }, 100);
                        this.update = function (button) {
                            var idx = this.revealItems.indexOf(button);
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::reveal::array data tests:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n:::', idx,
//                                    '\n:::', button,
//                                    '\n:::', $('video').length,
//                                    '\n:::', revealItems[idx].components[0],
//                                    '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change stop and reset all video files
                            //////////////////////////////////////////////////////////////////////////////////////
                            $('video').each(function () {
                                this.pause();
                                this.currentTime = 0;
                                this.load();
                            });
                            //////////////////////
                            TweenMax.to($(".reveal-object"), 0, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(".reveal-object")[idx], 0.75, {
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
                        $log.debug('npHotspot::component loaded!');
                    }
            );
})();
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
          } else {
            this.feedback = feedback.incorrect;
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
(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npTriviaController',
    function ($log, $scope, $rootScope, $timeout, ManifestService, $sce) {
      var vm = this;
      var cmpData = $scope.component.data;
      var pagesLen = $scope.components.length;
      $log.debug('npQuiz::data', cmpData);

      vm.id = cmpData.id;
      vm.content = $sce.trustAsHtml(cmpData.content);
      vm.type = cmpData.type;
      vm.currentPage = 0;
      vm.feedback = '';
      vm.assment = AssessmentService();
      vm.assment.setRequirements(pagesLen, pagesLen, null);
      vm.seenComponents = _.shuffle($scope.components);
      vm.pageId = vm.seenComponents[0].data.id;
      vm.difficulty = vm.seenComponents[0].components[0].data.difficulty || 0;

      // go to the first page, since pages were shuffled
      $timeout(function () {
        ManifestService.setPageId(vm.pageId);
      });

      $rootScope.$on('question.answered', function (evt, correct) {
      	if (correct) {
    			vm.assment.pageViewed();
      		vm.currentPage = vm.assment.getPageStats().viewed.total;
		      vm.pageId = vm.seenComponents[vm.currentPage] ?
		      	vm.seenComponents[vm.currentPage].data.id : '';
	    	  ManifestService.setPageId(vm.pageId);
					$rootScope.$emit('spin-to-win');

	    	  // end of the trivia questions
	    	  // TODO - add this message the template and set the two values
	    	  // here in the controller
          // NOTE: This text should come from the app
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
      $log.debug('npQuiz::component loaded!');
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
      'angular-royalslider'
    ]
  )

  /** @ngInject */
    .factory('AssessmentService', AssessmentService)

    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(false);
    });
})();

(function () {

  'use strict';
  angular
    .module('newplayer')
    .controller('AppController', AppController)
    .value('sliders', {});

  /** @ngInject */
  function AppController($log, AssessmentService/*, ImagePreloadFactory, HomeService, $scope*/) {
    $log.debug('AppController::Init');

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

(function () {

    'use strict';
    angular
            .module('newplayer')
            .directive('npLayer', NpLayer);

    /** @ngInject */
    function NpLayer($log/*,  $timeout*/) {
        $log.debug('NpLayer::Init\n');

        var directive = {
            restrict: 'E',
            scope: {
                manifestId: '@npId',
                manifestURL: '@npUrl',
                overrideURL: '@npOverrideUrl',
                overrideData: '@npOverrideData',
                language: '@npLang'
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
            APIService, ComponentService, ConfigService, ManifestService) {
        var vm = this;
        vm.manifestData = null;
        vm.overrideData = null;

        // $rootScope.$on('npLangChanged', npLangChanged);
        // $rootScope.$on('npPageWantsChange', npPageChanged);
        //.on('npManifestChanged', npManifestChanged)

        ConfigService.setConfigData(vm);
        loadManifests();

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

            $log.debug('NpLayer::parseComponent', cmp, cmpIdx, $attributes);
            if (!!cmp) {

                $log.debug('NpLayer::parseComponent then', cmp, cmpIdx);
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
                    $log.debug('NpLayer::parseComponent - HAS SUBS:', cmp);
                    $scope.subCmp = true;
                    $scope.components = cmp.components;
                }

                var templateData = ComponentService.getTemplate(cmp);
                $log.debug('npComponent::parseComponent: template', templateData);

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

        // using clipping now
        //// no spin for you!
        if (!Modernizr.csstransforms3d) {
	        element.find('.wheel').append(element.find('.wheel div').clone());
	        element.find('.wheel div').css({
  	      	'position': 'relative',
    	    	'margin-bottom': '10px'
      	  });
        	element.find('.wheel').animate({ "top": "-=1250px" }, 5000 );
         	return;
        }

	      TweenMax.set($wheel, {transformStyle:'preserve-3d', alpha:0});

        _.each(element.find('.wheel div'), function (elem, index) {
          TweenMax.to(elem, 0, {
            rotationX: (36 * index),
            transformOrigin: '20 20 -100px'
          });
        });

        // test code for use in the console, select the
        // s='10% 10% -100px';e='10% 10% -100px';wheel = $('.wheel');TweenMax.fromTo(wheel, 5, {rotationX:-360,transformOrigin:s}, {rotationX:0,transformOrigin:e})
        var transformOrigin = '10% 10% -100px';
        TweenMax.fromTo($wheel, 5, {alpha: 0, rotationX: 900, transformOrigin: transformOrigin}, {alpha: 1, rotationX: 0, transformOrigin: transformOrigin});
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
      //
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
    "\n" +
    "<div ng-if=\"npQuestion.type === 'radio'\" class=\"np-cmp-wrapper {{component.type}} radio\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "\n" +
    "    <label>\n" +
    "        <input type=\"radio\" class=\"npAnswer-radio np-cmp-main \" name=\"radio\" ng-model=\"npQuestion.answer\" value=\"{{component.idx}}\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "        <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\" ></span>\n" +
    "\n" +
    "    </label>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"npQuestion.type === 'checkbox'\" class=\"np-cmp-wrapper {{component.type}} checkbox\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "\n" +
    "    <label>\n" +
    "        <input type=\"checkbox\" class=\"npAnswer-checkbox np-cmp-main \" name=\"checkbox{{npAnswer.id}}\" ng-model=\"npQuestion.answer[component.idx]\" value=\"{{component.idx}}\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "        <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    </label>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"npQuestion.type === 'text'\" class=\"np-cmp-wrapper {{component.type}} input-group\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "\n" +
    "    <!--<label class=\"npAnswer-label \" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></label>-->\n" +
    "    <span class=\"npAnswer-label input-group-addon\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "    <input type=\"text\" class=\"npAnswer-text np-cmp-main form-control\" name=\"text{{npAnswer.id}}\" ng-model=\"npQuestion.answer\" value=\"\" id=\"{{npAnswer.id}}_input\" ng-change=\"npQuestion.changed()\" />\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"npMatch\" class=\"np-cmp-wrapper {{component.type}} matchbox\" ng-controller=\"npAnswerController as npAnswer\">\n" +
    "    <div class=\"slide-wrapper reveal-slide rsContent\">\n" +
    "        <label>\n" +
    "            <span class=\"npAnswer-label\" for=\"{{npAnswer.id}}_input\" ng-bind-html=\"npAnswer.label\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    </div>\n" +
    "</div>"
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
    "<button class=\"{{component.type}} {{npButton.type}} np-cmp-main btn\"  ng-controller=\"npButtonController as npButton\" ng-click=\"npButton.go()\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <span ng-bind-html=\"npButton.content\"></span>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</button>\n"
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
    "                        <!--<g id=\"Layer_2\">-->\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"400\" y2=\"200\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <rect fill=\"\" stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\"  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                        <!--                        </g>\n" +
    "                                                <g id=\"Layer_3\">-->\n" +
    "                        <foreignObject x=\"5%\" y=\"0\" width=\"100%\" height=\"100%\">\n" +
    "                            <div class=\"{{draggableButton.class}} button-content\">\n" +
    "                                <img class=\"draggableButtonImage\" ng-src=\"{{draggableButton.image}}\" alt=\"{{draggableButton.alt}}\" />\n" +
    "                                <div class=\"draggableButtonContent\" ng-bind-html=\"draggableButton.content\" ></div>\n" +
    "                            </div>\n" +
    "                        </foreignObject>\n" +
    "                        <!--</g>-->\n" +
    "                    </svg>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!--<div class=\"col-two\">-->\n" +
    "            <div class=\"col-xs-6\">\n" +
    "                <div id=\"hitAreaWrapper\">                    \n" +
    "                    <div ng-repeat=\"draggableButton in npDragAndDropMatch.draggableButtons\" class=\"{{hitArea.class}} hit-area boxElements\">\n" +
    "                        <svg class=\"complete-background\" version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                            <g class=\"complete-background-Layer_1\">\n" +
    "                                <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"486.5701\" y1=\"836.5667\" x2=\"474.7614\" y2=\"851.428\" gradientTransform=\"matrix(0.9984 5.588965e-02 -5.588965e-02 0.9984 48.0441 -25.572)\">\n" +
    "                                    <stop  offset=\"0.1882\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"0.3683\" style=\"stop-color:#FFEBC3\"/>\n" +
    "                                    <stop  offset=\"0.3952\" style=\"stop-color:#F7DFB1\"/>\n" +
    "                                    <stop  offset=\"0.5063\" style=\"stop-color:#D7B26A\"/>\n" +
    "                                    <stop  offset=\"0.5581\" style=\"stop-color:#CAA04E\"/>\n" +
    "                                    <stop  offset=\"1\" style=\"stop-color:#F3DB7F\"/>\n" +
    "                                <defs>\n" +
    "                                </defs>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_2\">\n" +
    "                                <rect stroke=\"url(#SVGID_1_)\" stroke-width=\"3\" vector-effect=\"non-scaling-stroke\" fill=\"none\"  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"/>\n" +
    "                            </g>\n" +
    "                            <g id=\"complete-background-Layer_4\">\n" +
    "                                <foreignObject  x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" >\n" +
    "                                    <div class=\"button-content\">\n" +
    "                                        <img class=\"hitAreaImage\" ng-src=\"{{draggableButton.matchingImage}}\" alt=\"{{hitArea.alt}}\" />\n" +
    "                                        <div class=\"hitAreaContent\" ng-bind-html=\"draggableButton.matchingContent\" ></div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"button-completion-content\">\n" +
    "                                        <div class=\"centered-content\" >\n" +
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
    "                        <foreignObject x=\"5%\" y=\"0\" width=\"100%\" height=\"100%\">\n" +
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


  $templateCache.put('scripts/component/npFeature/npFeature.html',
    "<div class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npFeatureController as npFeature\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>\n"
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
    "                <div ng-repeat=\"hotspotButton in npHotspot.hotspotButtons\">\n" +
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
    "                    <svg  version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 368 222\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
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
    "                <div class=\"npHotspot-feedback\" ng-bind-html=\"npHotspot.feedback\"></div>\n" +
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
    "                <h4 ng-bind-html=\"npList.heading\" class=\"media-heading\"></h4>\n" +
    "                <div ng-bind-html=\"npList.content\" class=\"np-cmp-main\" ng-if=\"!npList.link\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npMatch/npMatch.html',
    "<form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npMatchController as npMatch\" ng-submit=\"npMatch.evaluate()\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <h5 class=\"dark text-uppercase\">question:</h5>\n" +
    "    <div class=\"npMatch-content\" ng-bind-html=\"npMatch.content\"></div>\n" +
    "\n" +
    "\t<h5 class=\"dark text-uppercase\">answers:</h5>\n" +
    "    <div np-component ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "    <button type=\"submit\" class=\"col-xs-3 btn-primary\">Submit</button> &nbsp;\n" +
    "    <button id=\"next_button\" class=\"btn-default\" ng-click=\"npMatch.nextPage($event)\" ng-show=\"npMatch.canContinue\">Next</button>\n" +
    "<!--    <div class=\"btn btn-default\">\n" +
    "        <input type=\"submit\" />\n" +
    "    </div>-->\n" +
    "\n" +
    "    <div class=\"npMatch-feedback\" ng-if=\"npMatch.feedback\" ng-bind-html=\"npMatch.feedback\"></div>\n" +
    "</form>"
  );


  $templateCache.put('scripts/component/npMatchRow/npMatchRow.html',
    "<div class=\"debug\">\n" +
    "    <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"np-cmp-wrapper {{component.type}} rsDefault visibleNearby\" royalslider data-match=\"true\">\n" +
    "    <div np-component ng-repeat=\"component in components | orderBy:random\" idx=\"{{component.idx}}\" style=\"display: inline-block; border: 2px solid black; width: 200px; margin-right: 10px;\"></div>\n" +
    "</div>"
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
    "\n" +
    "\t<main ng-if=\"currentPage\" class=\"np-cmp-main\">\n" +
    "\n" +
    "\t\t<div class=\"debug\">\n" +
    "\t\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<h1 class=\"npPage-title\">{{npPage.title}}</h1>\n" +
    "\n" +
    "\t\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "\t</main>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('scripts/component/npQuestion/npQuestion.html',
    "<form class=\"np-cmp-wrapper {{component.type}} \" ng-controller=\"npQuestionController as npQuestion\" ng-submit=\"npQuestion.evaluate()\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "\n" +
    "    <h5 class=\"dark text-uppercase\">question:</h5>\n" +
    "    <div class=\"npQuestion-content\" ng-bind-html=\"npQuestion.content\"></div>\n" +
    "\n" +
    "\t<h5 class=\"dark text-uppercase\">answers:</h5>\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "    <button type=\"submit\" class=\"col-xs-3 btn-primary\">Submit</button> &nbsp;\n" +
    "    <button id=\"next_button\" class=\"btn-default\" ng-click=\"npQuestion.nextPage($event)\">Next</button>\n" +
    "<!--    <div class=\"btn btn-default\">\n" +
    "        <input type=\"submit\" />\n" +
    "    </div>-->\n" +
    "\n" +
    "    <div class=\"npQuestion-feedback\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "\n" +
    "</form>"
  );


  $templateCache.put('scripts/component/npQuiz/npQuiz.html',
    "<form class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npQuizController as npQuiz\"\n" +
    "      ng-submit=\"npQuiz.evaluate()\">\n" +
    "\n" +
    "  <div class=\"debug\">\n" +
    "    <h3>{{component.type}} --\n" +
    "      <small>{{component.idx}}</small>\n" +
    "    </h3>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"npQuiz-content h4\" ng-bind-html=\"npQuiz.content\"></div>\n" +
    "  <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "  <div class=\"npQuiz-feedback\" ng-if=\"npQuiz.feedback\" ng-bind-html=\"npQuiz.feedback\"></div>\n" +
    "</form>\n" +
    "\n"
  );


  $templateCache.put('scripts/component/npReveal/npReveal.html',
    "<div npReveal id=\"{{npReveal.id}}\" class=\"{{component.type}} np-cmp-wrapper np-reveal\" ng-controller=\"npRevealController as npReveal\">\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- \n" +
    "            <small>{{component.idx}}</small>\n" +
    "        </h3>\n" +
    "    </div>\n" +
    "    <!--:::::::::::: buttons ::::::::::::::::--> \n" +
    "    <div class=\"reveal-navigation col-md-12\">\n" +
    "        <div class=\" reveal-button-container\">\n" +
    "            <div revealButton class=\"reveal-button\" ng-repeat=\"revealItem in npReveal.revealItems\" ng-click=\"npReveal.update(revealItem)\">\n" +
    "                <div class=\"reveal-button-wrap\">\n" +
    "                    <img class=\"reveal-button-image img-responsive\" ng-src=\"{{revealItem.buttonImage}}\" alt=\"{{revealItem.buttonAlt}}\" />\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!--:::::::::::: buttons ::::::::::::::::-->\n" +
    "\n" +
    "    <!--::::::::::::  reveal  ::::::::::::::::-->\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"reveal-object\" ng-repeat=\"revealItemComponent in npReveal.revealItemComponents\">\n" +
    "            <div class=\"reveal-wrapper\">\n" +
    "                <div class=\"reveal-item-wrapper\">\n" +
    "                    <img ng-if=\"revealItemComponent.components[0].type == 'npImage'\" class=\"reveal-item reveal-image img-responsive\" ng-src=\"{{revealItemComponent.components[0].data.src}}\" alt=\"{{component.alt}}\" />\n" +
    "                    <video controls ng-if=\"revealItemComponent.components[0].type == 'npVideo'\" class=\"reveal-item reveal-video\" poster=\"{{revealItemComponent.components[0].data.poster}}\">\n" +
    "                        <source ng-src=\"{{revealItemComponent.components[0].data.baseURL}}\"/>\n" +
    "                    </video>\n" +
    "                </div>\n" +
    "                <div class=\"reveal-content-wrapper\">\n" +
    "                    <div class=\"reveal-background\"></div>\n" +
    "                    <div class=\"reveal-content-text\">\n" +
    "                        <p class=\"h4 reveal-text-heading\" ng-bind-html=\"revealItemComponent.heading\"></p>\n" +
    "                        <p class=\" reveal-text-body\" ng-bind-html=\"revealItemComponent.content\"></p>\n" +
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
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"npTrivia-content h4 col-xs-12\" ng-bind-html=\"npTrivia.content\"></div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"col-md-3\">\n" +
    "\t\t\t<np-price-is-right-spinner spinTime=\"2000\" class=\"col-xs-6\" ng-hide=\"!npTrivia.pageId\" data-difficulty=\"{{npTrivia.difficulty}}\">\n" +
    "\t\t\t\t<div>0</div>\n" +
    "\t\t\t    <div>100</div>\n" +
    "\t\t\t    <div>200</div>\n" +
    "\t\t\t    <div>300</div>\n" +
    "\t\t\t    <div>400</div>\n" +
    "\t\t\t    <div>500</div>\n" +
    "\t\t\t    <div>600</div>\n" +
    "\t\t\t    <div>700</div>\n" +
    "\t\t\t    <div>800</div>\n" +
    "\t\t\t    <div>900</div>\n" +
    "\t\t\t    <div>1000</div>\n" +
    "\t\t\t</np-price-is-right-spinner>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"col-md-9 np_row\" np-component ng-if=\"subCmp\" ng-repeat=\"component in npTrivia.seenComponents\" idx=\"{{component.idx}}\" ng-hide=\"npTrivia.pageId !== component.data.id\"></div>\n" +
    "\n" +
    "\t\t<div class=\"npTrivia-feedback\" ng-if=\"npTrivia.feedback\" ng-bind-html=\"npTrivia.feedback\"></div>\n" +
    "\t</div>\n" +
    "</form>"
  );


  $templateCache.put('scripts/component/npVideo/npVideo.html',
    "<np-video component=\"component\" class=\"{{component.type}}\" id=\"{{component.data.id}}\">\n" +
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
