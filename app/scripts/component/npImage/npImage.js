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
			var cmpData = $scope.component.data || {};
			$log.debug( 'npImage::data', cmpData );

			this.alt = cmpData.alt;
			// TODO - use sce for URL whitelist?
			this.src = cmpData.src;
			$log.debug( 'npImage::src', this.src );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npImage::component loaded!');
		}
	);

