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

(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npAudioController', function ($log, $scope, $sce, $element) {
      var cmpData = $scope.component.data;
      $log.debug('npAudio::data', cmpData, $element);

      this.id = cmpData.id;
      this.baseURL = cmpData.baseURL;

      if (cmpData.poster)
      {
        $scope.poster = cmpData.poster;
      }

      // audio source elements need to be static BEFORE mediaElement is initiated
      // binding the attributes to the model was not working
      // alternatively, fire the mediaelement after the source attributes are bound?
      var types = cmpData.types;
      if (angular.isArray(types) && types.length > 0)
      {
        $log.debug('npAudio::data:types', types);
        var sources = '';
        for (var typeIdx in types)
        {
          var type = types[typeIdx];
          $log.debug('npAudio::data:types:type', typeIdx, type);
          sources += '<source type="audio/' + type + '" src="' + this.baseURL + '.' + type + '" />';
          $scope[type] = this.baseURL + '.' + type;
        }
        $scope.sources = sources;
      }
    }
  )

    .directive('mediaelement', npMediaElementDirective)

  /** @ngInject */
    .run(
    function ($log, $rootScope)
    {
      $log.debug('npAudio::component loaded!');
    }
  );

  /** @ngInject */
  function npMediaElementDirective($log) {
    $log.debug('\nmediaelementDirective::Init\n');
    var Directive = function () {
      this.restrict = 'A';
      this.link = function (scope, element, attrs, controller) {
        jQuery(element).attr('poster', scope.poster);
        jQuery(element).attr('src', scope.mp4);
        jQuery(element).prepend(scope.sources);
        attrs.$observe('src', function () {
          $log.debug('mediaelementDirective::element', element);
          jQuery(element).mediaelementplayer();
        });
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
    .controller('npButtonController',
    function ($log, $scope, $sce, $location, $element, ConfigService, ManifestService) {
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
      var btnLink = cmpData.link;
      if (angular.isString(btnLink)) {
        if (btnLink.indexOf('/') === 0) {
          if (!this.target) {
            this.target = '_top';
          }
          this.linkInternal = false;
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
              attrClass = attrClass.replace(/[^\w\-.:]/g, '_');
              $element.addClass('np_' + attrClass);
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

          var templateData = ComponentService.getTemplate(cmp)
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
          //  }
          //);
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

      $scope.feedback = this.feedback = cmpData.feedback;
      $scope.image = this.image = cmpData.image;

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
        //////////////////////
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
  /** @ngInject */
    .controller('npHotspotButtonController',
    function ($log, $scope, $sce, $location, $element, ConfigService) {
      var cmpData = $scope.component.data || {};
      $log.debug('npHotspotButton::data', cmpData);
      console.log('npHotspotButton::data', cmpData);
      //////////////////////////////
      this.src = cmpData.image;
      $scope.image = this.image = cmpData.image;
      console.log('button image ref: ' + $scope.image);
      ////////////////////////////

      this.content = '';
      var btnContent = cmpData.content;
      console.log('button content: ' + btnContent);
      if (angular.isString(btnContent)) {
        this.content = $sce.trustAsHtml(btnContent);
        //$element.append( btnContent );
      }

      this.link = '';
      this.type = cmpData.type;
      this.target = cmpData.target;
      this.linkInternal = true;
      var btnLink = cmpData.link;
      if (angular.isString(btnLink)) {
        if (btnLink.indexOf('/') === 0) {
          if (!this.target) {
            this.target = '_top';
          }
          this.linkInternal = false;
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
        $log.debug('npHotspotButton::link', btnLink);
        this.link = $sce.trustAsResourceUrl(btnLink);
      }
      this.go = function () {
        if (this.linkInternal) {
          $location.url(this.link);
        } else {
          window.open(this.link, this.target);
        }
      };
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npHotspotButton::component loaded!');
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

      if (cmpData.link) {
        this.link = cmpData.link;
      }

      this.content = cmpData.content;
      $log.info('npHTML::content', $scope.content, this.content, cmpData.link);

      this.handleLink = function() {
        $log.info('npHTML:handleLink | link is a manifest');
        $rootScope.$broadcast('npReplaceManifest', cmpData.link);
      }
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
    function ($log, $scope, ManifestService, $sce) {
      var cmpData = $scope.component.data;
      $log.debug('npQuestion::data', cmpData);

      this.id = cmpData.id;
      this.content = $sce.trustAsHtml(cmpData.content);
      this.type = cmpData.type;
      this.feedback = '';

      var feedback = cmpData.feedback;

      this.changed = function () {
        $log.debug('npQuestion::answer changed');
        if (feedback.immediate) {
          this.feedback = '';
        }
      };

      this.evaluate = function () {
        $log.debug('npQuestion::evaluate:', this.answer);
        var correct = true;

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

(function() {
  'use strict';

  angular
    .module(
    'newplayer',
    [
      'ui.bootstrap',
      'ngSanitize',
      'newplayer.service',
      'newplayer.component'
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
    .controller('AppController', AppController);

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

        if( !!vm.language ) {
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

    $rootScope.$on('npReplaceManifest', function(obj, newManifest) {
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

        var templateData = ComponentService.getTemplate(cmp)
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
    "\n"
  );


  $templateCache.put('scripts/component/npAudio/npAudio.html',
    "<div class=\"{{component.type}}\" ng-controller=\"npAudioController as npAudio\" id=\"{{npAudio.id}}\">\n" +
    "\n" +
    "    <div class=\"debug\">\n" +
    "        <h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "    </div>\n" +
    "    <!--\n" +
    "    <videogular vg-theme=\"npAudio.config.theme.url\">\n" +
    "            <vg-video vg-src=\"npAudio.config.sources\" vg-native-controls=\"true\"></vg-video>\n" +
    "    </videogular>\n" +
    "    -->\n" +
    "    <audio\n" +
    "        width=\"100%\"\n" +
    "        preload=\"auto\"\n" +
    "        mediaelement>\n" +
    "        <!--\n" +
    "                        <source type=\"video/{{npAudio.types[0]}}\" src=\"{{npAudio.baseURL}}.{{npAudio.types[0]}}\" />\n" +
    "                        <source ng-repeat=\"type in npAudio.types\" type=\"video/{{type}}\" src=\"{{npAudio.baseURL}}.{{type}}\" />\n" +
    "        -->\n" +
    "        <object width=\"100%\"  type=\"application/x-shockwave-flash\" data=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\">\n" +
    "            <param name=\"movie\" value=\"scripts/component/npAudio/mediaelement/flashmediaelement.swf\" />\n" +
    "            <param name=\"flashvars\" value=\"controls=true&file={{npAudio.baseURL}}.mp3\" />\n" +
    "            <!-- Image as a last resort -->\n" +
    "            <!--<img src=\"myvideo.jpg\" width=\"320\" height=\"240\" title=\"No video playback capabilities\" />-->\n" +
    "        </object>\n" +
    "    </audio>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>\n"
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
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"np-cmp-main\" ng-if=\"!!npHTML.link\">\n" +
    "    <a ng-click=\"npHTML.handleLink(); $event.stopPropagation();\" ng-bind-html=\"npHTML.content\"></a>\n" +
    "  </div>\n" +
    "\t<div ng-bind-html=\"npHTML.content\" class=\"np-cmp-main\" ng-if=\"!npHTML.link\"></div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
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
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-5\">\n" +
    "        <div class=\"content-area\">\n" +
    "            <div class=\"content-background\">\n" +
    "                <svg version=\"1.0\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 368 222\" xml:space=\"preserve\" preserveAspectRatio=\"none\">\n" +
    "                    <style type=\"text/css\">\n" +
    "                        <![CDATA[\n" +
    "                        .st0{fill:url(#SVGID_1_);}\n" +
    "                        .st1{display:inline;}\n" +
    "                        .st2{display:none;}\n" +
    "                        ]]>\n" +
    "                    </style>\n" +
    "                    <g id=\"Layer_2\">\n" +
    "                        <linearGradient id=\"SVGID_1_\" gradientUnits=\"userSpaceOnUse\" x1=\"0.8359\" y1=\"0.9399\" x2=\"367.8515\" y2=\"221.4724\">\n" +
    "                            <stop  offset=\"0\" style=\"stop-color:#CAA04C\"/>\n" +
    "                            <stop  offset=\"0.3497\" style=\"stop-color:#F8E4AA\"/>\n" +
    "                            <stop  offset=\"0.638\" style=\"stop-color:#CAA04D\"/>\n" +
    "                            <stop  offset=\"0.9816\" style=\"stop-color:#F3DB7E\"/>\n" +
    "                        </linearGradient>\n" +
    "                        <path class=\"st0\" d=\"M369.5,223.5h-371v-225h371V223.5z M1.5,220.5h365V1.5H1.5V220.5z\"/>\n" +
    "                    </g>\n" +
    "                </svg>\n" +
    "            </div>\n" +
    "            <div class=\"npHotspot-feedback\" ng-bind-html=\"npHotspot.feedback\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "</div>"
  );


  $templateCache.put('scripts/component/npHotspotButton/npHotspotButton.html',
    "<div class=\"{{component.type}} {{npHotspotButton.type}} np-cmp-main hotspotButton\"  ng-controller=\"npHotspotButtonController as npHotspotButton\" ng-click=\"npHotspotButton.go()\">\n" +
    "\n" +
    "    <span class=\"debug\">\n" +
    "        {{component.type}} -- <small>{{component.idx}}</small>\n" +
    "    </span>\n" +
    "\n" +
    "    <img class=\"{{component.type}} np-cmp-main hotspotButtonImage\" ng-controller=\"npHotspotButtonController as npHotspotButton\" ng-src=\"{{npHotspotButton.src}}\" alt=\"{{npHotspotButton.alt}}\" />\n" +
    "\n" +
    "    <!--<span ng-bind-html=\"npHotspotButton.content\"></span>-->\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "</div>"
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
    "    <div class=\"npQuestion-content\" ng-bind-html=\"npQuestion.content\"></div>\n" +
    "\n" +
    "    <div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "    \n" +
    "  <button type=\"submit\" class=\"btn btn-primary\">Submit</button>\n" +
    "<!--    <div class=\"btn btn-default\">\n" +
    "        <input type=\"submit\" />\n" +
    "    </div>-->\n" +
    "\n" +
    "    <div class=\"npQuestion-feedback\" ng-if=\"npQuestion.feedback\" ng-bind-html=\"npQuestion.feedback\"></div>\n" +
    "\n" +
    "</form>"
  );


  $templateCache.put('scripts/component/npQuiz/npQuiz.html',
    "<form class=\"np-cmp-wrapper {{component.type}}\" ng-controller=\"npQuizController as npQuiz\" ng-submit=\"npQuiz.evaluate()\">\n" +
    "\n" +
    "\t<div class=\"debug\">\n" +
    "\t\t<h3>{{component.type}} -- <small>{{component.idx}}</small></h3>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"npQuiz-content h4\" ng-bind-html=\"npQuiz.content\"></div>\n" +
    "\n" +
    "\t<div np-component ng-if=\"subCmp\" ng-repeat=\"component in components\" idx=\"{{component.idx}}\"></div>\n" +
    "\n" +
    "\t<div class=\"npQuiz-feedback\" ng-if=\"npQuiz.feedback\" ng-bind-html=\"npQuiz.feedback\"></div>\n" +
    "\n" +
    "</form>\n" +
    "\n"
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
