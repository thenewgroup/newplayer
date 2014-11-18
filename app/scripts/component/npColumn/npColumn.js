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

			var childCount = $scope.component.components.length;
			var columns = +cmpData.cols;
			if ( !columns ) {
				columns = childCount;
			}
			this.lastRowIndex = columns * Math.floor(childCount / columns);
			this.lastRowColumns = (childCount % columns) || 0;
			this.columns = columns;
			this.columnWidth = 100 / columns;
		}
	)

	/** @ngInject */
	.run(
		function( $log )
		{
			$log.debug('npColumn::component loaded!');
		}
	);

