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
			var cmpData = $scope.component.data;
			$log.debug( 'npContent::data', cmpData );

			this.id = cmpData.id;

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

			var cmpLang = cmpData.language;
			if ( cmpLang === manifestLang )
			{
				$log.debug( 'npContent::lang match', cmpLang, manifestLang );
				$scope.currentLang = true;
				$scope.currentContent = $scope;
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

