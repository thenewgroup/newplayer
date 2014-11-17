'use strict';

angular
	.module(
		'npImage',
		[ ]
	);

angular
	.module('npImage')

	/** @ngInject */
	.controller( 'npImageController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'npImage::scope', $scope );
			// TODO - use sce for URL whitelist?
			$scope.src = $scope.component.data.src;
			$log.debug( 'npImage::src', $scope.src );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npImage::component loaded!');
		}
	);

