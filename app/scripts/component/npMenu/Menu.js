'use strict';

angular
	.module(
		'npMenu',
		[ ]
	);

/** @ngInject */
function npMenuDirective(
	$log, $compile/*, $stateParams, $state, $timeout*/
)
{
	$log.debug('\nComponentDirective::Init\n');
	var Directive = function()
	{
		var vm = this;
		this.restrict = 'EA';
		this.scope = { 'menuitem': '=' };
		this.template =
			'<a ng-href="{{menuitem.link}}" id="menu{{menuitem.id}}">{{ menuitem.text }}</a>'+
			'<ul>' + 
				'<li ng-repeat="child in menuitem.children">' + 
					'<np-menu menuitem="child"></np-menu>' +
				'</li>' +
			'</ul>';
		this.controllerAs = 'vm';
		this.compile = function (tElement, tAttrs, transclude)
		{
			var contents = tElement.contents().remove();
			$log.debug('npMenu::compile', contents );
			var compiled;
			/** @ngInject */
			return function ($scope, $element, $attributes)
			{
				if(!compiled){
					compiled = $compile(contents);
				}
				compiled($scope, function(clone){
					$log.debug('npMenu::compile:linked', clone);
					$element.append(clone);
				});
			};
		};
	};
	return new Directive();
}

angular
	.module('npMenu')

	/** @ngInject */
	.controller( 'npMenuController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'npMenu::', $scope.component );
			var vm = this;

			this.items = ($scope.component.data||{}).items;
			if ( angular.isArray( vm.items ) )
			{
				for ( var itemIdx in vm.items )
				{
					var item = vm.items[ itemIdx ];
					if ( item === "pages" )
					{
						$log.debug( 'npMenu::pages', $scope.pages );
						var spliceArgs = [ itemIdx, 1 ].concat( $scope.pages );
						Array.prototype.splice.apply( vm.items, spliceArgs );
					}
				}
				$log.debug( 'npMenu::items', vm.items );
				$scope.items = vm.items;
			}
		}
	)

	.directive( 'npMenu', npMenuDirective )

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('npMenu::component loaded!');
		}
	);

