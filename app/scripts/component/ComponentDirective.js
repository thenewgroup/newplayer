'use strict';

/** @ngInject */
function ComponentDirective( $log, ManifestService, ComponentService, $http, $compile, $stateParams, $state, $timeout )
{
	$log.debug('\nComponentDirective::Init\n');

	var Directive = function()
	{
		this.restrict = 'EA';
		this.scope = true;

		function templateLoaded( data, $scope, $element )
		{
			var compiled = $compile(data.data);
			var linked = compiled($scope);
			$element.append(linked);
			/*
			// if moving back up to parent
			if ( !!cmp.components && cmp.components.length > 0 )
			{} else {
				compiled = $compile( '<np-component>appended to ' + cmp.type + '</np-component>' );
				linked = compiled($scope);
				$element.append( linked );
			}
			*/
		}

		/*
		 * parses a component pulled in from the manifest service
		 */
		function parseComponent( $scope, $element, $attributes )
		{
			var cmpIdx = $attributes.idx;
			var cmp = ManifestService.getComponent( cmpIdx );
			cmpIdx = ManifestService.getComponentIdx().slice(0);
			$log.debug( 'ComponentDirective::parseComponent', cmp, cmpIdx, $attributes );
			if ( !!cmp )
			{
				ComponentService.load(
					cmp
				)
				.then(
					function()
					{
						// reset scope!!!
						$scope.sibCmp = false;
						$scope.subCmp = false;
						$scope.components = null;
						$scope.cmpType = cmp.type;
						$scope.cmpData = cmp.data;
						$scope.cmpIdx = cmpIdx.toString();
						if ( !!cmp.components && cmp.components.length > 0 )
						{
							var subIdx = cmpIdx.slice(0);
							subIdx.push(0);
							$log.debug( 'ComponentDirective::parseComponent - HAS SUBS:', cmp, cmpIdx, subIdx );
							$scope.subCmp = true;
							$scope.subIdx = subIdx;
							$scope.components = cmp.components;
						}
						var sibIdx = cmpIdx.slice(0);
						sibIdx.push( (sibIdx.pop())+1 );
						if ( !!ManifestService.getComponent(sibIdx) )
						{
							$scope.sibCmp = true;
							$scope.sibIdx = sibIdx;
						}

						// FIXME - temporary hack to prevent buggy infinite loops
						if ( ManifestService.getCount > 1000 ) {
							$scope.components = null;
							$scope.sibCmp = false;
							$scope.subCmp = false;
						}

						var templateURL = ComponentService.getTemplateURL( cmp );
						$log.debug('ComponentDirective::parseComponent: templateURL:', cmp, templateURL );
						if ( !!templateURL )
						{
							$scope.template = templateURL;
							$http.get( templateURL , {cache:false} )
							.then(
								function( data )
								{
									templateLoaded( data, $scope, $element );
								},
								function()
								{
									templateURL = ComponentService.getDefaultTemplate();
									$scope.template = templateURL;
									$http.get( templateURL, {cache:false} )
									.then(
										function( data )
										{
											templateLoaded( data, $scope, $element );
										}
									);
								}
							);
						}
					}
				);
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
