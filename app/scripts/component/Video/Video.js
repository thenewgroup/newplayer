'use strict';

angular
	.module(
		'Video',
		[ 'com.2fdevs.videogular' ]
	);

angular
	.module('Video')

	/** @ngInject */
	.controller( 'VideoController',
		function( $log, $scope, $sce, $element )
		{
			$log.debug( 'Video::setting html scope', $scope );
			$element.addClass('sixteen-nine');
			// TODO - use sce?
			$scope.config = $scope.component.data.config;
			$log.debug( 'Video::src', $scope.src );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Video::component loaded!');
		}
	);

