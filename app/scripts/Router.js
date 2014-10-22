'use strict';

/** @ngInject */
function Router($logProvider, $stateProvider, $urlRouterProvider, $uiViewScrollProvider)
{
	$logProvider.debugEnabled(true);
	$uiViewScrollProvider.useAnchorScroll();
	$urlRouterProvider.otherwise('/sample');
	$stateProvider
		.state('home', {
			url: '/home',
			views: {
				'main':{
					templateUrl:'scripts/home/home.html',
					controller:'HomeController',
					controllerAs:'vm'
				}
			}
		})
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
						var mData = ManifestService.getData( $stateParams.manifestId );
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
		})
		*/
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
							$log.debug( 'Router: manifestId:', $stateParams.manifestId );
							var mData = ManifestService.getData( $stateParams.manifestId );
							$log.debug( 'Router: manifestData:', mData );
							return mData;
						}
				},
				views: {
					'main':{
						templateUrl:'scripts/manifest/init.html',
						controller:'ManifestController',
						controllerAs:'vm'
					}
				}
			}
		)
		.state(
			'manifest.page',
			{
				url: '/{lang}/{pageId}',
				resolve:{
					'manifestService': function(ManifestService, manifestId, $stateParams, $log){
						$log.debug( 'Router: manifestId:', manifestId, 'lang:', $stateParams.lang, 'page:', $stateParams.pageId );
						return ManifestService.getPage( $stateParams.lang, $stateParams.pageId );
					}
				},
				views: {
					'page':{
						templateUrl:'scripts/manifest/page.html',
						controller:'ManifestController',
						controllerAs:'vm'
					}
				}
			}
		)
}
