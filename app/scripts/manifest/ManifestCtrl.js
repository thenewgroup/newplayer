'use strict';

/** @ngInject */
function ManifestController(
	$log, ManifestService, $scope, $state, $stateParams, manifestData/*, ComponentService, $timeout*/
)
{
	$log.debug('ManifestCtrl::Init');

	var vm = this;

	function initialize()
	{
		$log.debug( 'ManifestCtrl:: manifestId ', ManifestService.getManifestId() );
		vm.manifestId = ManifestService.getManifestId();
		vm.lang = $stateParams.lang;
		vm.pageId = $stateParams.pageId;

		$log.debug(
			'ManifestCtrl::', {
				'state': $state.current.name,
				'url': $state.current.url,
				'manifestId': vm.manifestId,
				'lang': vm.lang,
				'pageId': vm.pageId
			}
		);
		if ( $state.is( 'manifest' ) )
		{
			$state.go(
				'manifest.lang.page',
				{
					lang: 'tbd',
					pageId: 'tbd'
				},
				{
					location: 'replace'
				}
			);
		} else
		if ( $state.is( 'manifest.lang' ) )
		{
			var lang = $stateParams.lang;
			if ( lang !== 'tbd' )
			{
				ManifestService.setLang( lang );
			}
			$state.go(
				'manifest.lang.page',
				{
					lang: lang,
					pageId: 'tbd'
				},
				{
					location: 'replace'
				}
			);
		}
		if ( $state.is( 'manifest.page' ) ||  $state.is( 'manifest.lang.page' ) )
		{
			var pageId = $stateParams.pageId;
			if ( pageId !== 'tbd' )
			{
				ManifestService.setPageId( pageId );
			}
		}


	}

	initialize();
}
