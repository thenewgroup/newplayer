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
			var cmpData = $scope.component.data;
			$log.debug( 'npFeature::data', cmpData );

			this.id = cmpData.id;
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npFeature::component loaded!');
		}
	);

