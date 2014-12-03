'use strict';

/* derived from: http://jsfiddle.net/3sVz8/19/ */

angular
	.module(
		'npExpandable', []
	);

/** @ngInject */
function npExpandToggleDirective(
	$log, $compile/*, $stateParams, $state, $timeout*/
)
{
	var Directive = function()
	{
		this.restrict = 'AC';
		this.link = function(scope, element, attrs)
		{
			attrs.expanded = false;
			element.bind(
				'click',
				function()
				{
					var target = element.next()[0];
					var content = target.children;
					for ( var child in content )
					{
						var aChild = content[child];
						if ( (' ' + aChild.className + ' ').replace(/[\n\t]/g, ' ').indexOf(' expandable_content ') > -1 )
						{
							if(!attrs.expanded)
							{
								element.removeClass('collapsed');
								aChild.style.border = '1px solid black';
								var y = aChild.clientHeight;
								aChild.style.border = 0;
								target.style.height = y + 'px';
							} else {
								element.addClass('collapsed');
								target.style.height = '0px';
							}
						}
					}
					attrs.expanded = !attrs.expanded;
				}
			);
		};
	};
	return new Directive();
}

function npExpandableDirective(
	$log, $compile/*, $stateParams, $state, $timeout*/
)
{
	var Directive = function()
	{
		this.restrict = 'C';
		this.compile = function (tElement, tAttrs, transclude)
		{
			//return function ($scope, $element, $attributes)
			/** @ngInject */
			return function postLink($scope, $element, $attributes)
			{
				// default properties
				$attributes.duration = (!$attributes.duration) ? '0.5s' : $attributes.duration;
				$attributes.easing = (!$attributes.easing) ? 'ease-in-out' : $attributes.easing;
				$element.css({
					'overflow': 'hidden',
					'height': '0px',
					'transitionProperty': 'height',
					'transitionDuration': $attributes.duration,
					'transitionTimingFunction': $attributes.easing
				});
			};
		};
	};
	return new Directive();
}

angular
	.module( 'npExpandable' )

	/** @ngInject */
	.controller( 'npExpandableController',
		function( $log, $scope, $sce )
		{
			var cmpData = $scope.component.data;
			$log.debug( 'npExpandable::data', cmpData );

			this.id = cmpData.id;
			this.content = $sce.trustAsHtml( cmpData.content );
			$log.debug( 'npExpandable::content', $scope.content );
		}
	)

	/** @ngInject */
	.directive(
		'npExpandToggle',
		npExpandToggleDirective
	)

	/** @ngInject */
	.directive(
		'npExpandable',
		npExpandableDirective
	)

	/** @ngInject */
	.run(
		function( $log )
		{
			$log.debug('npExpandable::component loaded!');
		}
	);

