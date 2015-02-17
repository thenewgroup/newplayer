'use strict';

angular
	.module(
		'npHTML',
		[ ]
	);

angular
	.module('npHTML')

	/** @ngInject */
	.controller( 'npHTMLController',
		function( $log, $scope, $sce )
		{
			var cmpData = $scope.component.data,
        content = null;
			$log.debug( 'npHTML::data', cmpData );

      // TODO: fix me! We need to make an internal link instead of an external href
      if (cmpData.link) {
        content = '<a href="" ng-click="vm.update(' + cmpData.link + ')">' + angular.element(cmpData.content).text() + '</a>';
      } else {
        content = cmpData.content;
      }
			this.content = $sce.trustAsHtml( cmpData.content );
			$log.debug( 'npHTML::content', $scope.content, this.content, cmpData.link );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npHTML::component loaded!');
		}
	);

