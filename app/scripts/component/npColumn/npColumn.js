'use strict';

angular
	.module(
		'npColumn',
		[ ]
	);

angular
	.module('npColumn')

	/** @ngInject */
	.controller( 'npColumnController',
		function( $log, $scope, $sce )
		{
			var cmpData = $scope.component.data;
			$log.debug( 'npColumn::data', cmpData );

			this.id = cmpData.id;
		}
	)

	/** @ngInject */
	.run(
		function( $log )
		{
			$log.debug('npColumn::component loaded!');
		}
	);

