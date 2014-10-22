'use strict';
/** @ngInject */
function APIService( $log, $timeout, $http, $q, $state, $rootScope )
{
	var baseUrl = '';
	$log.debug( 'ApiService: Init', 'base url:', baseUrl );
	var promise;
	return {
		getData: function( manifestId )
		{
			$log.debug( 'APIService: current promise:', this.getPromise() );
			if ( !this.getPromise() )
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
							$log.debug( "APIService: Received data from server ", data );
							return data.data;
						}
					);
				this.setPromise( aPromise );
				$log.debug( 'APIService: new promise:', this.getPromise() );
			}
			return this.getPromise();
		},
		getPromise: function()
		{
			return this.promise;
		},
		setPromise: function( promise )
		{
			this.promise = promise;
		}
		/*,
    sendData:function(data){
      $log.debug("APIService: Sending data to "+baseUrl+'post.ashx becasue detected hostname is '+location.hostname,data);
      return $http({
        method: 'POST',
        url: baseUrl+'post.ashx',
        data: data
      });
    },
    getSavedList:function(id){
      $log.debug("APIService: Getting saved list from server for ID "+id);
      return $http({
        method: 'GET',
        url: baseUrl+'get.ashx?unique_id='+id
      });
    }
		*/
	};
}
