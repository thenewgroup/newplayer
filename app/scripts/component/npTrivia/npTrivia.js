(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npTriviaController',
    function ($log, $scope, $rootScope, ManifestService, $sce, TriviaService) {
      var cmpData = $scope.component.data;
      $log.debug('npQuiz::data', cmpData);

      this.id = cmpData.id;
      this.content = $sce.trustAsHtml(cmpData.content);
      this.type = cmpData.type;
      this.currentPage = 0;
      this.feedback = '';
      this.assment = AssessmentService();

      var pages = $scope.components.length;
      this.assment.setRequirements(pages, pages, null);

      var feedback = cmpData.feedback;
      this.seenComponents = _.shuffle($scope.components);
      TriviaService.hidePages();
      var vm = this;

      $rootScope.$on('question.answered', function (evt, correct) {
      	if (correct) {
      		// TODO - get this to go to the next page corrently
    			vm.assment.pageViewed();
      		vm.currentPage = vm.assment.getPageStats().viewed.total;
      		var page = vm.seenComponents[vm.currentPage].data.id;
		      $rootScope.$broadcast('npPageIdChanged', page);
      	}
      });
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope, AssessmentService) {
      $log.debug('npQuiz::component loaded!');
    }
  );

})();