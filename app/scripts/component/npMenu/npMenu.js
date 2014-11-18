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
		this.restrict = 'EA';
		this.scope = { 'menuitem': '=' };
		this.template =
			'<a ng-href="{{menuitem.link}}" id="menu{{menuitem.id}}" ng-class="(menuitem.current===true) ? \'selected\' : \'\'">{{ menuitem.text }}</a>'+
			'<ul>' + 
				'<li ng-repeat="child in menuitem.children">' + 
					'<np-menu menuitem="child"></np-menu>' +
				'</li>' +
			'</ul>';
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
			var cmpData = $scope.component.data;
			$log.debug( 'npX::data', cmpData );

			this.id = cmpData.id;
			this.items = (cmpData||{}).items;

			if ( angular.isArray( this.items ) )
			{
				for ( var itemIdx in this.items )
				{
					var item = this.items[ itemIdx ];
					if ( item === "pages" )
					{
						$log.debug( 'npMenu::pages', $scope.pages );
						var spliceArgs = [ itemIdx, 1 ].concat( $scope.pages );
						Array.prototype.splice.apply( this.items, spliceArgs );
					}
				}
				$log.debug( 'npMenu::items', this.items );
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

