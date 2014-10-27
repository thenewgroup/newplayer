'use strict';

angular
	.module(
		'Content',
		[ ]
	);

angular
	.module('Content')

	/** @ngInject */
	.controller('ContentController',
		function($scope)
		{
			$scope.dummy = 'testing';
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Content component loaded!');
		}
	);

