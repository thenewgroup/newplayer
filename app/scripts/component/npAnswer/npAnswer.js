'use strict';

angular
	.module(
		'npAnswer',
		[ ]
	);

angular
	.module('npAnswer')

	/** @ngInject */
	.controller( 'npAnswerController',
		function( $log, $scope, $sce )
		{
			var cmpData = $scope.component.data || {};
			$log.debug( 'npAnswer::data', cmpData );

			this.id = cmpData.id;
			this.label = $sce.trustAsHtml( cmpData.label );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npAnswer::component loaded!');
		}
	);

