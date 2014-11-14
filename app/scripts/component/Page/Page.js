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
		function( $log, $scope, $state, ManifestService, ConfigService )
		{
			$log.debug( 'Page::this component', $scope.component,
			            'is page', $scope.component.data.id,
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
				for (var pageIdx in pages)
				{
					var page = pages[pageIdx];
					$log.debug( 'Page::index:', page );
					if ( !!page.data && page.data.inMenu )
					{
						var aPage =
							{
								id : page.data.id,
								link : '#/' + ConfigService.getManifestId() + '/' + page.data.id,
								text : page.data.menuTitle || page.data.title,
								children : []
							};
						var parentId = page.data.parentId;
						$log.debug( 'Page::index:parent?', parentId );
						if ( ! parentId )
						{
							$log.debug( 'Page::index:top level:', aPage );
							nestedPages.push( aPage );
						} else {
							$log.debug( 'Page::index:nest:', parentId, aPage );
							for ( var parentPage in nestedPages )
							{
								$log.debug( 'Page::index:nest:isEqual?', parentId, nestedPages[parentPage].id );
								if ( nestedPages[parentPage].id === parentId )
								{
									nestedPages[parentPage].children.push( aPage );
								}
							}
						}
					}
				}
				$log.debug( 'Page::index reulsts:', nestedPages );
				$scope.npContent.pages = nestedPages;
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

