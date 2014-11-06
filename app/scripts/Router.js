'use strict';

/** @ngInject */
function Router($logProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider)
{
	$logProvider.debugEnabled(true);
	$uiViewScrollProvider.useAnchorScroll();
	$urlRouterProvider.otherwise('/sample');
	$stateProvider
		.state(
			'manifest',
			{
				url: '/{manifestId}',
				resolve:
				{
					'manifestId':
						function($stateParams)
						{
							return $stateParams.manifestId;
						},
					'manifestData':
						function(ManifestService, $stateParams, $log)
						{
							var mData = ManifestService.loadData( $stateParams.manifestId );
							$log.debug( 'Router::manifest:', $stateParams.manifestId, mData );
							return mData;
						}
				},
				views: {
					'init':{
						templateUrl:'scripts/manifest/init.html',
						controller:'ManifestController',
						controllerAs:'vm'
					}
				}
			}
		)
		.state(
			'manifest.lang',
			{
				url: '/{lang:[a-z]{2}-[A-Z]{2}|tbd}',
				resolve:
				{
					'lang':
						function($stateParams, $log)
						{
							$log.debug( 'Router::manifest.lang:', $stateParams.lang );
							return $stateParams.lang;
						}
				},
				views: {
					'load':{
						templateUrl:'scripts/manifest/load.html',
						controller:'ManifestController',
						controllerAs:'vm'
					}
				}
			}
		)
		.state(
			'manifest.lang.page',
			{
				url: '/{pageId}',
				resolve:
				{
					'pageId':
						function($stateParams, $log)
						{
							$log.debug( 'Router::manifest.lang.page:', $stateParams.pageId );
							return $stateParams.pageId;
						}
				},
				views: {
					'manifest':{
						templateUrl:'scripts/manifest/manifest.html',
						controller:'ManifestController',
						controllerAs:'vm'
					}
				}
			}
		).state(
			'manifest.page',
			{
				url: '/{pageId}',
				resolve:
				{
					'pageId':
						function($stateParams, $log)
						{
							$log.debug( 'Router: manifest.page: pageId:', $stateParams.pageId );
							return $stateParams.pageId;
						}
				},
				views: {
					'load':{
						templateUrl:'scripts/manifest/manifest.html',
						controller:'ManifestController',
						controllerAs:'vm'
					}
				}
			}
		);
		/*
		.state('manifest', {
			url: '/{manifestId}/{params:.*}',
			resolve:
			{
				'lang':
					function( $stateParams )
					{
						var params = $stateParams.params.split('/');
						return params[0];
					},
				'pageId':
					function( $stateParams )
					{
						var params = $stateParams.params.split('/');
						return ( params.length > 1 ) ? params[1] : '';
					},
				'manifestData':
					function( ManifestService, $state, $stateParams, lang, pageId, $log )
					{
						$log.debug( 'Router: manifestId:', $stateParams.manifestId );
						var mData = ManifestService.loadData( $stateParams.manifestId );
						$log.debug( 'Router: manifestData:', mData );
						return mData;
					},
				'manifestPage':
					function( ManifestService, $state, $stateParams, lang, pageId, $log )
					{
						$log.debug( 'Router: manifestId:', $stateParams.manifestId );
						var reload = false;
						if (!lang)
						{
							reload = true;
							lang = ManifestService.getLang();
							$log.debug( 'Router: getLang:', lang, ManifestService.getLang() );
						} else {
							ManifestService.setLang( lang );
							$log.debug( 'Router: setLang:', lang, ManifestService.getLang() );
						}
						if (!pageId)
						{
							reload = true;
							pageId = ManifestService.getPageId();
							$log.debug( 'Router: getPageId:', pageId, ManifestService.getPageId() );
						} else {
							ManifestService.setPageId( pageId );
							$log.debug( 'Router: pageId:', pageId, ManifestService.getPageId() );
						}
						if ( reload )
						{
							$state.go('/' + $stateParams.manifestId + '/' + lang + '/' + pageId );
						}
						var mPage = 'TBD';
						return mPage;
					}
			},
			views: {
				'main':{
					templateUrl:'scripts/manifest/init.html',
					controller:'ManifestController',
					controllerAs:'vm'
				}
			}
		});
		*/
}
