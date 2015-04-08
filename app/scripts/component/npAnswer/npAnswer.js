(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npAnswerController',
                    function ($log, $scope, $sce) {
                        var cmpData = $scope.component.data || {};
                        $log.debug('npAnswer::data', cmpData);
                        this.id = cmpData.id;
                        this.label = $sce.trustAsHtml(cmpData.label);
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::npAnswerController::inside:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::cmpData::', cmpData,
//                                '\n::cmpData.id::', cmpData.id,
//                                '\n::this.label::', this.label,
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
                    }
            )
            .directive('npAnswerCheckbox', function () {
                return function ($scope, $element, $sce) {
                    var cmpData = $scope.component.data || {};
//                    this.label = $sce.trustAsHtml(cmpData.label);
//                    console.log(
//                            '\n::::::::::::::::::::::::::::::::::::::npAnswerCheckbox::inside:::::::::::::::::::::::::::::::::::::::::::::::::',
//                            '\n::this::', this,
//                            '\n::cmpData::', cmpData,
//                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                            );
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
                                $checkbox.attr('checked', !$checkbox.attr('checked'));
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
                        $log.debug('npAnswer::component loaded!');
                    }
            );
})();



