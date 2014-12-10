'use strict';

/** @ngInject */
function StoreDriverService ( $log, $q, ConfigService ) {

   $log.info('StoreDriverService::Init');


  var constants = {
      STOREDRIVER_INVALID: 'STOREDRIVER_INVALID'
    };


  function getDriver(storeDriver) {
    switch(storeDriver) {
      case 'scorm': return new ScormDriver($log);
    }
    $log.error('No store driver responding to ', storeDriver);
    return constants.STOREDRIVER_INVALID;
  }

  var service = {
    getDriver: getDriver,
    constants: constants  
  };

  // This is a good idea, maybe just not how Angular does things? --dw
  //
  //function addDriver(driverNamed, driverClass) {
  //
  //  var existingKeys = Object.keys(drivers);
  //
  //  if( existingKeys.indexOf(driverNamed) !== -1 ) {
  //    $log.warn('StoreDriverService: replacing existing driver', driverNamed, driverClass);
  //  }
  //
  //  drivers[driverNamed] = driverClass;
  //}

  return service;
}
