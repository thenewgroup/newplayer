'use strict';

/*
 * console:
 * angular.element(document.body).injector().get('ManifestService')
 */

/** @ngInject */
function ManifestService( $log, APIService/*, $timeout, $http, $q, $state, $rootScope,*/ )
{
	$log.debug('\nManifestService: Init\n');

	var Service = function()
	{
		var self = this;
		var manifestId;  // unique ID of manifest defined by CMS (manifest generator)
		var data;
		var promise;

		var componentIdx;

		// if these are not defined by the route
		// the manifest components will teach this service
		// what the values should be
		var lang;
		var pageId;

		function getPromise()
		{
			return promise;
		}
		function setPromise( prms )
		{
			promise = prms;
		}

		function getComponentIdx()
		{
			return componentIdx;
		}
		this.getComponentIdx = getComponentIdx;
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

		this.loadData = function( manifestId )
		{
			if ( !this.getData() || manifestId !== this.getManifestId() )
			{
				APIService.reset();
				setComponentIdx( null );
				this.setManifestId( manifestId );
				$log.debug('ManifestService: loadData:', manifestId);
				var aPromise =
					APIService.getData( manifestId ).then
					(
						function(res)
						{
							$log.debug('ManifestService: loadData: success', res);
							return res;
						}
					);
				setPromise( aPromise );
			} else {
				$log.debug( 'ManifestService: loadData: data already loaded:', this.getData() );
			}
			return getPromise();
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
			$log.debug('ManifestService:: getComponent', idx, this.getCount );

			// FIXME - temporary hack to prevent buggy infinite loops
			this.getCount++;

			var cmp;
			if ( !idx )
			{
				// idx not specified, get next using services idx
				$log.debug('ManifestService:: getComponent: getNextComponent' );
				cmp = getNextComponent();
				// set it's index
				if ( !!cmp )
				{
					cmp.idx = getComponentIdx().slice(0);
					$log.debug('ManifestService:: getComponent: set cmp idx', cmp );
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
				$log.debug('ManifestService:: getComponent: set serv idx', idx );

				// traverse idx array to get to this particular cmp
				cmp = this.getData()[ idx[0] ];
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
					$log.debug('ManifestService:: getComponent: bad idx', idx );
				}
			}
			return cmp;
		};

		this.getPage = function( lang, pageId )
		{
			return;
		};

		this.getManifestId = function()
		{
			return this.manifestId;
		};
		this.setManifestId = function(manifestId)
		{
			this.manifestId = manifestId;
		};

		this.getData = function()
		{
			$log.debug('ManifestService: getData', this.data);
			return this.data;
		};
		this.setData = function(data)
		{
			this.data = data;
		};

		this.getLang = function()
		{
			if (!this.lang)
			{
				// determine lang from data
				this.setLang( 'en-US' );
			}
			return this.lang;
		};
		this.setLang = function(lang)
		{
			this.lang = lang;
		};

		this.getPageId = function()
		{
			if (!this.pageId)
			{
				// determine default pageId from data
				this.setPageId( 'page1' );
			}
			return this.pageId;
		};
		this.setPageId = function(pageId)
		{
			this.pageId = pageId;
		};

	};
	return new Service();

}
