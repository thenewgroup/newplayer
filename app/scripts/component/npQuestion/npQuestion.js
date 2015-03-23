(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npQuestionController',
                    function ($log, $scope, $rootScope, ManifestService, $sce, $element) {
                        var cmpData = $scope.component.data;
                        $log.debug('npQuestion::data', cmpData);
                        this.id = cmpData.id;
                        this.content = $sce.trustAsHtml(cmpData.content);
                        this.type = cmpData.type;
                        this.feedback = '';
                        this.canContinue = false;
                        var feedback = cmpData.feedback;
                        var feedback_label = $element.find('.question-feedback-label');
                        var feedback_checkbox_x = $element.find('.checkbox-x');
                        console.log(
                                '\n::::::::::::::::::::::::::::::::::::::npQuestions::default:::::::::::::::::::::::::::::::::::::::::::::::::',
                                '\n:::', this,
                                '\n::type::', cmpData.type,
                                '\n::feedback::', feedback,
                                '\n::feedback_label::', feedback_label,
                                '\n::$element::', $element,
                                '\n::feedback_checkbox_x::', feedback_checkbox_x,
                                '\n::$element.find(".checkbox-x")::', $element.find(".checkbox-x"),
                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                );
                        this.changed = function (event) {
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::npQuestions::changed:::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::id::', event,
                                    '\n::id::', event.target,
                                    '\n::id::', event.currentTarget,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            TweenMax.to(event.target, .25, {
                                autoAlpha: 1,
                                ease: Power3.easeOut
                            });
                            $log.debug('npQuestion::answer changed');
                            if (feedback.immediate) {
                                this.feedback = '';
                            }
                        };
                        this.evaluate = function () {
                            var correct = true;
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::npQuestions::evaluate:::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::this::', this,
                                    '\n::this.answer::', this.answer,
                                    '\n::cmpData::', cmpData,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            $log.debug('npQuestion::evaluate:', this.answer);
                            if (!!this.answer) {
                                switch (this.type) {
                                    case 'radio':
                                        var radAnswer = ManifestService.getComponent(this.answer);
                                        if (angular.isString(radAnswer.data.feedback)) {
                                            this.feedback = radAnswer.data.feedback;
                                        }
                                        correct = radAnswer.data.correct;
                                        break;
                                    case 'checkbox':
                                        var chkAnswers = ManifestService.getAll('npAnswer', $scope.cmpIdx);
                                        var idx;
                                        for (idx in chkAnswers) {
                                            if (chkAnswers[idx].data.correct) {
                                        console.log(
                                                '\n::::::::::::::::::::::::::::::::::::::npQuestions::default:::::::::::::::::::::::::::::::::::::::::::::::::',
                                                '\n::idx::', idx,
                                                '\n::chkAnswers::', chkAnswers,
                                                '\n::this.answer[chkAnswers[idx].idx]::', this.answer[chkAnswers[idx].idx],
                                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                                );
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
                            if (feedback.immediate && this.feedback === '') {
                                feedback_label.remove();
                                if (correct) {
                                    this.feedback = feedback.correct;
                                    this.canContinue = true;
                                } else {
                                    this.feedback = feedback.incorrect;
                                    this.canContinue = false;
                                }
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
                        $log.debug('npQuestion::component loaded!');
                    }
            );
})();