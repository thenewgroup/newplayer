/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .service('AssessmentIO', AssessmentIO);

  /** @ngInject */
  function AssessmentIO($log) {
    var vm = this;

    vm.updateQuestion = function(questionID, pagesState, questionsState) {
      $log.debug('AssessmentIO::updateQuestion function stub', questionID, pagesState, questionsState);
    }

    vm.updatePage = function(pageID, pagesState, questionsState) {
      $log.debug('AssessmentIO::updatePage function stub', questionID, pagesState, questionsState);
    }

    vm.retrieve = function() {
      $log.debug('AssessmentIO.log::retrieve function stub');
    }
  }
});
