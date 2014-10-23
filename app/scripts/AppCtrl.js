'use strict';

/** @ngInject */
function AppController( $log/*, ImagePreloadFactory, HomeService, $scope*/ )
{
	$log.debug('AppController: Init');
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
