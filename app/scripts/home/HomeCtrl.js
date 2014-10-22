'use strict';

//HomeController.$inject = ['$log','HomeService','$timeout','$scope','$state'];

/** @ngInject */
function HomeController( $log, HomeService, $timeout, $scope, $state, APIService )
{
	$log.debug('HomeController: Init');

	var vm = this;
	activate();

	function activate()
	{
		vm.data = 'Home';
	}

}
