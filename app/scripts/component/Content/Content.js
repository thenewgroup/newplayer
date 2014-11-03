'use strict';

angular
	.module(
		'Content',
		[ ]
	);

angular
	.module('Content')

	/** @ngInject */
	.controller( 'ContentController',
		function( $log, $scope, $state, ManifestService )
		{
			$log.debug( 'Content::' );
			var manifestLang = ManifestService.getLang();

			if ( !manifestLang )
			{
				var firstContentCmp = ManifestService.getFirst('Content');
				manifestLang = firstContentCmp.data.language;
				$log.debug('Content::set lang', manifestLang);
				ManifestService.setLang( manifestLang );
				/* redirecting interrupts component loading
				$state.go(
					'manifest.lang.page',
					{
						lang: manifestLang,
						page: 'tbd'
					}
				);
				*/
			}

			var cmpLang = $scope.component.data.language;
			$log.debug( 'Content::does content match lang?', cmpLang, manifestLang );
			if ( cmpLang === manifestLang )
			{
				$scope.currentLang = true;
				$scope.npContent = $scope;
			} else {
				$scope.currentLang = false;
			}
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Content component loaded!');
		}
	);

