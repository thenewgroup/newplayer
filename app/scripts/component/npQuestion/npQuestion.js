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
                        var feedback_label = $element.find('.question-feedback-label');
                        var negativeFeedbackIcon = '';
                        var positiveFeedbackIcon = '';
                        //////////////////////////////////////////////////////////////////////////////////////
                        //build that 
                        //////////////////////////////////////////////////////////////////////////////////////
                        TweenMax.staggerTo($(".boxElements"), 2, {
                            scale: 1,
                            autoAlpha: 1,
                            delay: 0.75,
                            ease: Power4.easeOut,
                            force3D: true
                        }, 0.2);
                        this.update = function (event) {
                            $log.debug('npQuestion::answer changed');
                            if (feedback.immediate) {
                                this.feedback = '';
                                negativeFeedbackIcon = $element.find('.negative-feedback-icon');
                                positiveFeedbackIcon = $element.find('.positive-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {
                                    opacity: 0,
                                    scale: 2.5,
                                    force3D: true
                                });
                                TweenMax.set(positiveFeedbackIcon, {
                                    opacity: 0,
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
                                opacity: 0,
                                scale: 2.5,
                                force3D: true
                            });
                            TweenMax.to(positiveFeedbackIcon, 0.25, {
                                opacity: 0,
                                scale: 2.5,
                                force3D: true
                            });
                            var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
                            $checkbox = $element.find('.checkbox-x');
                            $checked = $element.find('.checkbox-x[checked]');
                            $log.debug('npQuestion::evaluate:', this.answer);
//                            if (!!this.answer) {
                            if (!!$checked === true) {
                                switch (this.type) {
                                    case 'checkbox':
                                        //var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx); // defined above
                                        var idx;
                                        var $currentCheckbox;
                                        for (idx in chkAnswers) {
                                            $currentCheckbox = $($checkbox[idx]);
                                            if (chkAnswers[idx].data.correct) {
                                                // confirm all correct answers were checked
                                                if ((!!$currentCheckbox.attr('checked')) !== true) {
                                                    correct = false;
                                                }
                                            } else {
                                                // confirm no incorrect answers were checked
                                                if ((!!$currentCheckbox.attr('checked')) === true) {
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
                                                feedback_label.remove();
                                            }
                                            correct = false;
                                        } else {
                                            if (angular.isObject(txtAnswer.data.feedback) && angular.isString(txtAnswer.data.feedback.correct)) {
                                                this.feedback = txtAnswer.data.feedback.correct;
                                                feedback_label.remove();
                                            }
                                        }
                                        break;
                                }
                            } else {
                                correct = false;
                            }
                            $log.debug('npQuestion::evaluate:isCorrect', correct);
                            // set by ng-model of npAnswer's input's
//                            if (feedback.immediate && this.feedback === '') {
                            feedback_label.remove();
                            if (correct) {
                                this.feedback = feedback.correct;
                                this.canContinue = true;
                                TweenMax.to(positiveFeedbackIcon, 0.75, {
                                    opacity: 1,
                                    scale: 1,
                                    force3D: true
                                });
                            } else {
                                this.feedback = feedback.incorrect;
                                this.canContinue = false;
                                TweenMax.to(negativeFeedbackIcon, 0.75, {
                                    opacity: 1,
                                    scale: 1,
                                    force3D: true
                                });
                            }
//                            }
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
//                            negativeFeedbackIcon = $element.find('.hotspotButton');
                            function onPageLoadBuild() {
                                negativeFeedbackIcon = $('.negative-feedback-icon');
                                postiveFeedbackIcon = $('.positive-feedback-icon');
                                TweenMax.set(negativeFeedbackIcon, {opacity: 0, scale: 2.5, force3D: true});
                                TweenMax.set(postiveFeedbackIcon, {opacity: 0, scale: 2.5, force3D: true});
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