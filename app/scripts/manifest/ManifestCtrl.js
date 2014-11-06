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

		$log.debug( 'ManifestCtrl::state is ', $state.current, vm.manifestId, vm.lang, vm.pageId );
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
			$state.go(
				'manifest.lang.page',
				{
					lang: $stateParams.lang,
					pageId: 'tbd'
				},
				{
					location: 'replace'
				}
			);
		}


	}

	initialize();
}
