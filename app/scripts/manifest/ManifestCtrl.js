'use strict';

/** @ngInject */
function ManifestController( $log, ManifestService, manifestData, ComponentService, $timeout, $scope, $state )
{
	$log.debug('ManifestController::Init');

	ManifestService.setData( manifestData );
	var vm = this;

	function activate()
	{
		vm.manifestId = ManifestService.getManifestId();
		vm.lang = ManifestService.getLang();
		vm.pageId = ManifestService.getPageId();

		if ( $state.is( 'manifest' ) )
		{
			$log.debug( 'ManifestCtrl: state is ', $state.current, ' redirect!?' );
			$state.go(
				'manifest.page',
				{
					lang: vm.lang,
					pageId: vm.pageId
				},
				{
					location: 'replace'
				}
			);
		} else {
			$log.debug( 'ManifestCtrl: state is ', $state.current );
			parse();
		}
	}

	function parse()
	{
		// use manifestService to iterate through components
		// - ocLazyLoad each component w/ componentService
		// - loaded component can decorate componentService to change loading behavior
		// - promise kicks off next iteration
		/*
		 * moving this into componentDirective
		var nextCmp = ManifestService.getComponent();
		$log.debug( 'ManifestCtrl: parse next', nextCmp );
		if ( nextCmp )
		{
			ComponentService.load(
				nextCmp
			).then( function() {
				parse();
			} );
		}
		*/
	}

	activate();
}
