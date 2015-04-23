(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npQuestionController',
                    function ($log, $scope, $attrs, $rootScope, ManifestService, $sce, $element) {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set that 
                        //////////////////////////////////////////////////////////////////////////////////////
                        var cmpData = $scope.component.data;
                        $log.debug('npQuestion::data', cmpData);
                        this.id = cmpData.id;
                        this.content = $sce.trustAsHtml(cmpData.content);
                        this.type = cmpData.type;
                        this.feedback = '';
                        this.canContinue = false;
                        var feedback = cmpData.feedback;
                        var feedbackLabel = $element.find('.question-feedback-label');
                        var feedbackWrapper = $element.find('.question-feedback');
                        var negativeFeedbackIcon = '';
                        var positiveFeedbackIcon = '';
                        var contentAreaHeight = 0;
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
                        this.update = function (event) {
                            $log.debug('npQuestion::answer changed');
                            if (feedback.immediate) {
                                this.feedback = '';
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
                        this.evaluate = function () {
                            var correct = true;
                            var $checkbox = false;
                            var $checked = false;
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
                            var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
                            $checkbox = $element.find('.checkbox-x');
                            $checked = $element.find('.checkbox-x[checked]');
                            $log.debug('npQuestion::evaluate:', this.answer);
//                            if (!!this.answer) {
                            if (!!$checked) {
                                switch (this.type) {
                                    case 'checkbox':
                                        //var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx); // defined above
                                        var idx;
                                        var $currentCheckbox;
                                        for (idx in chkAnswers) {
                                            $currentCheckbox = $($checkbox[idx]);
                                            if (chkAnswers[idx].data.correct) {
                                                // confirm all correct answers were checked
                                                if (!$currentCheckbox.attr('checked')) {
                                                    correct = false;
                                                }
                                            } else {
                                                // confirm no incorrect answers were checked
                                                if (!!$currentCheckbox.attr('checked')) {
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
                            $log.debug('npQuestion::evaluate:isCorrect', correct);
                            feedbackLabel.remove();
                            if (correct) {
                                this.feedback = feedback.correct;
                                this.canContinue = true;
                                TweenMax.to(positiveFeedbackIcon, 0.75, {
                                    autoAlpha: 1,
                                    scale: 1,
                                    force3D: true
                                });
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
                                this.feedback = feedback.incorrect;
                                this.canContinue = false;
                                TweenMax.to(negativeFeedbackIcon, 0.75, {
                                    autoAlpha: 1,
                                    scale: 1,
                                    force3D: true
                                });
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
                        this.nextPage = function (evt) {
                            evt.preventDefault();
                            if (this.canContinue) {
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
                        $log.debug('npQuestion::component loaded!');
                    }
            );
})();
