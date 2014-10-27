'use strict';

/** @ngInject */
function BaseService( $log/*, $timeout, $http, $q, $state, $rootScope*/ )
{
	$log.debug('baseService: Init');

	return {
		func : function()
		{
			return;
		}
	};
}
