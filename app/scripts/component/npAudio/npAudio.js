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