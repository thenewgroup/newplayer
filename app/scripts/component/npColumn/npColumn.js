'use strict';

angular
	.module(
		'npColumn',
		[ ]
	);

angular
	.module('npColumn')

	/** @ngInject */
	.controller( 'npColumnController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'npColumn::scope', $scope );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npColumn::component loaded!');
		}
	);

