'use strict';

/** @ngInject */
function StoreDriverService ( $log, $q, ConfigService ) {

   $log.info('StoreDriverService::Init');

  var constants = {
      STOREDRIVER_INVALID: 'STOREDRIVER_INVALID'
    };

  /**
   * Gets a storage driver for student data.
   *
   * @param string storeDriver Currently only 'scorm' is supported.
   * @return mixed StoreDriver instance or constant string
   */
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

  return service;
}
