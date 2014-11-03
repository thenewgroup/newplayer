'use strict';

angular
	.module(
		'Image',
		[ ]
	);

angular
	.module('Image')

	/** @ngInject */
	.controller( 'ImageController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'Image::scope', $scope );
			// TODO - use sce for URL whitelist?
			$scope.src = $scope.component.data.src;
			$log.debug( 'Image::src', $scope.src );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Image::component loaded!');
		}
	);

