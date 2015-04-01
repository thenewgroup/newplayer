(function () {
  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npAnswerController',
    function ($log, $scope, $sce, $element) {
      var vm = this,
          checkmark = $element.find('svg#Layer_1'),
          cmpData = $scope.component.data || {};

      vm.isCorrect = cmpData.correct;


      var updateCheck = function() {
        var tweenOptions = {ease: Power3.easeOut};

        if( vm.checked ) {
          tweenOptions.autoAlpha = 1;
        } else {
          tweenOptions.autoAlpha = 0;
        }

        $log.debug('updateCheck', checkmark, tweenOptions);
        TweenMax.to(checkmark, 0.25, tweenOptions);
      };

      $log.debug('npAnswer::data', cmpData);
      vm.id = cmpData.id;
      vm.label = $sce.trustAsHtml(cmpData.label);
      vm.question = null;
      vm.checked = false;

      vm.setQuestion = function(idx, question) {
        vm.question = question;
        question.registerAnswer(idx, this);
      };

      vm.clicked = function($event) {
        $log.debug('npAnswer clicked', $event, cmpData);


        if( vm.question.type === 'checkbox' ) {
          vm.checked = !vm.checked;
          vm.question.answerChanged(vm);
        } else if( vm.question.type === 'radio' ) {
          vm.checked = true;
          vm.question.answerChanged(vm);
        }

        updateCheck();
      };

      vm.clear = function() {
        vm.checked = false;
        updateCheck();
      };

    }
  )
  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npAnswer::component loaded!');
    }
  );
})();
