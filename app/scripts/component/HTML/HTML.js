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
			$log.debug( 'HTML::setting html scope', $scope );
			$scope.content = $sce.trustAsHtml( $scope.$parent.cmpData.output );
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

