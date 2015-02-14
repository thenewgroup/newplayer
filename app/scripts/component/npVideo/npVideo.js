'use strict';

angular
  .module(
  'npVideo', []
  /*, [ 'com.2fdevs.videogular' ] */
);

/** @ngInject */
function npMediaElementDirective($log) {
  $log.debug('\nmediaelementDirective::Init\n');
  var Directive = function () {
    this.restrict = 'EA';
    this.replace = true;
    this.link = function (scope, element, attrs, controller) {
      attrs.$observe('src', function () {
        $log.info('mediaelementDirective::element', element);
        jQuery(element).mediaelementplayer({
          features: ['playpause', 'progress', 'current', 'duration', 'tracks', 'volume']
        });
      });
    };
  };
  return new Directive();
}

angular
  .module('npVideo')

/** @ngInject */
  .controller('npVideoController',
  function ($log, $scope, $sce, $element) {

    var cmpData = $scope.component.data;
    $log.debug('npVideo::data', cmpData, $element);

    this.id = cmpData.id;
    $scope.baseURL = this.baseURL = cmpData.baseURL;
    $scope.poster = this.poster = cmpData.poster;
    $scope.height = this.height = cmpData.height || 360;
    $scope.width = this.width = cmpData.width || 640;
    $scope.preload = this.preload = cmpData.preload || 'none';


    // video source elements need to be static BEFORE mediaElement is initiated
    // binding the attributes to the model was not working
    // alternatively, fire the mediaelement after the source attributes are bound?
    var types = cmpData.types;
    if (angular.isArray(types) && types.length > 0) {
      $log.debug('npVideo::data:types', types);
      var sources = [];
      for (var typeIdx in types) {
        var type = types[typeIdx];
        sources.push({
          type: type,
          mime: 'video/' + type,
          src: $sce.trustAsResourceUrl(this.baseURL + '.' + type)
        });
    //    $log.debug('npVideo::data:types:type', typeIdx, type);
    //    sources += '<source type="video/' + type + '" src="' + this.baseURL + '.' + type + '" />';
    //    $scope[type] = this.baseURL + '.' + type;
      }
      $scope.sources = sources;
    }
  }
)

  .directive('mediaelement', npMediaElementDirective)

/** @ngInject */
  .run(
  function ($log, $rootScope) {
    $log.debug('npVideo::component loaded!');
  }
);

