'use strict';

angular
	.module(
		'Footer',
		[ ]
	);

angular
	.module('Footer')

	/** @ngInject */
	.controller( 'FooterController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'Footer::scope', $scope );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Footer::component loaded!');
		}
	);

