(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npMatchController',
    function ($log, $scope, $rootScope, ManifestService, $sce, sliders) {
      var cmpData = $scope.component.data;
      $log.debug('npQuestion::data', cmpData);

      this.id = cmpData.id;
      this.content = $sce.trustAsHtml(cmpData.content);
      this.type = cmpData.type;
      this.feedback = '';
      this.canContinue = false;

      var feedback = cmpData.feedback;

      this.changed = function () {
        $log.debug('npQuestion::answer changed');
        if (feedback.immediate) {
          this.feedback = '';
        }
      };

      this.evaluate = function () {
        var correct = true;
        $log.debug('npQuestion::evaluate:', this.answer);
        _.each(sliders, function (slide) {
          var s = slide.currSlide.holder;
          var cmp = ManifestService.getComponent(s.children().attr('idx'));
          var cmpData  = cmp.data;
          if (cmpData.correct) {
            return;
          } else {
           correct = false;
          }
        });
        $log.debug('npQuestion::evaluate:isCorrect', correct);

        // set by ng-model of npAnswer's input's
        if (feedback.immediate) {
          if (correct) {
            $rootScope.$emit('slider-disable-wrong');
            this.feedback = feedback.correct;
            this.canContinue = true;
          } else {
            $rootScope.$emit('slider-enable-all');
            this.feedback = feedback.incorrect;
            this.canContinue = false;
          }
        }
      };

      this.nextPage = function (evt) {
        if (correct) {
          // TODO - go to next page if there is one
        }
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