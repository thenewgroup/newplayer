(function () {
  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npQuizSummaryController',
    function ($log, $scope, $rootScope, $sce, $element, $filter,
              i18nService, ManifestService, AssessmentService) {
      var i,
          vm = this,
          cmpData = $scope.component.data;

      $log.info('npQuizSummaryController::Init\n');

      vm.minScore = AssessmentService.getMinPassing();
      vm.score = AssessmentService.getScore();
      vm.isPassing = AssessmentService.isPassing();

      vm.summaryText = '';

      if(  vm.isPassing ) {
        //vm.summaryText = cmpData.feedback.pass;
        vm.summaryText = i18nService.get('pass');
      } else {
        //vm.summaryText = cmpData.feedback.fail;
        vm.summaryText = i18nService.get('fail');
      }

      // replace tokens in the string as we go
      vm.summaryText = vm.summaryText.replace(/:USERSCORE:/, $filter('number')(vm.score * 100, 0));
      vm.summaryText = vm.summaryText.replace(/:MINSCORE:/, $filter('number')(vm.minScore * 100, 0));

      vm.achievementText = '';
      if( cmpData.hasOwnProperty('achievements') ) {
        for (i = 0; i < cmpData.achievements.length; i++) {
          var achievement = cmpData.achievements[i];
          achievement.score = parseFloat(achievement.score);

          if( achievement.compare === 'gte' && vm.score >= achievement.score ) {
            vm.achievementText = achievement.content;
          } else if( achievement.compare === 'gt' && vm.score > achievement.score ) {
            vm.achievementText = achievement.content;
          } else if( achievement.compare === 'eq' && vm.score === achievement.score) {
            vm.achievementText = achievement.content;
          } else if( achievement.compare === 'lte' && vm.score <= achievement.score ) {
            vm.achievementText = achievement.content;
          } else if( achievement.compare === 'lt' && vm.score < achievement.score ) {
            vm.achievementText = achievement.content;
          }
        }
      }

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
