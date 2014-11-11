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
		var data;

		var componentIdx;

		// if these are not defined by the route
		// the manifest components will teach this service
		// what the values should be
		var lang;
		var pageId;

		function getData()
		{
			$log.debug('ManifestService::getData', data);
			return data;
		}
		function setData( d )
		{
			data = d;
		}

		function getComponentIdx()
		{
			return componentIdx;
		}
		function setComponentIdx( cmpIdx )
		{
			componentIdx = cmpIdx;
		}

		function getNextComponent()
		{
			var idx = getComponentIdx();
			if ( !idx )
			{
				idx = [0];
			} else {
				var cmp = self.getComponent( idx );
				if ( !!cmp.components && cmp.components.length > 0 )
				{
					// sub-components - go deeper
					idx.push( 0 );
				} else {
					// try to get sibling
					var lastIdx = idx.pop();
					idx.push( ++lastIdx );
					cmp = self.getComponent( idx );
					if ( !!cmp )
					{
						// found sibling
					} else {
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
			return self.getComponent( getComponentIdx() );
		}

		this.initialize = function( data )
		{
			$log.debug('ManifestService::initialize:', data);

			setData( data );
			// index all components
			var cmp = self.getComponent();
			while ( !!cmp )
			{
				$log.debug( 'ManifestCtrl:: initialParse', cmp );
				cmp = self.getComponent();
			}

			$log.debug('ManifestService::initialized:', getData() );
		};

		// FIXME - temporary hack to prevent buggy infinite loops
		// count how many time a component is retrieved
		this.getCount = 0;

		/*
		 * Gets the component from the manifest specified by the idx array
		 * if no idx is specified, use the service's idx
		 */
		this.getComponent = function( idx )
		{
			$log.debug('ManifestService::getComponent', idx, this.getCount );

			// FIXME - temporary hack to prevent buggy infinite loops
			this.getCount++;

			var cmp;
			if ( !idx )
			{
				// idx not specified, get next using services idx
				$log.debug('ManifestService::getComponent: getNextComponent' );
				cmp = getNextComponent();
				// set it's index
				if ( !!cmp )
				{
					cmp.idx = getComponentIdx().slice(0);
					$log.debug('ManifestService::getComponent: set cmp idx', cmp );
				}
			} else {

				if ( typeof( idx ) === 'string' )
				{
					// convert string rep of array to integer array
					idx = idx.replace(/[\[\]]/g, '');
					idx = idx.split(',');
					for(var i=0; i<idx.length;i++)
					{
						// force integer
						idx[i] = +idx[i];
					}
				}
				setComponentIdx( idx );
				$log.debug('ManifestService::getComponent: set serv idx', idx );

				// traverse idx array to get to this particular cmp
				cmp = getData()[ idx[0] ];
				if ( !!cmp )
				{
					for ( var j in idx )
					{
						if (j>0)
						{
							var components = cmp.components;
							if ( !!components )
							{
								cmp = components[ idx[j] ];
							} else {
								// invalid index!?
								return null;
							}
						}
					}
				}
				if ( !!cmp )
				{
					// found a component
				} else {
					$log.debug('ManifestService::getComponent: bad idx', idx );
				}
			}
			return cmp;
		};

		this.getPage = function( lang, pageId )
		{
			return;
		};

		this.getFirst = function( cmpType, context )
		{
			if ( !context )
			{
				context = [0];
			}

			$log.debug( 'ManifestService::getFirst', cmpType, context );
			var cmp = self.getComponent( context );
			while ( !!cmp && cmp.type !== cmpType )
			{
				cmp = getNextComponent();
			}

			return cmp;
		};

		this.getAll = function( cmpType, context )
		{
			if ( !context )
			{
				context = [0];
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

			// FIXME - temporary hack to prevent buggy infinite loops
			this.getCount = 0;

			this.pageId = pageId;
		};

	};
	return new Service();

}
