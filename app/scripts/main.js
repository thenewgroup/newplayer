'use strict';

angular
	.module(
		'newplayer',
		[
			'ui.router',
			'oc.lazyLoad',
			'ngSanitize'
		]
	);

console.log('main::module created', angular.module('newplayer') );

angular
	.module('newplayer')
	/** @ngInject */
	.controller('AppController' , AppController)
	/** @ngInject */
	.factory('APIService' , APIService)
	/** @ngInject */
	//.factory('HomeService' , HomeService)
	/** @ngInject */
	.factory('ManifestService' , ManifestService)
	/** @ngInject */
	.factory('ComponentService' , ComponentService)
	/** @ngInject */
	.directive('npComponent' , ComponentDirective)

	/** @ngInject */
	.config(Router)
	/** @ngInject */
	.run(
		function($rootScope, $state, $stateParams)
		{
			console.log('main::run');
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
			//FastClick.attach(document.body);
			console.log('main::running');
		}
	);

console.log('main::module running');
