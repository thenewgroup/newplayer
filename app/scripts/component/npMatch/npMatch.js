/* jshint -W003, -W117 */
(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npMatchController',
    function ($log, $scope, $rootScope, $timeout, ManifestService, $sce, sliders) {
      var cmpData = $scope.component.data;
      $log.debug('npQuestion::data', cmpData);

      this.id = cmpData.id;
      this.content = $sce.trustAsHtml(cmpData.content);
      this.type = cmpData.type;
      this.feedback = '';
      this.canContinue = false;
      var self = this;

      var feedback = cmpData.feedback;

      this.changed = function () {
        $log.debug('npQuestion::answer changed');
        if (feedback.immediate) {
          this.feedback = '';
        }
      };

      this.evaluate = function () {
        var correct = true;
        var allCorrect = true;
        $log.debug('npQuestion::evaluate:', this.answer);
        var answer;
        _.each(sliders, function (slide) {
          var s = slide.currSlide.holder;
          var cmp = ManifestService.getComponent(s.children().attr('idx'));
          var cmpData  = cmp.data;
          if (!answer) {
            answer = cmpData.correct;
            return;
          } else {
            if (cmpData.correct === answer) {
              return;
            }
           correct = false;
          }
        });

        $log.debug('npMatch::evaluate:isCorrect', correct);

        // set by ng-model of npAnswer's input's
        if (feedback.immediate) {
          if (correct) {
            $rootScope.$emit('slider-disable-wrong');
            this.feedback = feedback.correct;
            this.feedbackBad = false;
          } else {
            this.feedback = feedback.incorrect;
            this.feedbackBad = true;
          }
        }

        // timeout and wait for dom manipulation to finish
        $timeout(function () {
          // check that alll are matched
          _.each(sliders[0].slidesJQ, function (slide) {
            if (!slide.data('correct')) {
              allCorrect = false;
              return false;
            }
          });

          if (allCorrect) {
              self.canContinue = true;
          }
        });
      };

      this.nextPage = function (evt) {
        // TODO - have a better way to go to the next page in the manifest service
        // si: I'd like to see a next page and previous page methods
        ManifestService.goToNextPage();
        evt.preventDefault();
      };
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npQuestion::component loaded!');
    }
  );
})();
