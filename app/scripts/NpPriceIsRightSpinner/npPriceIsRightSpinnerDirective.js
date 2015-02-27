(function () {

  'use strict';
  angular
    .module('newplayer')
    .directive('npPriceIsRightSpinner', npPriceIsRightSpinner);

  /** @ngInject */
  function npPriceIsRightSpinner($log,  $timeout, $rootScope) {
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
				// TweenMax.set(element.find('.wheel'), {transformStyle:'preserve-3d'});
			  var $choice = element.find('.wheel div[data-pick="true"]').remove();
			 	element.find('.wheel').append($choice);
				_.each(element.find('.wheel div'), function(elem, index) {
					TweenMax.to(elem, 1, {
						rotationX:(36 * index), 
						transformOrigin:'20 20 -100px'
					});
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
    	//
    }
  }
})();