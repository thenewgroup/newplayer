(function() {
  'use strict';

  angular
    .module(
    'newplayer',
    [
      'ui.router',
      'ui.bootstrap',
      'oc.lazyLoad',
      'ngSanitize',
      'newplayer.service',
    ]
  )

  /** @ngInject */
    .factory('AssessmentService', AssessmentService)

    .config( /** @ngInject */ function ($logProvider) {
      $logProvider.debugEnabled(false);
    });
})();

//
///** @ngInject */
//  .run(
//  function ($rootScope, $state, $stateParams) {
//    $rootScope.$state = $state;
//    $rootScope.$stateParams = $stateParams;
//    //FastClick.attach(document.body);
//  }
//);
//=======
//angular
//	.module('newplayer')
//	/** @ngInject */
//	.factory('APIService' , APIService)
//	/** @ngInject */
//	.factory('ConfigService' , ConfigService)
//	/** @ngInject */
//	.factory('ManifestService' , ManifestService)
//	/** @ngInject */
//	.factory('ComponentService' , ComponentService)
//	/** @ngInject */
//	.factory('AssessmentService' , AssessmentService)
//	/** @ngInject */
//	.controller('AppController' , AppController);
//
//	//.config(Router)
//
//	//.run(
//	//	function($rootScope, $state, $stateParams)
//	//	{
//	//		$rootScope.$state = $state;
//	//		$rootScope.$stateParams = $stateParams;
//	//		//FastClick.attach(document.body);
//	//	}
//	//);

