/* jshint -W003, -W117, -W026, -W040 */

(function () {
  'use strict';

  angular.module('angular-royalslider', [])
    .directive('royalslider', npRoyalSliderDirective);

  /**
   * @inject
   * @constructor
   */
  function npRoyalSliderDirective($log, $timeout) {
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
      $timeout(function () {
        scope.$apply($(element).royalSlider(opts));
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
