(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npQuizController',
    function ($log, $scope, AssessmentService) {
      var minPassing, cmpData = $scope.component.data;
      $log.debug('npQuiz::data', cmpData);

      if( cmpData.hasOwnProperty('assessed') && parseInt(cmpData.assessed) === 1 ) {
        if( cmpData.hasOwnProperty('percentage') ) {
          minPassing = parseFloat(cmpData.percentage);

          if( minPassing > 1) {
            minPassing = minPassing / 100;
          }
        }

        AssessmentService.beginFor(cmpData.id, minPassing);
      } else {
        AssessmentService.reset();
      }

      if( cmpData.hasOwnProperty('questions') ) {
        $log.debug('has questions property');
        AssessmentService.setRequiredQuestions(parseInt(cmpData.questions));
      }
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npQuiz::component loaded!');
    }
  );

})();
