/* jshint -W003, -W117 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .controller('npHotspotController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data;
                        var buttonData = $scope.feedback || {};
                        var contentAreaHeight;
                        $log.debug('npHotspot::data', cmpData, buttonData);
                        var hotspotButtons = '';
                        this.hotspotButtons = cmpData.hotspotButtons;
                        this.id = cmpData.id;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        //////////////////////
                        var contentArea = '';
                        setTimeout(function () {
                            $scope.$apply(function () {
                                contentArea = $element.find('.content-area');
                                function onPageLoadSet() {
//                                    hotspotButton = $('.hotspotButton');
                                    TweenMax.set(contentArea, {opacity: 0, force3D: true});
                                }
                                onPageLoadSet();
                            });
                        });
                        $scope.feedback = this.feedback = cmpData.feedback;
                        $scope.image = this.image = cmpData.image;
                        //////////////////////
                        this.update = function (button) {
                            this.feedback = button.feedback;
                            var idx = this.hotspotButtons.indexOf(button);
                            //////////////////////
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::button::', button,
                                    '\n::idx::', idx,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            $scope.$watch('npHotspot.feedback', function (newValue, oldValue) {
                                contentAreaHeight = 0;
                                TweenMax.to(contentArea, 1, {
                                    opacity: 1,
                                    ease: Power4.easeOut
                                });
                                $('.npHotspot-feedback p').each(function (index, totalArea) {
                                    contentAreaHeight = contentAreaHeight + $(this).outerHeight(true);
                                    TweenMax.to($('.content-background'), 1, {
                                        height: contentAreaHeight + 25,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($('.npHotspot-feedback'), 0.1, {
                                        opacity: 0,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($('.npHotspot-feedback'), 0.5, {
                                        delay: 0.5,
                                        opacity: 1,
                                        ease: Power4.easeOut
                                    });
                                });
                            });
                            $('.hotspotButton').each(function (index, totalArea) {
                                contentAreaHeight = contentAreaHeight + $(this).outerHeight(true);
                                TweenMax.to($(this), 1, {
                                    rotation: 0,
                                    ease: Power4.easeOut
                                });
                            });
                            TweenMax.to($('.hotspotButton')[idx], 1, {
                                rotation: -45,
                                ease: Power4.easeOut
                            });
                        };
                    }
            )
            .directive('hotspotButtonBuild', function () {
                return function ($scope, $element, attrs) {
                    var hotspotButton = '';
                    setTimeout(function () {
                        $scope.$apply(function () {
                            hotspotButton = $element.find('.hotspotButton');
                            function onPageLoadBuild() {
                                hotspotButton = $('.hotspotButton');
                                TweenMax.set(hotspotButton, {opacity: 0, scale: .25, force3D: true});
                                TweenMax.set(hotspotButton, {opacity: 0, scale: .25, force3D: true});
                                TweenMax.staggerTo(hotspotButton, 2, {scale: 1, opacity: 1, delay: 0.5, ease: Elastic.easeOut, force3D: true}, 0.2);
                            }
                            onPageLoadBuild();
                        });
                    });
                };
            })
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npHotspot::component loaded!');
                    }
            );
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpHotspot mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
})();
