'use strict';

angular
	.module(
		'Header',
		[ ]
	);

angular
	.module('Header')

	/** @ngInject */
	.controller( 'HeaderController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'Header::scope', $scope );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Header::component loaded!');
		}
	);

