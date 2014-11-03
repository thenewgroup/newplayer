'use strict';

/** @ngInject */
function ComponentService( $log, ManifestService, $ocLazyLoad /*, $timeout, $http, $q, $state, $rootScope*/ )
{
	$log.debug('\nComponentService: Init\n');

	var Service = function()
	{
		var self=this;

		// const
		var COMPONENT_ROOT = '/scripts/component/';
		var DEFAULT_TEMPLATE = '/scripts/component/blank.html';

		// must be used during initial load
		// can't be relied upon after prmoise resolves
		var cmpDependencies = [];


		function initCmp( cmpType )
		{
			$log.debug( 'ComponentService: initCmp:', cmpType, COMPONENT_ROOT );

			// add base dependency
			addCmpDependencies( cmpType, cmpType + '.js' );
		}

		var cleanURL = function( cmpType, cmpURL )
		{
			$log.debug( 'ComponentService: cleanURL: in:', cmpType, cmpURL );
			if ( !!cmpURL && typeof( cmpURL ) === 'string' )
			{
				if ( cmpURL.indexOf( COMPONENT_ROOT ) === -1 )
				{
					// dependency doesn't already have root
					if ( cmpURL.substr(0,1) === '/' )
					{
						// component is not relative to component directory
						// for now assume they know where they're pointing
						//return cmpURL;
					} else {
						// add root
						cmpURL = COMPONENT_ROOT + cmpType + '/' + cmpURL;
					}
				}
			}
			$log.debug( 'ComponentService: cleanURL: out:', cmpURL );
			return cmpURL;
		};

		function getCmpDependencies()
		{
			return cmpDependencies;
		}
		var setCmpDependencies = function ( cmpDeps )
		{
			cmpDependencies = cmpDeps;
		};
		function addCmpDependencies( cmpType, cmpDeps )
		{
			$log.debug( 'ComponentService: addCmpDependencies:', cmpType, cmpDeps );
			if ( typeof( cmpDeps ) === 'string' )
			{
				cmpDependencies.push( cleanURL( cmpType, cmpDeps ) );
			} else {
				for ( var i in cmpDeps )
				{
					var cmpDep = cmpDeps[i];
					cmpDependencies.push( cleanURL( cmpType, cmpDep ) );
				}
			}
		}

		this.getTemplateURL = function( componentObj )
		{
			var template = DEFAULT_TEMPLATE;
			// TBD validate incoming data
			if ( !!componentObj )
			{
				var cmpType = componentObj.type;
				if ( !!cmpType )
				{
					var cmpData = componentObj.data;
					if ( !!cmpData )
					{
						// "data"."template" - string URL to template
						var cmpTemplate = cmpData.template || cmpType + '.html';
						if ( !!cmpTemplate && typeof(cmpTemplate) === 'string' )
						{
							// TBD validate incoming data
							$log.debug( 'ComponentService: load: parseTemplate', componentObj, cmpTemplate );
							template = cleanURL( cmpType, cmpTemplate );
						}
					}
				}
			}
			return template;
		};

		this.getDefaultTemplate = function()
		{
			return DEFAULT_TEMPLATE;
		};

		this.load = function( componentObj )
		{
			$log.debug( '\nComponentService: load:', componentObj );

			// TBD - reset specific-component values
			setCmpDependencies( [] );

			// parse component "type"
			// TBD validate incoming data
			var cmpName = componentObj.type || 'empty';
			initCmp( cmpName );

			// parse component "data" required during component load
			// TBD validate incoming data
			var cmpType = componentObj.type;
			var cmpData = componentObj.data;
			if ( !!cmpType && !!cmpData )
			{
				// "data"."req" - array of URLs to additional dependencies of this component
				var cmpDependencies = cmpData.req;
				if ( !!cmpDependencies )
				{
					// TBD validate incoming data
					addCmpDependencies( cmpType, cmpDependencies );
				}
			}

			$log.debug( 'ComponentService: loading:', cmpName, getCmpDependencies() );
			var aPromise =
				$ocLazyLoad.load(
					{
						name: cmpName,
						files: getCmpDependencies()
					}
				)
				.then
				(
					function()
					{
						// success
						self.onLoad( componentObj );
					}
				)
				.catch
				(
					function(err)
					{
						// error
						$log.debug( 'ComponentService: load err:', err );
						self.onLoad( componentObj );
					}
				);
			return aPromise;
		};

		// loaded component can decorate componentService to change loading behavior!?
		this.onLoad = function( componentObj )
		{
			$log.debug( 'ComponentService: loaded', componentObj, '\n' );
		};

	};
	return new Service();

}
