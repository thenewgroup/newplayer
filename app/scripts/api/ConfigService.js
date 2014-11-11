'use strict';

/** @ngInject */
function ConfigService( $log, APIService, ManifestService/*, $timeout, $q, $state, $rootScope*/ )
{
	$log.debug('configService::Init');

	var Service = function()
	{
		var self = this;
		var configData = null;
		var manifestId = null;
		var manifestURL = null;

		this.setManifestId = function( id )
		{
			$log.debug( 'ConfigService::setManifestId', id );
			self.manifestId = id;
		};
		this.getManifestId = function()
		{
			return self.manifestId;
		};

		function setManifestURL( url )
		{
			self.manifestURL = url;
		}
		this.getManifestURL = function()
		{
			return self.manifestURL;
		};

		function initialize( npConfig )
		{
			$log.debug( 'ConfigService::initialize:', arguments );
			var manifestURL = npConfig[0].manifestURL;
			if ( !!manifestURL )
			{
				setManifestURL( manifestURL.replace( '{manifestId}', self.getManifestId() ) );
			} else {
				setManifestURL( 'sample.json' );
			}
		}

		function setConfig( data )
		{
			$log.debug( 'ConfigService::setConfigData:', data );
			self.configData = data[0];
		}
		this.getConfig = function( )
		{
			return self.configData;
		};
		this.getConfigData = function( url )
		{
			$log.debug( 'ConfigService::getConfigData:', url );
			var aPromise = self.getData( url );
			aPromise.then(
				function( configData ) {
					$log.debug( 'ConfigService:: data from server ', configData );
					initialize( configData );
					setConfig( configData );
				}
			);
			return aPromise;
		};

	};

	var configService = new Service();
	angular.extend( configService, APIService );

	$log.debug( 'ConfigService::', configService );
	return configService;

}
