'use strict';

angular
	.module(
		'npFooter',
		[ ]
	);

angular
	.module('npFooter')

	/** @ngInject */
	.controller( 'npFooterController',
		function( $log, $scope/*, $sce*/ )
		{
			var cmpData = $scope.component.data;
			$log.debug( 'npFooter::data', cmpData );

			this.id = cmpData.id;
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npFooter::component loaded!');
		}
	);

