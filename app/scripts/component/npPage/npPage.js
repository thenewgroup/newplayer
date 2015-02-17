(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npPageController',
    function ($log, $scope, $rootScope, ManifestService, npAssessment) {
      var i, subquestions, question,
        parentIdx = $scope.component.idx.slice(0),
        pageId = ManifestService.getPageId(),
        cmpData = $scope.component.data || {};
      $log.info('npPage | data, contentTitle', cmpData, $scope.contentTitle);

      this.title = cmpData.title;
      parentIdx.pop();

      if (!pageId) {
        var firstPageCmp = ManifestService.getFirst('npPage', parentIdx);
        pageId = firstPageCmp.data.id;
        ManifestService.setPageId(pageId);
        $log.debug('npPage::set page', pageId);
      }

      npAssessment.addPage(cmpData.id, cmpData.required);

      // find all subquestions of this page, do this here because if we're here
      // the manifest is loaded; npQuestions don't instantiate until the question is
      // viewed and we will need these straightaway

      subquestions = ManifestService.getAll('npQuestion', $scope.component.idx);
      for (i = 0; i < subquestions.length; i++) {
        question = subquestions[i];
        $log.info('npPage:question | ', question);

        npAssessment.addQuestion(question.id, question.required);
      }

      npPageIdChanged(null, pageId);

      $rootScope.$on('npPageIdChanged', npPageIdChanged);

      function npPageIdChanged(event, newPageId) {

        pageId = newPageId;

        // check if current route is for this page
        $log.debug('npPage::on current page?', pageId, cmpData.id);
        if (cmpData.id === pageId) {
          $scope.currentPage = true;
          $scope.npPage = $scope;

          // set page title
          if ($rootScope.PageTitle) {
            $rootScope.PageTitle += ': ' + cmpData.title;
          } else {
            $rootScope.PageTitle = cmpData.title;
          }
          npAssessment.pageViewed(cmpData.id);

        } else {
          $scope.currentPage = false;
        }
      }
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npPage::component loaded!');
    }
  );
})();
