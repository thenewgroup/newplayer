'use strict';
/** @ngInject */
function APIService( $log, $http/*, $timeout, $q, $state, $rootScope*/ )
{
	$log.debug( '\nApiService: Init\n' );

	var Service = function()
	{
		var self = this;
		var promise = null;
		var manifestURL = null;

		function getPromise()
		{
			return self.promise;
		}
		function setPromise( promise )
		{
			self.promise = promise;
		}

		function getManifestURL()
		{
			return self.manifestURL;
		}
		function setManifestURL( url )
		{
			self.manifestURL = url;
		}
		this.getManifestURL = function()
		{
			return getManifestURL();
		};

		this.initialize = function( npConfig, manifestId )
		{
			$log.debug( 'APIService: initialize:', npConfig, manifestId );
			var manifestURL = npConfig[0].manifestURL;
			if ( !!manifestURL )
			{
				setManifestURL( manifestURL.replace( '{manifestId}', manifestId ) );
			} else {
				setManifestURL( 'sample.json' );
			}
		};

		this.getData = function( url )
		{
			$log.debug( 'APIService: getData: URL:', url );
			if ( !getPromise() )
			{
				var aPromise =
					$http.get(
						url,
						{
							cache: true,
							transformRequest: function(data)
							{
								return JSON.stringify(data);
							}
						}
					)
					.then(
						function(data)
						{
							$log.debug( 'APIService: Received data from server ', data );
							return data.data;
						}
					);
				setPromise( aPromise );
				$log.debug( 'APIService: new promise:', getPromise() );
			} else {
				$log.debug( 'APIService: old promise:', getPromise() );
			}
			return getPromise();
		};

		this.reset = function()
		{
			setPromise( null );
		};

/*,
		sendData:function(data){
			$log.debug('APIService::Sending data to '+baseUrl+'/npAPI/',data);
			return $http({
				method: 'POST',
				url: baseUrl+'/npAPI/',
				data: data
			});
		}
*/
	};
	return new Service();

}

