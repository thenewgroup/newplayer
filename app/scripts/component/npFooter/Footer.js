'use strict';

angular
	.module(
		'npFooter',
		[ ]
	);

angular
	.module('npFooter')

	/** @ngInject */
	.controller( 'npFooterController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'npFooter::scope', $scope );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npFooter::component loaded!');
		}
	);

