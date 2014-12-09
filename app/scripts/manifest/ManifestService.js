'use strict';

/*
 * console:
 * angular.element(document.body).injector().get('ManifestService')
 */

/** @ngInject */
function ManifestService(
	$log, APIService/*, $timeout, $http, $q, $state, $rootScope,*/
)
{
	$log.debug('\nManifestService::Init\n');

	var Service = function()
	{
		var self = this;
		var manifestInitialized = false;
		var data;
		var overrides;

		var componentIdx;

		// if these are not defined by the route
		// the manifest components will teach this service
		// what the values should be
		var lang;
		var pageId;

		function getData()
		{
			return data;
		}
		function setData( d )
		{
			data = d;
		}

		function getOverrides()
		{
			return overrides;
		}
		function setOverrides( data )
		{
			overrides = data;
		}

		function getComponentIdx()
		{
			return componentIdx;
		}
		function setComponentIdx( cmpIdx )
		{
			componentIdx = cmpIdx;
		}

		/*
		 * Determines manifest idx of next component when recursing the manifest
		 * first looks for sub-component
		 * next looks for sibling
		 * then it backs up to the parent and looks for sibling until it finds
		 * one or gets back to the root
		 */
		function getNextComponent()
		{
			var idx = getComponentIdx();
			var cmp = null;
			if ( !idx )
			{
				idx = [0];
				cmp = self.getComponent( idx );
			} else {
				// get current Component and find next
				cmp = self.getComponent( idx );

				if ( !!cmp.components && cmp.components.length > 0 )
				{
					// sub-components exist - go deeper
					idx.push( 0 );
					cmp = self.getComponent( idx );
				} else {
					// no children - try to find next sibling
					var lastIdx = idx.pop();
					idx.push( ++lastIdx );
					cmp = self.getComponent( idx );

					if ( !cmp )
					{
						// no sibling - find closest ancestor's sibling
						var backup = true;
						while ( !cmp && backup )
						{
							if (idx.length > 1)
							{
								// try parent's sibling
								idx.pop();
								lastIdx = idx.pop();
								idx.push( ++lastIdx );
								cmp = self.getComponent( idx );
							} else {
								// back to root - done
								backup = false;
								idx = null;
							}
						}
					}
				}
			}
			setComponentIdx( idx );
			if ( !idx )
			{
				return null;
			}
			return cmp;
		}

		function deserializeIdx( idx )
		{
			if ( angular.isArray( idx ) )
			{
				// return a clone of the array (not the original)
				return idx.slice(0);
			}
			if ( typeof( idx ) === 'string' )
			{
				// convert string rep of array to integer array
				idx = idx.replace(/[\[\]]/g, '');
				var arr = idx.split(',');
				// force array values to integer
				for(var i=0; i<arr.length;i++)
				{
					arr[i] = +arr[i] || 0;  // default to 0 if NaN!?
				}
				return arr;
			}
			return [0];
		}

		function extendDeep(dst)
		{
			angular.forEach
			(
				arguments,
				function(obj)
				{
					if (obj !== dst)
					{
						angular.forEach
						(
							obj,
							function(value, key)
							{
								if (dst[key] && dst[key].constructor && dst[key].constructor === Object)
								{
									extendDeep(dst[key], value);
								} else {
									dst[key] = value;
								}
							}
						);
					}
				}
			);
			return dst;
		}

		/*
		 * Initializes the component for the manifest
		 */
		function initializeComponent( cmp )
		{
			if ( !cmp )
			{
				return;
			}

			if ( !manifestInitialized )
			{
				// first pass, check overrides and modify this component
				var builderId = (cmp.data||{}).builderId;
				var newData = getOverrides()[ builderId ];
				if ( !!builderId && !!newData )
				{
					// found override for this component!
					$log.debug('ManifestService::initializeComponent: override builderId:', builderId, newData );
					if ( typeof( newData ) === 'string' )
					{
						switch( newData )
						{
							case 'delete':
								// get current component's idx
								var cmpIdx = getComponentIdx();
								// get the idx for this component in context of its parent
								var childIdx = cmpIdx.pop();
								// get the parent component
								var parentCmp = self.getComponent( cmpIdx );
								// and delete parent's sub component with index: childIdx
								var thisChild = parentCmp.components.splice( childIdx, 1 );
								// parser's current idx is deleted component's parent
								// if deleted component had a older sibling:
								if ( childIdx > 0 )
								{
									// repoint to deleted component's older sibling
									cmpIdx.push( childIdx-1 );
									setComponentIdx( cmpIdx );
								}
								break;
							default:
								try {
									newData = angular.fromJson( newData );
								} catch(e) {
									$log.debug( 'ManifestService::initializeComponent: override: did not know what to do with builderId:', builderId, newData, e );
								}
								break;
						}
					}
					if ( typeof( newData ) === 'object' )
					{
						$log.debug( 'ManifestService::initializeComponent: override: extend:', cmp.data, newData );
						extendDeep( cmp.data, newData );
					}
				}
			}

			// will we ever re-index after manifest initialization!?
			// index component
			cmp.idx = getComponentIdx().slice(0);
			$log.debug('ManifestService::initializeComponent: initialized:', cmp.idx, cmp );
		}

		/*
		 * Gets the component from the manifest specified by the idx array
		 * if no idx is specified, use the service's idx
		 */
		this.getComponent = function( idx )
		{
			var cmp;
			if ( !idx )
			{
				// idx not specified, get next using services idx
				$log.debug('ManifestService::getComponent: getNextComponent' );
				cmp = getNextComponent();

				// initialize the component
				initializeComponent( cmp );
			} else {

				idx = deserializeIdx( idx );
				setComponentIdx( idx );
				$log.debug('ManifestService::getComponent: find component:', idx );

				// traverse idx array to retrieve this particular cmp
				cmp = getData()[ idx[0] ];
				if ( !!cmp )
				{
					for ( var j in idx )
					{
						if ( j>0 )
						{
							var components = cmp.components;
							if ( !!components )
							{
								cmp = components[ idx[j] ];
								if ( !cmp )
								{
									// child idx out of range
									return null;
								}
							} else {
								// no children
								return null;
							}
						}
					}
				} else {
					// root index out of range
					return null;
				}
				$log.debug('ManifestService::getComponent: found:', idx, cmp );
			}
			return cmp;
		};

		/*
		 * Searches for the first occurance of the specified component
		 * @param {string} cmpType Component type to search for
		 * @param {(string|int[])=} context Context in which to do the search
		 * @returns {Component}
		 */
		this.getFirst = function( cmpType, context )
		{
			if ( !context )
			{
				context = [0];
			} else {
				context = deserializeIdx( context );
			}

			$log.debug( 'ManifestService::getFirst', cmpType, context );
			var cmp = self.getComponent( context );
			while ( !!cmp && cmp.type !== cmpType )
			{
				cmp = getNextComponent();

				// don't search out of context - exclude siblings & parents
				if ( !!getComponentIdx() &&
				     ( getComponentIdx().length < context.length ||
				       getComponentIdx()[ context.length-1 ] != context[ context.length-1 ] ) )
				{
					return null;
				}
			}

			return cmp;
		};

		/*
		 * Searches for all occurances of the specified component
		 * @param {string} cmpType Component type to search for
		 * @param {(string|int[])=} context Context in which to do the search
		 * @returns {Component[]}
		 */
		this.getAll = function( cmpType, context )
		{
			$log.debug( 'ManifestService::getAll:initialContext', context );
			if ( !context )
			{
				context = [0];
			} else {
				context = deserializeIdx( context );
			}
			var cmps = [];

			$log.debug( 'ManifestService::getAll', cmpType, context );
			var cmp = self.getComponent( context );
			while ( !!cmp )
			{
				$log.debug( 'ManifestService::getAll:match?', cmp.type, cmpType );
				if ( cmp.type === cmpType )
				{
					cmps.push( cmp );
					$log.debug( 'ManifestService::getAll:match!', cmps );
				}
				cmp = getNextComponent();

				$log.debug( 'ManifestService::getAll:in context?', context, getComponentIdx() );
				// don't search out of context - exclude siblings & parents
				if ( !!getComponentIdx() &&
				     ( getComponentIdx().length < context.length ||
				       getComponentIdx()[ context.length-1 ] != context[ context.length-1 ] ) )
				{
					return cmps;
				}
			}

			return cmps;
		};

		this.getLang = function()
		{
			return this.lang;
		};
		this.setLang = function(lang)
		{
			this.lang = lang;
		};

		this.getPageId = function()
		{
			return this.pageId;
		};
		this.setPageId = function(pageId)
		{
			// reset component index for reparsing new page
			setComponentIdx( null );

			this.pageId = pageId;
		};

		this.initialize = function( data, overrides )
		{
			$log.debug( 'ManifestService::initialize:', data, overrides );

			setData( data );
			setOverrides( overrides[0] );
			manifestInitialized = false;

			// index all components
			setComponentIdx( null );
			var cmp = self.getComponent();
			$log.debug( 'ManifestService::initialize:initialParse', cmp );
			while ( !!cmp )
			{
				cmp = self.getComponent();
			}

			manifestInitialized = true;

			$log.debug('ManifestService::initialize:manifest data:', getData() );
		};

	};
	return new Service();

}
