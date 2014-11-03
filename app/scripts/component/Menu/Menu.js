'use strict';

angular
	.module(
		'Menu',
		[ ]
	);

angular
	.module('Menu')

	/** @ngInject */
	.controller( 'MenuController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'Menu::pages', $scope.pages );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Menu::component loaded!');
		}
	);

