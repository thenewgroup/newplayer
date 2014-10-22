'use strict';

//ManifestController.$inject = ['$log','ManifestService','$timeout','$scope','$state'];

/** @ngInject */
function ManifestController($log,ManifestService,$timeout,$scope,$state,APIService) {
    $log.debug('ManifestController: Init');

    var vm = this;
    activate();

    function activate(){
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
			}
   }

}
