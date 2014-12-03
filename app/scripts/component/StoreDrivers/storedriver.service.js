'use strict';

/** @ngInject */
function StoreDriverService ( $log ) {

  // TODO: this should discern the driver from config.json (however that's loaded) and then should
  // instantiate that driver and be able to return the instance to whomever asks.

  //var STOREDRIVER_INVALID = "STOREDRIVER_INVALID";
  //
  //var service = {
  //  getDriver: getDriver,
  //  STOREDRIVER_INVALID: STOREDRIVER_INVALID
  //};
  //
  //function getDriver(driverNamed) {
  //
  //  switch(driverNamed) {
  //    case 'scorm': return new ScormDriver($log); break;
  //
  //    default:
  //      $log.error("No store driver responding to ", driverNamed);
  //          throw STOREDRIVER_INVALID;
  //  }
  //}

  // This is a good idea, maybe just not how Angular does things? --dw
  //
  //function addDriver(driverNamed, driverClass) {
  //
  //  var existingKeys = Object.keys(drivers);
  //
  //  if( existingKeys.indexOf(driverNamed) !== -1 ) {
  //    $log.warn("StoreDriverService: replacing existing driver", driverNamed, driverClass);
  //  }
  //
  //  drivers[driverNamed] = driverClass;
  //}

  //return service;
}
