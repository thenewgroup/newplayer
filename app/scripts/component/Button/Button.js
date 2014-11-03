'use strict';

angular
	.module(
		'Button',
		[ ]
	);

angular
	.module('Button')

	/** @ngInject */
	.controller( 'ButtonController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'Button::scope', $scope );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Button::component loaded!');
		}
	);

