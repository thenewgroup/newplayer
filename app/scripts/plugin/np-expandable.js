'use strict';

/** @ngInject */
function npExpandableDirective( $log, $interval )
{
	$log.debug('\nexpandableDirective::Init\n');
	var Directive = function()
	{
		this.restrict = 'C';
		this.compile = function (tElement, tAttrs, transclude)
		{
			//return function ($scope, $element, $attributes)
			/** @ngInject */
			return {
				pre: function preLink($scope, $element, $attributes)
				{
					$attributes['data-expandable-duration'] =
						(!$element.attr('data-expandable-duration')) ? '0.5s' : $element.attr('data-expandable-duration');
					$attributes['data-expandable-easing'] =
						(!$element.attr('data-expandable-easing')) ? 'ease-in-out' : $element.attr('data-expandable-easing');
					$attributes['data-expandable-state'] =
						(!$element.attr('data-expandable-state')) ? 'collapsed' : $element.attr('data-expandable-state');
				},
				post: function postLink($scope, $element, $attributes)
				{
					$scope.expander = angular.element( $element[0].getElementsByClassName('np-cmp-main')[0] );
					$scope.expander.css( 'cursor', 'pointer' );
					var expandeeChild, expandeeChildHeight;

					$scope.expander.bind(
						'click',
						function()
						{
							if ( $scope.expandee.length === 1 )
							{
								expandeeChild = angular.element( $scope.expandee.children()[0] );

								if ($attributes['data-expandable-state'] === 'collapsed')
								{
									$attributes['data-expandable-state'] = 'expanded';
									$element.addClass('np-expandable-expanded').removeClass('np-expandable-collapsed');
									expandeeChild.css( 'border', '1px solid black' );
									var expandeeChildHeight = expandeeChild[0].clientHeight;
									expandeeChild.css( 'border', 'none' );
									$scope.expandee.css( 'height', expandeeChildHeight + 'px' );
								} else {
									$attributes['data-expandable-state'] = 'collapsed';
									$element.addClass('np-expandable-collapsed').removeClass('np-expandable-expanded');
									$scope.expandee.css( 'height', '0px' );
								}
							}
						}
					);

					$scope.expandee = [];
					var expandeePromise = $interval(
						function() {
							$scope.expandee = angular.element( $element[0].getElementsByClassName('np-cmp-sub')[0] );
							if ( $scope.expandee.length === 1 )
							{
								$interval.cancel( expandeePromise );
								// default properties
								$scope.expandee.css({
									'overflow': 'hidden',
									'transitionProperty': 'height',
									'transitionDuration': $attributes['data-expandable-duration'],
									'transitionTimingFunction': $attributes['data-expandable-easing']
								});
								if ( $attributes['data-expandable-state'] === 'collapsed' )
								{
									$element.addClass( 'np-expandable-collapsed' );
									$scope.expandee.css( 'height', '0px' );
								} else {
									$element.addClass( 'np-expandable-expanded' );
									expandeeChild = angular.element( $scope.expandee.children()[0] );
									expandeeChild.css( 'border', '1px solid black' );
									var expandeeChildHeight = expandeeChild[0].clientHeight;
									expandeeChild.css( 'border', 'none' );
									$scope.expandee.css( 'height', expandeeChildHeight + 'px' );
								}
							}
						},
						10,
						1 * (1000/10) // stop after 1 seconds
					);

				}
			};
		};
		/*
		this.link = function( scope, element, attrs, controller ) {
			$log.debug('expandableDirective::element', element);
			element.on(
				'click',
				function(e)
				{
					$log.debug('clikc',e);
				}
			);
		};
		*/
//		this.template = 'HOWDY~!';
	};
	return new Directive();
}


angular.module('newplayer')
.directive( 'npExpandable', npExpandableDirective );
//console.log( 'npExpandable added to', angular.module('newplayer') );

