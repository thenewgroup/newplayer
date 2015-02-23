(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npTriviaController',
    function ($log, $scope, ManifestService, $sce) {
      var cmpData = $scope.component.data;
      $log.debug('npQuiz::data', cmpData);

      this.id = cmpData.id;
      this.content = $sce.trustAsHtml(cmpData.content);
      this.type = cmpData.type;
      this.feedback = '';

      var feedback = cmpData.feedback;
      this.seenComponents = _.shuffle($scope.components);

      this.changed = function () {
        $log.debug('npQuiz::answer changed');
        if (feedback.immediate) {
          this.feedback = '';
        }
      };

      this.evaluate = function () {
        $log.debug('npQuiz::evaluate:', this.answer);
        var correct = true;

        if (!!this.answer) {
          switch (this.type) {
            case 'radio':
              var radAnswer = ManifestService.getComponent(this.answer);
              if (!radAnswer.data.correct) {
                correct = false;
              }
              break;
            case 'checkbox':
              var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
              var idx;
              for (idx in chkAnswers) {
                if (chkAnswers[idx].data.correct) {
                  // confirm all correct answers were checked
                  if (!this.answer[chkAnswers[idx].idx]) {
                    correct = false;
                  }
                } else {
                  // confirm no incorrect answers were checked
                  if (this.answer[chkAnswers[idx].idx]) {
                    correct = false;
                  }
                }
              }
              break;
            case 'text':
              var txtAnswer = ManifestService.getFirst('npAnswer', $scope.cmpIdx);
              var key = txtAnswer.data.correct;
              var regExp, pat, mod = 'i';
              if (angular.isString(key)) {
                if (key.indexOf('/') === 0) {
                  pat = key.substring(1, key.lastIndexOf('/'));
                  mod = key.substring(key.lastIndexOf('/') + 1);
                }
              } else if (angular.isArray(key)) {
                pat = '^(' + key.join('|') + ')$';
              }
              regExp = new RegExp(pat, mod);
              if (!regExp.test(this.answer)) {
                correct = false;
              }
              break;
          }
        } else {
          correct = false;
        }
        $log.debug('npQuiz::evaluate:isCorrect', correct);

        // set by ng-model of npAnswer's input's
        if (feedback.immediate) {
          if (correct) {
            this.feedback = feedback.correct;
          } else {
            this.feedback = feedback.incorrect;
          }
        }
      };
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npQuiz::component loaded!');
    }
  );

})();