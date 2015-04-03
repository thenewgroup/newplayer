(function () {
  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npQuizSummaryController',
    function ($log, $scope, $rootScope, $sce, $element,
              ManifestService, AssessmentService) {
      var vm = this;
        $log.info('npQuizSummaryController::Init\n');

        vm.minScore = AssessmentService.getMinPassing() * 100;
        vm.score = AssessmentService.getScore() * 100;
        vm.isPassing = AssessmentService.isPassing();



        // TODO: This should probably have a "calculating..." spinner here
        // and then once the score is saved on the server and it lets us know
        // their badge status, then we show the goods?
        if( vm.score === 100 ) {
          vm.badgeEarned = true;
        } else {
          vm.badgeEarned = false;
        }

        AssessmentService.finalize();
    });
})();
