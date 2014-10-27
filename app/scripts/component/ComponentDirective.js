'use strict';

/** @ngInject */
function ComponentDirective( $log, ManifestService, ComponentService, $http, $compile, $stateParams, $state, $timeout )
{
	$log.debug('\nComponentDirective::Init\n');

	var Directive = function()
	{
		this.restrict = 'EA';
		this.scope = true;

		/*
		 * parses a component pulled in from the manifest service
		 */
		function parseComponent( $scope, $element, $attributes )
		{
			var thisCmpIdx = $attributes.idx;
			var thisCmp = ManifestService.getComponent( thisCmpIdx );
			thisCmpIdx = ManifestService.getComponentIdx().slice(0);
			$log.debug( 'ComponentDirective::parseComponent', thisCmp, thisCmpIdx, $attributes );
			if ( thisCmp )
			{
				ComponentService.load(
					thisCmp
				).then( function() {
					$scope.sibCmp = false;
					$scope.subCmp = false;
					$scope.cmpType = thisCmp.type;
					$scope.cmpData = thisCmp.data;
					$scope.cmpIdx = thisCmpIdx.toString();
					if ( !!thisCmp.modules && thisCmp.modules.length > 0 )
					{
						var subIdx = thisCmpIdx.slice(0);
						subIdx.push(0);
						$log.debug( 'ComponentDirective::parseComponent - HAS SUBS:', thisCmp, thisCmpIdx, subIdx );
						$scope.subCmp = true;
						$scope.subIdx = subIdx;
					}
					var sibIdx = thisCmpIdx.slice(0);
					sibIdx.push( (sibIdx.pop())+1 );
					if ( !!ManifestService.getComponent(sibIdx) )
					{
						$scope.sibCmp = true;
						$scope.sibIdx = sibIdx;
					}

					// FIXME - temporary hack to prevent buggy infinite loops
					if ( ManifestService.getCount > 50 ) {
						$scope.sibCmp = false;
						$scope.subCmp = false;
					}

					var templateURL = ComponentService.getTemplateURL( thisCmp );
					$log.debug('ComponentDirective::parseComponent: templateURL:', thisCmp, templateURL );
					if ( !!templateURL )
					{
						$scope.template = templateURL;
						$http.get( templateURL ,{cache:true}).then(function(data) {
							var compiled = $compile(data.data);
							var linked = compiled($scope);
							$element.append(linked);

							/*
							// if moving back up to parent
							if ( !!thisCmp.modules && thisCmp.modules.length > 0 )
							{} else {
								compiled = $compile( '<np-component>appended to ' + thisCmp.type + '</np-component>' );
								linked = compiled($scope);
								$element.append( linked );
							}
							*/
						});
					}
				} );
			}
		}

		this.compile = function (tElement, tAttrs, transclude)
		{
			/** @ngInject */
			return function ($scope, $element, $attributes)
			{
				$log.debug('ComponentDirective::compile!');

				parseComponent( $scope, $element, $attributes );

				/*
				$http.get('scripts/component/component.html',{cache:true}).then(function(data) {
					var compiled = $compile(angular.element(data.data));
					var linked = compiled($scope);
					$element.append(linked);
				});
				*/

 			};
		};
	};
	return new Directive();
}
