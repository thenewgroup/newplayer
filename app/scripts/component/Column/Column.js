'use strict';

angular
	.module(
		'Column',
		[ ]
	);

angular
	.module('Column')

	/** @ngInject */
	.controller( 'ColumnController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'Column::setting html scope', $scope );
			$scope.src = $scope.$parent.cmpData.src;
			$log.debug( 'Column::src', $scope.src );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Column::component loaded!');
		}
	);

