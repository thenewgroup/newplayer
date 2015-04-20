(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npAsAnswerController',
                    function ($log, $scope, $sce, $element) {
                        var vm = this;
                        var cmpData = $scope.component.data || {};
                        this.id = cmpData.id;
                        this.label = $sce.trustAsHtml(cmpData.label);

//                                checkmark = $element.find('svg#Layer_1'),
//                                cmpData = $scope.component.data || {}; // already defined above
                        vm.isCorrect = cmpData.correct;
                      // updateCheck is currently not defined but needed. Should it be the code below?
                      var updateCheck = angular.noop;
//                        var updateCheck = function () {
//                            var tweenOptions = {ease: Power3.easeOut};

//                            if (vm.checked) {
//                                tweenOptions.autoAlpha = 1;
//                            } else {
//                                tweenOptions.autoAlpha = 0;
//                            }
                        //$log.debug('updateCheck', checkmark, tweenOptions);
//                            TweenMax.to(checkmark, 0.25, tweenOptions);
//                        };
                        //$log.debug('npAsAnswer::data', cmpData);
                        vm.id = cmpData.id;
                        vm.label = $sce.trustAsHtml(cmpData.label);
                        vm.question = null;
                        vm.checked = false;
                        vm.answer = vm;

                        vm.setQuestion = function (idx, question) {
                          $log.debug('setQuestion', idx, question);
                            //$scope.question = question;
                            question.registerAnswer(idx, this);
                        };


//                        vm.clicked = function ($event) {
//                            //$log.debug('npAsAnswer clicked', $event, cmpData);
//                            if (vm.question.type === 'checkbox') {
//                                vm.checked = !vm.checked;
//                                vm.question.answerChanged(vm);
//                            } else if (vm.question.type === 'radio') {
//                                vm.checked = true;
//                                vm.question.answerChanged(vm);
//                            }
////                            updateCheck();
//                        };
//                        vm.clear = function () {
//                            vm.checked = false;
////                            updateCheck();
//                        };
                    }
            )
            .directive('npAsAnswerCheckbox', function () {
                return function ($scope, $element, $sce, $log) {
                    var cmpData = $scope.component.data || {};
//                    this.label = $sce.trustAsHtml(cmpData.label);

                    setTimeout(function () {
                        $scope.$apply(function () {
                            //////////////////////////////////////////////////////////////////////////////////////
                            //set states
                            //////////////////////////////////////////////////////////////////////////////////////
                            var checkboxX = $element.find('.checkbox-x');
                            TweenMax.set(checkboxX, {autoAlpha: 0, scale: 2.5, force3D: true});
                            $scope.update = function (event) {

                                var clickedCheckbox = event.currentTarget;
                                var $checkbox = $(clickedCheckbox).find('.checkbox-x');
                                $checkbox.attr('checked', !$checkbox.attr('checked'), ('true'));
                                //////////////////////////////////////////////////////////////////////////////////////
                                //update states on click
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ($checkbox.attr('checked') === 'checked') {
//                                    console.log(
//                                            '\n::::::::::::::::::::::::::::::::::::::npAsAnswerCheckbox::inside:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                            '\n::this::', this,
//                                            '\n::this.npAsAnswer::', this.npAsAnswer,
//                                            '\n::this.label::', this.label,
//                                            '\n::$checkbox.attr(checked)::', $checkbox.attr('checked'),
//                                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                            );

                                    $scope.npAnswer.checked = true;
                                    TweenMax.to($(clickedCheckbox).find('.checkbox-x'), 0.75, {
                                        autoAlpha: 1,
                                        scale: 0.7,
                                        ease: Power3.easeOut
                                    });
                                } else if ($checkbox.attr('checked') !== 'checked') {
                                    TweenMax.to($(clickedCheckbox).find('.checkbox-x'), 0.25, {
                                        autoAlpha: 0,
                                        scale: 2.5,
                                        ease: Power3.easeOut
                                    });

                                  $scope.npAnswer.checked = false;
                                }

                              //console.debug('npAsAnswer directive answer changed', $scope.npQuestion, $scope.npAnswer);
                              //$scope.npQuestion.answerChanged($scope.answer);
                            };
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        //$log.debug('npAsAnswer::component loaded!');
                    }
            );
})();



