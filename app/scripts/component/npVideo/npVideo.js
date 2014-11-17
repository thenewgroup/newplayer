'use strict';

angular
	.module(
		'npVideo',
		[ 'com.2fdevs.videogular' ]
	);

angular
	.module('npVideo')

	/** @ngInject */
	.controller( 'npVideoController',
		function( $log, $scope, $sce, $element )
		{
			$log.debug( 'npVideo::$element', $element );
			// TODO - use sce?
			$scope.config = $scope.component.data.config;
			$log.debug( 'npVideo::src', $scope.src );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npVideo::component loaded!');
		}
	);

