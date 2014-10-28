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
			$log.debug( 'Image::setting html scope', $scope );
			$scope.src = $scope.$parent.cmpData.src;
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

