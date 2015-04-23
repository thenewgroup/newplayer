(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npAsQuestionController',
                    function ($log, $scope, $attrs, $rootScope, ManifestService, $sce, $element, AssessmentService) {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set that
                        //////////////////////////////////////////////////////////////////////////////////////
                        var cmpData = $scope.component.data,
                                vm = this;
                        $log.debug('npAsQuestion::data', cmpData);
                        vm.id = cmpData.id;
                        vm.content = $sce.trustAsHtml(cmpData.content);
                        vm.type = cmpData.type;
                        vm.feedback = '';
                        vm.canContinue = false;
                        vm.answers = [];
                        var feedback = cmpData.feedback;
                        var feedbackLabel = $element.find('.question-feedback-label');
                        var feedbackWrapper = $element.find('.question-feedback');
                        var negativeFeedbackIcon = '';
                        var positiveFeedbackIcon = '';
                        var contentAreaHeight = 0;
                        AssessmentService.addQuestion(vm.id, !!cmpData.required);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //build that
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                TweenMax.set(feedbackWrapper, {
                                    autoAlpha: 0,
                                    force3D: true
                                });
                                TweenMax.set($(".response-item"), {
                                    autoAlpha: 0,
                                    scale: 0.5,
                                    force3D: true
                                });
                                TweenMax.staggerTo($(".response-item"), 2, {
                                    scale: 1,
                                    autoAlpha: 1,
                                    delay: 0.75,
                                    ease: Power4.easeOut,
                                    force3D: true
                                }, 0.2);
                            });
                        });
                        vm.registerAnswer = function (idx, answer) {
                            vm.answers[idx] = answer;
                        };
                        vm.update = function (event) {
                            $log.debug('npAsQuestion::answer changed');
                            if (feedback.immediate) {
                                vm.feedback = '';
                                negativeFeedbackIcon = $element.find('.negative-feedback-icon');
                                positiveFeedbackIcon = $element.find('.positive-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {
                                    autoAlpha: 0,
                                    scale: 2.5,
                                    force3D: true
                                });
                                TweenMax.set(positiveFeedbackIcon, {
                                    autoAlpha: 0,
                                    scale: 2.5,
                                    force3D: true
                                });
                            }
                        };
                        vm.evaluate = function () {
                            var answerIdx, chkAnswers,
                                    isCorrectAnswer = true,
                                    $checkbox = false,
                                    $checked = false;
                            negativeFeedbackIcon = $element.find('.negative-feedback-icon');
                            positiveFeedbackIcon = $element.find('.positive-feedback-icon');
                            TweenMax.to(negativeFeedbackIcon, 0.25, {
                                autoAlpha: 0,
                                scale: 2.5,
                                force3D: true
                            });
                            TweenMax.to(positiveFeedbackIcon, 0.25, {
                                autoAlpha: 0,
                                scale: 2.5,
                                force3D: true
                            });
                            //chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
                            //$checkbox = $element.find('.checkbox-x');
                            //$checked = $element.find('.checkbox-x[checked]');
                            $log.debug('npAsQuestion::evaluating type to check', cmpData);
                            switch (cmpData.type) {
                                case 'checkbox':
                                    $log.debug('npAsQuestion::evaluating checkboxes', vm.answers, vm.answers.length);
                                    for (answerIdx in vm.answers) {
                                        var answer = vm.answers[answerIdx];
                                        $log.debug('npAsQuestion: evaluating checkbox', answerIdx, answer);
                                        isCorrectAnswer = isCorrectAnswer && answer.checked === answer.isCorrect;
                                        if (!isCorrectAnswer) {
                                            break;
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
                                    if (!regExp.test(vm.answer)) {
                                        if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.incorrect)) {
                                            vm.feedback = txtAnswer.data.feedback.incorrect;
                                            feedbackLabel.remove();
                                        }
                                        isCorrectAnswer = false;
                                    } else {
                                        if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.correct)) {
                                            vm.feedback = txtAnswer.data.feedback.correct;
                                            feedbackLabel.remove();
                                        }
                                    }
                                    break;
                            }
                            AssessmentService.questionAnswered(vm.id, isCorrectAnswer);
                            $log.debug('npAsQuestion::evaluate:isCorrect', isCorrectAnswer);
                            feedbackLabel.remove();
                            if (isCorrectAnswer) {
                                vm.feedback = feedback.correct;
                                vm.canContinue = true;
                                setTimeout(function () {
                                    $scope.$apply(function () {
                                        if (contentAreaHeight === 0) {
                                            contentAreaHeight = $('.question-feedback-text').outerHeight(true);
                                            TweenMax.set(feedbackWrapper, {
                                                height: 0,
                                                force3D: true
                                            });
                                        }
                                        TweenMax.set($('.question-feedback-text'), {
                                            autoAlpha: 0,
                                            force3D: true
                                        });
                                        TweenMax.to($('.question-feedback-text'), 0.5, {
                                            autoAlpha: 1,
                                            force3D: true,
                                            delay: 0.25,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.to(feedbackWrapper, 0.5, {
                                            autoAlpha: 1,
                                            height: contentAreaHeight + 20,
                                            force3D: true,
                                            ease: Power4.easeOut,
                                            onComplete: function () {
                                                TweenMax.set(positiveFeedbackIcon, {
                                                    top: ((contentAreaHeight / 2) + (positiveFeedbackIcon / 2)),
                                                    force3D: true
                                                });
                                                TweenMax.to(positiveFeedbackIcon, 0.75, {
                                                    autoAlpha: 1,
                                                    scale: 1,
                                                    force3D: true
                                                });
                                            }
                                        });
                                    });
                                });
                            } else {
                                vm.feedback = feedback.incorrect;
                                vm.canContinue = false;
                                setTimeout(function () {
                                    $scope.$apply(function () {
                                        if (contentAreaHeight === 0) {
                                            contentAreaHeight = $('.question-feedback-text').outerHeight(true);
                                            TweenMax.set(feedbackWrapper, {
                                                height: 0,
                                                force3D: true
                                            });
                                        }
                                        TweenMax.to($('.question-feedback-text'), 0.5, {
                                            autoAlpha: 1,
                                            force3D: true,
                                            delay: 0.25,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.set(feedbackWrapper, {
                                            height: 0,
                                            force3D: true
                                        });
                                        TweenMax.to(feedbackWrapper, 0.5, {
                                            autoAlpha: 1,
                                            height: contentAreaHeight + 20,
                                            force3D: true,
                                            ease: Power4.easeOut,
                                            onComplete: function () {
                                                TweenMax.set(negativeFeedbackIcon, {
                                                    top: ((contentAreaHeight / 2) + (negativeFeedbackIcon / 2)),
                                                    force3D: true
                                                });
                                                TweenMax.to(negativeFeedbackIcon, 0.75, {
                                                    autoAlpha: 1,
                                                    scale: 1,
                                                    force3D: true
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                        };
                        vm.nextPage = function (evt) {
                            evt.preventDefault();
                            if (vm.canContinue) {
                                $rootScope.$emit('question.answered', true);
                            }
                        };
                    }
            )
            .directive('questionFeedbackBuild', function () {
                return function ($scope, $element, attrs) {
                    var negativeFeedbackIcon = '';
                    var postiveFeedbackIcon = '';
                    setTimeout(function () {
                        $scope.$apply(function () {
                            function onPageLoadBuild() {
                                negativeFeedbackIcon = $('.negative-feedback-icon');
                                postiveFeedbackIcon = $('.positive-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {autoAlpha: 0, scale: 2.5, force3D: true});
                                TweenMax.set(postiveFeedbackIcon, {autoAlpha: 0, scale: 2.5, force3D: true});
                            }
                            onPageLoadBuild();
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npAsQuestion::component loaded!');
                    }
            );
})();
