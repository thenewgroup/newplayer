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
			var cmpData = $scope.component.data;
			$log.debug( 'npHTML::data', cmpData );

			this.id = cmpData.id;
			this.content = $sce.trustAsHtml( cmpData.content );
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

