'use strict';

angular
	.module(
		'HTML',
		[ ]
	);

angular
	.module('HTML')

	/** @ngInject */
	.controller( 'HTMLController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'HTML::component', $scope.component );
			$scope.content = $sce.trustAsHtml( $scope.component.data.output );
			$log.debug( 'HTML::content', $scope.content );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('HTML::component loaded!');
		}
	);

