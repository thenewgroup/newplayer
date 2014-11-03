'use strict';

/** @ngInject */
function ManifestController( $log, ManifestService, manifestData, ComponentService, $timeout, $scope, $state, $stateParams )
{
	$log.debug('ManifestCtrl::Init');

	var vm = this;

	function initialize()
	{
		$log.debug( 'ManifestCtrl:: manifestId ', ManifestService.getManifestId() );
		vm.manifestId = ManifestService.getManifestId();


		$log.debug( 'ManifestCtrl:: data initialized? ', ManifestService.getData() );
		// give the manifest data to the manifest service
		if ( ! ManifestService.getData() )
		{
			ManifestService.setData( manifestData );
			// index all components
			var cmp = ManifestService.getComponent();
			while ( !!cmp )
			{
				$log.debug( 'ManifestCtrl:: initialParse', cmp );
				cmp = ManifestService.getComponent();
			}
			// store the data for component awareness
			$scope.npManifest = manifestData;
		} else {
			$log.debug( 'ManifestCtrl:: data already loaded' );
		}


		$log.debug( 'ManifestCtrl::state is ', $state.current );
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
