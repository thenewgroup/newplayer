'use strict';
angular
        .module('npQuestionImmediate', ['npQuestionImmediateFeedbackBuildDirective']);
angular
        .module('npQuestionImmediate')
        /** @ngInject */
        .controller('npQuestionImmediateController',
                function ($log, $scope, $attrs, $rootScope, ManifestService, $sce, $element) {
                    //////////////////////////////////////////////////////////////////////////////////////
                    //set that 
                    //////////////////////////////////////////////////////////////////////////////////////
                    var cmpData = $scope.component.data;
                    var feedback = $scope.component.data.feedback;
                    var feedbackLabel = $element.find('.question-feedback-label');
                    var feedbackWrapper = $element.find('.question-immediate-feedback');
                    var negativeFeedbackIcon = '';
                    var positiveFeedbackIcon = '';
                    var contentAreaHeight = 0;
                    this.id = cmpData.id;
                    this.content = $sce.trustAsHtml(cmpData.content);
                    this.questionLabel = cmpData.questionLabel;
                    this.answerLabel = cmpData.answerLabel;
                    this.submitLabel = cmpData.submitLabel;
                    this.questionImage = $sce.trustAsHtml(cmpData.questionImage);
                    this.type = cmpData.type;
                    this.feedback = '';
                    this.canContinue = false;
                    setTimeout(function () {
                        $scope.$apply(function () {
                            TweenMax.set(feedbackWrapper, {
                                autoAlpha: 0,
                                force3D: true
                            });
                            TweenMax.set($(".response-item"), {
                                autoAlpha: 0,
                                marginTop: '-500px',
                                force3D: true
                            });
                            $log.debug('npQuestionImmediate::answer changed::update::feedback.immediate:', feedback.immediate);
                            if (feedback.immediate) {
                                TweenMax.set($(".btn-submit"), {
                                    autoAlpha: 0
                                });
                            }
                            //////////////////////////////////////////////////////////////////////////////////////
                            //build that out
                            //////////////////////////////////////////////////////////////////////////////////////
                            TweenMax.staggerTo($(".response-item"), 1.75, {
                                marginTop: '10px',
                                autoAlpha: 1,
                                delay: 0.25,
                                ease: Power4.easeOut,
                                force3D: true
                            }, 0.2);
                        });
                    });
                    this.update = function (event) {
                        $log.debug('npQuestionImmediate::answer changed');
                        if (feedback.immediate) {
                            $log.debug('npQuestionImmediate::answer changed::update::feedback.immediate:', feedback.immediate);
                            this.evaluate();
                        }
                    };
                    this.evaluate = function () {
                        var correct = true;
                        var $checkbox = false;
                        var $checked = false;
                        TweenMax.to($('.question-immediate-response-column-wrapper'), 0.75, {
                            autoAlpha: 0,
                            height: 0,
                            force3D: true,
                            ease: Power4.easeOut
                        });
                        var chkAnswers = ManifestService.getAll('npAnswerImediate', $scope.cmpIdx);
                        $log.debug('npQuestionImmediate::evaluate:', this.answer);
                        if (!!$checked) {
                            switch (this.type) {
                                case 'checkbox':
                                    var idx;
                                    var $currentCheckbox;
                                    for (idx in chkAnswers) {
                                        $currentCheckbox = $($checkbox[idx]);
                                        if (chkAnswers[idx].data.correct) {
                                            //////////////////////////////////////////////////////////////////////////////////////
                                            // confirm all correct answers were checked
                                            //////////////////////////////////////////////////////////////////////////////////////
                                            if (!$currentCheckbox.attr('checked')) {
                                                correct = false;
                                            }
                                        } else {
                                            //////////////////////////////////////////////////////////////////////////////////////
                                            // confirm no incorrect answers were checked
                                            //////////////////////////////////////////////////////////////////////////////////////
                                            if (!!$currentCheckbox.attr('checked')) {
                                                correct = false;
                                            }
                                        }
                                    }
                                    break;
                                case 'text':
                                    var txtAnswer = ManifestService.getFirst('npAnswerImediate', $scope.cmpIdx);
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
                                        if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.incorrect)) {
                                            this.feedback = txtAnswer.data.feedback.incorrect;
                                            feedbackLabel.remove();
                                        }
                                        correct = false;
                                    } else {
                                        if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.correct)) {
                                            this.feedback = txtAnswer.data.feedback.correct;
                                            feedbackLabel.remove();
                                        }
                                    }
                                    break;
                            }
                        } else {
                            correct = false;
                        }
                        $log.debug('npQuestionImmediate::evaluate:isCorrect', correct);
                        feedbackLabel.remove();
                        if (correct) {
                            this.feedback = feedback.correct;
                            this.canContinue = true;
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
                                        height: contentAreaHeight + 40,
                                        force3D: true,
                                        ease: Power4.easeOut
                                    });
                                });
                            });
                        } else {
                            this.feedback = feedback.incorrect;
                            this.canContinue = false;
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    if (contentAreaHeight === 0) {
                                        contentAreaHeight = $('.question-immediate-feedback-text').outerHeight(true);
                                        TweenMax.set(feedbackWrapper, {
                                            height: 0,
                                            force3D: true
                                        });
                                    }
                                    TweenMax.to($('.question-immediate-feedback-text'), 0.5, {
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
                                        height: contentAreaHeight + 40,
                                        force3D: true,
                                        ease: Power4.easeOut
                                    });
                                });
                            });
                        }
                    };
                    this.nextPage = function (evt) {
                        evt.preventDefault();
                        if (this.canContinue) {
                            $rootScope.$emit('question.answered', true);
                        }
                    };
                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npQuestionImmediate::component loaded!');
                }
        );
angular.module('npQuestionImmediateFeedbackBuildDirective', [])
        .directive('questionImmediateFeedbackBuild', function () {
            return function ($scope, $element, attrs) {
                setTimeout(function () {
                    $scope.$apply(function () {
                        onPageLoadBuild();
                    });
                });
            };
        });