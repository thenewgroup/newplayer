'use strict';

angular
	.module(
		'npHTML',
		[ ]
	);

angular
	.module('npHTML')

	/** @ngInject */
	.controller( 'npHTMLController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'npHTML::component', $scope.component );
			$scope.content = $sce.trustAsHtml( $scope.component.data.content );
			$log.debug( 'npHTML::content', $scope.content );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npHTML::component loaded!');
		}
	);

