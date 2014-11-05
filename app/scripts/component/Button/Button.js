'use strict';

angular
	.module(
		'Button',
		[ ]
	);

angular
	.module('Button')

	/** @ngInject */
	.controller( 'ButtonController',
		function( $log, $scope, $sce, $location )
		{
			var cmpData = $scope.component.data;

			$log.debug( 'Button::scope', $scope );
			this.content = $sce.trustAsHtml( cmpData.output );
			if ( !!cmpData.link )
			{
				this.link = $sce.trustAsResourceUrl( cmpData.link );
				$log.debug( 'Button::link', this.link );
			}
			this.go = function() {
				$location.path( this.link );
			}
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Button::component loaded!');
		}
	);

