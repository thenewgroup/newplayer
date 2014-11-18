'use strict';

angular
	.module(
		'npHeader',
		[ ]
	);

angular
	.module('npHeader')

	/** @ngInject */
	.controller( 'npHeaderController',
		function( $log, $scope, $sce )
		{
			var cmpData = $scope.component.data;
			$log.debug( 'npHeader::data', cmpData );

			this.id = cmpData.id;
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npHeader::component loaded!');
		}
	);

