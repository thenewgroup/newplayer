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

})()
