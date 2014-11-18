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
			var cmpData = $scope.component.data;
			$log.debug( 'npVideo::data', cmpData, $element );

			this.id = cmpData.id;
			this.config = cmpData.config;
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npVideo::component loaded!');
		}
	);

