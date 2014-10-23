'use strict';

/** @ngInject */
function HomeController( $log/*, HomeService, $timeout, $scope, $state, APIService*/ )
{
	$log.debug('HomeController: Init');

	var vm = this;

	function activate()
	{
		vm.data = 'Home';
	}

	activate();
}
