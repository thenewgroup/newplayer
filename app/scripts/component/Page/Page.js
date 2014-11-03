'use strict';

angular
	.module(
		'Page',
		[ ]
	);

angular
	.module('Page')

	/** @ngInject */
	.controller( 'PageController',
		function( $log, $scope, $state, ManifestService )
		{
			$log.debug( 'Page::this component', $scope.component,
			            'is page', $scope.component.data.id,
			            'has manifest', $scope.npManifest,
			            'inside content scope', $scope.npContent,
			            'for page', ManifestService.getPageId() );

			var parentIdx = $scope.component.idx.slice(0);
			parentIdx.pop();

			var pageId = ManifestService.getPageId();
			if ( !pageId )
			{
				var firstPageCmp = ManifestService.getFirst('Page', parentIdx);
				pageId = firstPageCmp.data.id;
				ManifestService.setPageId( pageId );
				$log.debug('Page::set page', pageId);
				/* redirecting interrupts component loading
				$state.go(
					'manifest.lang.page',
					{
						lang: ManifestService.getLang(),
						pageId: pageId
					},
					{
						location: 'replace'
					}
				);
				*/
			}

			// have pages been indexed?
			if ( ! $scope.npContent.pages )
			{
				// index pages
				var pages = ManifestService.getAll( 'Page', parentIdx );
				var nestedPages = [];
				for (var page in pages)
				{
					var parentId = pages[page].data.parentId;
					if ( ! parentId )
					{
						$log.debug( 'Page::index:', parentId, pages[page] );
						nestedPages.push( {
							pageId : pages[page].data.id,
							children : []
						} );
					} else {
						$log.debug( 'Page::index nest:', pages[page], parentId );
						for ( var parentPage in nestedPages )
						{
							if ( nestedPages[parentPage].pageId === parentId )
							{
								nestedPages[parentPage].children.push( {
									pageId : pages[page].data.id,
									children : []
								}	);
							}
						}
					}
				}
				$log.debug( 'Page::index reulsts:', nestedPages );
				$scope.npContent.pages = pages;
			}


			// check if current route is for this page
			$log.debug( 'Page::on current page?', ManifestService.getPageId(), $scope.component.data.id );
			if ( $scope.component.data.id === pageId )
			{
				$scope.currentPage = true;
				$scope.npPage = $scope;

			} else {
				$scope.currentPage = false;
			}
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Page::component loaded!');
		}
	);

