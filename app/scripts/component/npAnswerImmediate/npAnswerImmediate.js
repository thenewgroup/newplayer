'use strict';
angular.
        module('npAnswerImmediate', ['npAnswerImmediateCheckboxDirective']);
angular.
        module('npAnswerImmediate')
        /** @ngInject */
        .controller('npAnswerImmediateController',
                function ($log, $scope, $sce, $element) {
                    var cmpData = $scope.component.data || {};
                    this.id = cmpData.id;
                    this.label = $sce.trustAsHtml(cmpData.label);
                    var vm = this;
                    vm.isCorrect = cmpData.correct;
                    vm.id = cmpData.id;
                    vm.label = $sce.trustAsHtml(cmpData.label);
                    vm.question = null;
                    vm.checked = false;
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npAnswerImmediate::npAnswerImmediate:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::cmpData::', cmpData,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                    vm.setQuestion = function (idx, question) {
                        vm.question = question;
                        question.registerAnswer(idx, this);
                    };
                    vm.clicked = function ($event) {
                        if (vm.question.type === 'checkbox') {
                            vm.checked = !vm.checked;
                            vm.question.answerChanged(vm);
                        }
                    };
                    vm.clear = function () {
                        vm.checked = false;
                    };
                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npAnswerImmediate::component loaded!');
                }
        );
angular
        .module('npAnswerImmediateCheckboxDirective', [])
        .directive('npAnswerImmediateCheckbox', function () {
            return function ($scope, $element, $sce) {
                var cmpData = $scope.component.data || {};
//                console.log(
//                        '\n::::::::::::::::::::::::::::::::::::::npAnswerImmediateCheckbox::inside::::::::::::::::::::::::::::::::::::::::::::::',
//                        '\n::this::', this,
//                        '\n::cmpData::', cmpData,
//                        '\n::$element::', $element,
//                        '\n::$element.find(.checkbox-x)::', $element.find('.checkbox-x'),
//                        '\n::$(.checkbox-x)::', $('.checkbox-x'),
//                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                        );
                setTimeout(function () {
                    $scope.$apply(function () {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set states
                        //////////////////////////////////////////////////////////////////////////////////////
//                        var checkboxX = $element.find('.checkbox-x');
                        var checkboxX = $('.checkbox-x');
                        TweenMax.set(checkboxX, {
                            autoAlpha: 0, 
                            scale: 2.5, 
                            force3D: true
                        });
                        $scope.update = function (event) {
                            var clickedCheckbox = event.currentTarget;
                            var $checkbox = $(clickedCheckbox).find('.checkbox-x');
                            $checkbox.attr('checked', !$checkbox.attr('checked'), ('true'));
                            //////////////////////////////////////////////////////////////////////////////////////
                            //update states on click
                            //////////////////////////////////////////////////////////////////////////////////////
                            if ($checkbox.attr('checked') === 'checked') {
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::npAnswerImmediateCheckbox::inside:::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::this::', this,
//                                        '\n::this.npAnswerImmediate::', this.npAnswerImmediate,
//                                        '\n::this.label::', this.label,
//                                        '\n::$checkbox.attr(checked)::', $checkbox.attr('checked'),
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
                                TweenMax.to($(clickedCheckbox).find('.checkbox-x'), 0.75, {
                                    autoAlpha: 1,
                                    scale: 0.7,
                                    ease: Power3.easeOut
                                });
                            } else if ($checkbox.attr('checked') !== 'checked') {
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::npAnswerImmediateCheckbox::inside::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::this::', this,
//                                        '\n::this.npAnswerImmediate::', this.npAnswerImmediate,
//                                        '\n::this.label::', this.label,
//                                        '\n::$checkbox.attr(checked)::', $checkbox.attr('checked'),
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
                                TweenMax.to($(clickedCheckbox).find('.checkbox-x'), 0.25, {
                                    autoAlpha: 0,
                                    scale: 2.5,
                                    ease: Power3.easeOut
                                });
                            }
                        };
                    });
                });
            };
        });