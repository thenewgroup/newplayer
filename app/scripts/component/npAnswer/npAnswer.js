(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npAnswerController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data || {};
                        this.id = cmpData.id;
                        this.label = $sce.trustAsHtml(cmpData.label);
                        var vm = this,
//                                checkmark = $element.find('svg#Layer_1'),
                                cmpData = $scope.component.data || {};
                        vm.isCorrect = cmpData.correct;
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
                        //$log.debug('npAnswer::data', cmpData);
                        vm.id = cmpData.id;
                        vm.label = $sce.trustAsHtml(cmpData.label);
                        vm.question = null;
                        vm.checked = false;
                        vm.setQuestion = function (idx, question) {
                            vm.question = question;
                            question.registerAnswer(idx, this);
                        };
                        vm.clicked = function ($event) {
                            //$log.debug('npAnswer clicked', $event, cmpData);
                            if (vm.question.type === 'checkbox') {
                                vm.checked = !vm.checked;
                                vm.question.answerChanged(vm);
                            } else if (vm.question.type === 'radio') {
                                vm.checked = true;
                                vm.question.answerChanged(vm);
                            }
                            updateCheck();
                        };
                        vm.clear = function () {
                            vm.checked = false;
                            updateCheck();
                        };
                    }
            )
            .directive('npAnswerCheckbox', function () {
                return function ($scope, $element, $sce) {
                    var cmpData = $scope.component.data || {};
//                    this.label = $sce.trustAsHtml(cmpData.label);
                    console.log(
                            '\n::::::::::::::::::::::::::::::::::::::npAnswerCheckbox::inside:::::::::::::::::::::::::::::::::::::::::::::::::',
                            '\n::this::', this,
                            '\n::cmpData::', cmpData,
                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                            );
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
//                                            '\n::::::::::::::::::::::::::::::::::::::npAnswerCheckbox::inside:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                            '\n::this::', this,
//                                            '\n::this.npAnswer::', this.npAnswer,
//                                            '\n::this.label::', this.label,
//                                            '\n::$checkbox.attr(checked)::', $checkbox.attr('checked'),
//                                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                            );
                                    TweenMax.to($(clickedCheckbox).find('.checkbox-x'), .75, {
                                        autoAlpha: 1,
                                        scale: .7,
                                        ease: Power3.easeOut
                                    });
                                } else if ($checkbox.attr('checked') !== 'checked') {
                                    TweenMax.to($(clickedCheckbox).find('.checkbox-x'), .25, {
                                        autoAlpha: 0,
                                        scale: 2.5,
                                        ease: Power3.easeOut
                                    });
                                }
                            };
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        //$log.debug('npAnswer::component loaded!');
                    }
            );
})();



