(function () {

  'use strict';
  angular
    .module('newplayer')
    .directive('npPriceIsRightSpinner', npPriceIsRightSpinner);

  /** @ngInject */
  function npPriceIsRightSpinner($log,  $timeout) {
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
      template: '<div class="col-md-3"><div class="wheels"><div class="wheel" ng-transclude></div></div></div>'
    };

    return directive;
    
    function link(scope, element, attrs) {
		  var now = Date.now || function(){return (new Date()).valueOf()},
		      start_point = {x: 0, y: 0},
		      last_point = {x: 0, y: 0},
		      current_coords = {x: 0, y: 0},
		      last_coords = {x: 0, y: 0},
		      velocity = {x: 0, y: 0},
		  /******** End Initialize *************/
		      
		  /******** Configuration **************/
		      /**
		       * mass : The unitless mass of this Momentus
		       */
		      mass = 1000,
		      
		      /**
		       * u : The friction coefficient
		       */
		      u = 4,

		      spin_time = attrs.spintime || 2000,

		      delay_time = attrs.delaytime || 1000,

		      shuffle_spaces = attrs.shufflespaces || true,
		      
		      /**
		       * If requestAnimationFrame is not supported, the fps at which to update
		       */
		      frame_rate = 60;
		  /******** End Configuration **************/

		  if (shuffle_spaces) {
		  	var spaces = element.find('.wheels .wheel div').detach();
		  	element.find('.wheels .wheel').append(_.shuffle(spaces));
		  }
		  // setup
			element.find('.wheels .wheel > div').each(function (index, elem) {
				var deg = index * 12;
				$(this).css('transform', 'perspective(500px) rotate3d(1, 0, 0, ' + deg + 'deg) translate3d(0, 0, 150px)');
			});

		 	function stop() {
		    last_coords = {x: 0, y: 0};
		    velocity = {x: 0, y: 0};
		    onSpin(current_coords, velocity, true);
		 	} 

		  function spin() {
		  	var t = setInterval(function () {
			    var e = {
			    	pageX: 1,
			    	pageY: Math.floor(Math.random() * 10000)
			    };
			    var vel = {
			    	x: 0,
			    	y: -Math.abs(Math.random() / 100000)
			    };
		      var delta_x = e.pageX - start_point.x;
		      var delta_y = e.pageY - start_point.y;
		      last_point = start_point;
		      last_coords.x = delta_x;
		      last_coords.y = delta_y;
		      current_coords.x += delta_x;
		      current_coords.y += delta_y;
			    onSpin(current_coords, vel);
		  	}, 100);

		  	$timeout(function () {
		  		clearInterval(t);
		  		stop();
		  	}, spin_time);
		  }

		  function onSpin(coords, velocity, pick){
		  	var space = element.find('.wheel > div');
		  	space.each(function(i){
		      var total = space.length;
		      var angle = -(coords.y/2) + (360/30) * i;
		      // stop and pick the one
		      if (pick) {
		      	var index = element.find('.wheel > div[data-pick]').index();
		      	angle = -(index * 12 - i * 12);
		      }
		      $(this).css('transform', 'perspective(500px) rotate3d(1,0,0,'+angle+'deg) translate3d(0,0,150px)');
		    });
		  }
		  
		  (function loop(){
		    velocity.x = !isNaN(velocity.x) ? velocity.x : 0;
		    velocity.y = !isNaN(velocity.y) ? velocity.y : 0;

		    if(velocity.x != 0 || velocity.y != 0){
		      var time = now(),
		          force_x = velocity.x * u,
		          force_y = velocity.y * u,
		          acc_x = force_x/mass,
		          acc_y = force_y/mass,
		          vel_x = velocity.x - (acc_x * delta_time),
		          vel_y = velocity.y - (acc_y * delta_time);
		      vel_x = !isNaN(vel_x) ? vel_x : 0;
		      vel_y = !isNaN(vel_y) ? vel_y : 0;
		      velocity.x = vel_x;
		      velocity.y = vel_y;
		      
		      var delta_x = vel_x * delta_time,
		          delta_y = vel_y * delta_time;
		      last_coords.x = current_coords.x;
		      last_coords.y = current_coords.y;
		      current_coords.x += delta_x;
		      current_coords.y += delta_y;
		      onSpin(current_coords, velocity);
		    }
		    
		    if(window.requestAnimationFrame){
		      requestAnimationFrame(loop);
		    }else{
		      $timeout(loop, 1000/frame_rate);
		    }
		  })();

		  $timeout(function () {
			  spin();
		  }, delay_time);
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