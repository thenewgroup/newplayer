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
			$log.debug( 'Button::data', cmpData );

			this.content = '';
			var btnContent = cmpData.output;
			if ( !!btnContent && typeof( btnContent ) === 'string' )
			{
				this.content = $sce.trustAsHtml( btnContent );
			}

			this.link = '';
			this.linkInternal = false;
			var btnLink = cmpData.link;
			if ( !!btnLink && typeof( btnLink ) === 'string' )
			{
				if ( btnLink.indexOf( '#' ) === 0 )
				{
					this.linkInternal = true;
					btnLink = btnLink.substr(1);
				}
				this.link = $sce.trustAsResourceUrl( btnLink );
				$log.debug( 'Button::link', this.link );
			}
			this.go = function() {
				if ( this.linkInternal )
				{
					$location.url( this.link );
				} else {
					document.location = this.link;
				}
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

