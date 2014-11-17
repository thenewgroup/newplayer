'use strict';

angular
	.module(
		'npHeader',
		[ ]
	);

angular
	.module('npHeader')

	/** @ngInject */
	.controller( 'npHeaderController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'npHeader::scope', $scope );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npHeader::component loaded!');
		}
	);

