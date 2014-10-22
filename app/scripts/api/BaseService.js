'use strict';
/** @ngInject */
function BaseService($log,$timeout,$http,$q,$state,$rootScope) {
  $log.debug('baseService: Init');
  return {
    getTitle:getDisplayName
  };

  function getDisplayName(){
    return data.name+' '+data.type;
  }
}
