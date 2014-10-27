'use strict';

angular
	.module(
		'Feature',
		[ ]
	);

angular
	.module('Feature')

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Feature::component loaded!');
		}
	);

