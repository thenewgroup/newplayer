'use strict';

/** @ngInject */
function AppController( $log, StoreDriverService/*, ImagePreloadFactory, HomeService, $scope*/ )
{
	$log.info('AppController::Init');

        var storeDriver = StoreDriverService.getDriver('scorm');

        if( storeDriver.isAvailable ) {
          $log.info('student name', storeDriver.student.name);
          $log.info('student language', storeDriver.student.language);
        } else {
          $log.error('storeDriver indicates a required resource is not available');
        }


        try { storeDriver.isLessonComplete(); } catch (e) { $log.error(e); }
        try { storeDriver.setLessonComplete(true); } catch (e) { $log.error(e); }
        try { storeDriver.getProgress(); } catch (e) { $log.error(e); }
        try { storeDriver.setProgress({a:'b', c:'d'}); } catch (e) { $log.error(e); }




	/*
    var loader = ImagePreloadFactory.createInstance();
    loader.addImages([
      '/images/bigBlueArrow.png'
    ]);
    loader.start();
	*/
	/*
    $scope.date = new Date().getFullYear();
    var cover = (function(){
      var supported = ('backgroundSize' in document.documentElement.style);
      if(supported){
        var temp = document.createElement('div');
        temp.style.backgroundSize = 'cover';
        supported = temp.style.backgroundSize == 'cover';
      }
      return supported;
    })();
	*/
	/*
    $scope.coverSupported = cover;
    if (isMobile.other.windows){
      $scope.coverSupported = false;
    }
	*/
}
