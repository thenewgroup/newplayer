'use strict';

angular
	.module(
		'npButton',
		[]
		);

angular
	.module('npButton')

	/** @ngInject */
	.controller( 'npButtonController',
		function( $log, $scope, $sce, $location, $element, ConfigService )
		{
			var cmpData = $scope.component.data || {};
			$log.debug( 'npButton::data', cmpData );

			this.content = '';
			var btnContent = cmpData.content;
			if ( angular.isString( btnContent ) )
			{
				this.content = $sce.trustAsHtml( btnContent );
				//$element.append( btnContent );
			}

			this.link = '';
			this.linkInternal = true;
			var btnLink = cmpData.link;
			if ( angular.isString( btnLink ) )
			{
				if ( btnLink.indexOf( '/' ) === 0 || /^https?:\/\//.test( btnLink ) )
				{
					this.linkInternal = false;
				} else {
					if ( btnLink.indexOf( '#' ) === 0 )
					{
						btnLink = btnLink.substr(1);
					} else {
						btnLink = '/' + ConfigService.getManifestId() + '/' + btnLink;
					}
				}
				$log.debug( 'npButton::link', btnLink );
				this.link = $sce.trustAsResourceUrl( btnLink );
			}
			this.go = function() {
				if ( this.linkInternal )
				{
					$location.url( this.link );
				} else {
					document.location = this.link;
				}
			};
		}
	)

	/** @ngInject */
	.run(
		function ($log, $rootScope)
		{
			$log.debug('npButton::component loaded!');
		}
	);

