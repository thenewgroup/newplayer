/* jshint -W004 */
(function () {

  'use strict';
  angular
    .module('newplayer')
    .controller('AppController', AppController)
    .value('sliders', {});

  /** @ngInject */
  function AppController($log, $scope, AssessmentService/*, ImagePreloadFactory, HomeService, $scope*/) {
    $log.debug('AppController::Init');


    $scope.seePlayerConfigInAppCtrlJS = {
      manifestId: 'sample',
      manifestURL: '/sample.json',
      overrideURL : '/sample-override.json',
      overrideData: {},
      language: 'en-us',
      assessment: {
        minPassing: 0.75
      }
	};

    var vm = this;
    vm.doTrack = function (event, data) {
      $log.warn('AppController', event, data);
    };

    //AssessmentService.setRequirements(10,5,0.8);
    //
    //$log.info('Initial------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //AssessmentService.questionCorrectlyAnswered('fq', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //AssessmentService.pageViewed('fake non-required', false);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //AssessmentService.pageViewed('fake required', true);
    //
    //$log.info('------------------------');
    //$log.info('Current Score', AssessmentService.getScore());
    //$log.info('Passing', AssessmentService.isPassing());
    //
    //
    //
    //$log.info('Page stats', AssessmentService.getPageStats());
    //$log.info('Question stats', AssessmentService.getQuestionStats());


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
})();
