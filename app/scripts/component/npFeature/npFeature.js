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
		function( $log, $scope/*, $state, ManifestService*/ )
		{
			var cmpData = $scope.component.data || {};
			$log.debug( 'npFeature::data', cmpData );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npFeature::component loaded!');
		}
	);

