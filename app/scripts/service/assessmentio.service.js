/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .service('AssessmentIOService', AssessmentIO);

  /** @ngInject */
  function AssessmentIO($log) {
    var vm = this;

    vm.updateQuestion = function(questionID, assessment) {
      $log.debug('AssessmentIO::updateQuestion function stub', questionID, assessment);
    };

    vm.updatePage = function(pageID, assessment) {
      $log.debug('AssessmentIO::updatePage function stub', pageID, assessment);
    };

    vm.updateFinal = function(assessment) {
      $log.debug('AssessmentIO::updateFinal function stub', assessment);
    };

    vm.retrieve = function() {
      $log.debug('AssessmentIO.log::retrieve function stub');
    };
  }
})();
