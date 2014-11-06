'use strict';

/** @ngInject */
function ComponentDirective(
	$log, ManifestService, ComponentService, $http, $compile/*, $stateParams, $state, $timeout*/
)
{
	$log.debug('\nComponentDirective::Init\n');

	var Directive = function()
	{
		var vm = this;
		this.restrict = 'EA';
		this.scope = true;
		/** @ngInject */
		this.controller =
			function($scope, $element, $attrs)
			{
				/*
				var $attributes = $element[0].attributes;
				$log.debug( 'ComponentDirective::controller', $element, $attrs );
				*/
				//parseComponent( $scope, $element, $attrs );
			};
		this.controllerAs = 'vm';
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
						$scope.subCmp = false;
						$scope.component = cmp;
						$scope.components = null;

						$scope.cmpIdx = cmpIdx.toString();

						$element.attr('data-cmpType', cmp.type );

						if ( !!cmp.data )
						{
							// set known data values
							var cmpId = cmp.data.id;
							if ( !cmpId )
							{
								cmpId = cmp.type + ':' + cmpIdx.toString();
							}
							// id must start with letter (according to HTML4 spec)
							if ( /^[^a-zA-Z]/.test( cmpId ) )
							{
								cmpId = 'np' + cmpId;
							}
							// replace invalid id characters (according to HTML4 spec)
							cmpId = cmpId.replace(/[^\w\-.:]/g,'_');

							// TODO: VALIDATE
							$element.attr('id', cmpId );
						}
						if ( !!cmp.components && cmp.components.length > 0 )
						{
							$log.debug( 'ComponentDirective::parseComponent - HAS SUBS:', cmp );
							$scope.subCmp = true;
							$scope.components = cmp.components;
						}

						// FIXME - temporary hack to prevent buggy infinite loops
						if ( ManifestService.getCount > 1000 ) {
							$scope.components = null;
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
	};
	return new Directive();
}
