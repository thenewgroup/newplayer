'use strict';

angular
	.module(
		'npContent',
		[ ]
	);

angular
	.module('npContent')

	/** @ngInject */
	.controller( 'npContentController',
		function( $log, $scope, $state, ManifestService )
		{
			$log.debug( 'npContent::' );
			var manifestLang = ManifestService.getLang();

			if ( !manifestLang )
			{
				var firstContentCmp = ManifestService.getFirst('npContent');
				manifestLang = firstContentCmp.data.language;
				$log.debug('npContent::set lang', manifestLang);
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
			if ( cmpLang === manifestLang )
			{
				$log.debug( 'npContent::lang match', cmpLang, manifestLang );
				$scope.currentLang = true;
				$scope.npContent = $scope;
			} else {
				$log.debug( 'npContent::wrong lang', cmpLang, manifestLang );
				$scope.currentLang = false;
			}
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npContent component loaded!');
		}
	);

