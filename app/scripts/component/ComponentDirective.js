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
			var cmp = ManifestService.getComponent( $attributes.idx );
			var cmpIdx = cmp.idx || [0];

			$log.debug( 'ComponentDirective::parseComponent', cmp, cmpIdx, $attributes );
			if ( !!cmp )
			{
				ComponentService.load(
					cmp
				)
				.then(
					function()
					{
						$log.debug( 'ComponentDirective::parseComponent then', cmp, cmpIdx );
						// reset scope!!!
						$scope.sibCmp = false;
						$scope.subCmp = false;
						$scope.component = cmp;
						$scope.components = null;

						$scope.cmpIdx = cmpIdx.toString();

						$element.attr('data-cmpType', cmp.type );

						if ( !!cmp.data )
						{
							// set known data values
							// TODO: VALIDATE
							$element.attr('id', cmp.data.id );
							$scope.cmpId = cmp.data.id;
						}
						if ( !!cmp.components && cmp.components.length > 0 )
						{
							var subIdx = cmpIdx.slice(0);
							subIdx.push(0);
							$log.debug( 'ComponentDirective::parseComponent - HAS SUBS:', cmp, subIdx );
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
						$log.debug('ComponentDirective::parseComponent: cmp,templateURL:', cmp, templateURL );
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
									$log.debug('ComponentDirective::parseComponent: load failed!');
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
