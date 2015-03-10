/* jshint -W003, -W117, -W026, -W040 */

(function () {
  'use strict';

  angular.module('angular-royalslider', [])
    .directive('royalslider', npRoyalSliderDirective);

  /**
   * @inject
   * @constructor
   */
  function npRoyalSliderDirective($log, $timeout, $rootScope, sliders) {
    var directive = {
      restrict: 'A',
      scope: {},
      link: link,
      controller: npRoyalSliderCtrl,
      controllerAs: 'vm'
    };

    return directive;

    /**
     * ngInject
     */
    function link(scope, element, attrs) {
      $log.debug('npRoyalSliderCtrl link', element);
      var opts = {
        keyboardNavEnabled: true,
        autoScaleSlider: true,
        controlNavigation: 'thumbnails',
        transitionType: 'fade'
      };

      var options = element.data();
      if (options.match) {
        opts = {
          addActiveClass: false,
          arrowsNav: false,
          autoScaleSlider: true,
          autoScaleSliderWidth: 900,
          autoScaleSliderHeight: 100,
          controlNavigation: 'none',
          loop: true,
          randomizeSlides: true,
          fadeinLoadedSlide: false,
          navigateByClick: false,
          visibleNearby: {
            enabled: true,
            centerArea: 0.2,
            center: true,
            breakpoint: 0,
            breakpointCenterArea: 0.6,
            navigateByCenterClick: false
          }
        };
      }

      $timeout(function () {
        var checkPng = 'https://cdn2.iconfinder.com/data/icons/flaticons-solid/16/checkmark-2-512.png';
        scope.$apply($(element).royalSlider(opts));
        $(element).data('royalSlider').ev.on('rsSlideClick', function(event, originalEvent) {
          // TODO - I think they want something to happen here...
          return;
        })
        .on('rsAfterSlideChange', function(event) {
          // triggers after slide change
          $rootScope.$emit('slider-enable-all');
        });

        // each slider is responsible for graying out their own slides
        $rootScope.$on('slider-disable-wrong', function () {
          $(element).find('.rsSlide').css('opacity', '0.5');
          var $correct = $(element).data('royalSlider').currSlide.holder;
          $correct.css('opacity', '');
        });

        $rootScope.$on('slider-enable-all', function () {
          $(element).find('.rsSlide').css('opacity', '');
        });

        var slider = $(element).data('royalSlider');
        sliders[slider.uid] = slider;
      });
    }

    /**
     * @ngInject
     * @param $scope
     * @param $log
     */
    function npRoyalSliderCtrl($scope, $log) {
      var vm = this;
    }
  }

})();
