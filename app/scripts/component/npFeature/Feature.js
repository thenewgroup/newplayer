'use strict';

angular
	.module(
		'Feature',
		[ ]
	);

angular
	.module('Feature')

	/** @ngInject */
	.controller( 'FeatureController',
		function( /*$log, $scope, $state, ManifestService*/ )
		{
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Feature::component loaded!');
		}
	);

