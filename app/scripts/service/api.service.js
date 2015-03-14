(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .factory('APIService', APIService);

  /** @ngInject */
  function APIService($log, $http/*, $timeout, $q, $rootScope*/) {
    $log.debug('\nApiService: Init\n');

    var Service = function () {
      var self = this;

      this.getData = function (url) {
        $log.debug('APIService::getData: URL:', url);
        var aPromise =
          $http.get(
            url,
            {
              cache: true
            }
          )
            .then(
            function (data) {
              $log.debug('APIService::Received data from server ', data);
              return data.data;
            }
          );
        return aPromise;
      };

      this.postData = function (url) {
        $log.debug('APIService::postData: URL:', url);
        var aPromise =
          $http.post(
            url,
            {
              cache: true
            }
          )
            .then(
            function (data) {
              $log.debug('APIService::Received data from server ', data);
              return data.data;
            }
          );
        return aPromise;
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

})();
