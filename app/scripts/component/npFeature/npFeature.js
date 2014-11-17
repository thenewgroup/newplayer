'use strict';

angular
	.module(
		'npFeature',
		[ ]
	);

angular
	.module('npFeature')

	/** @ngInject */
	.controller( 'npFeatureController',
		function( /*$log, $scope, $state, ManifestService*/ )
		{
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npFeature::component loaded!');
		}
	);

