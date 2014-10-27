'use strict';
/** @ngInject */
function APIService( $log, $timeout, $http/*, $q, $state, $rootScope*/ )
{
	$log.debug( '\nApiService: Init\n' );

	var Service = function()
	{
		var self = this;
		var baseUrl = '';
		var promise = null;

		function getPromise()
		{
			return self.promise;
		}
		function setPromise( promise )
		{
			self.promise = promise;
		}

		this.getData = function( manifestId )
		{
			$log.debug( 'APIService: current promise:', getPromise() );
			if ( !getPromise() )
			{
				var aPromise =
					$http.get(
						baseUrl + manifestId + '.json',
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

