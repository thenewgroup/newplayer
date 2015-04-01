(function () {
    'use strict';
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpReveal mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
    angular
            .module('newplayer.component')
            .controller('npRevealController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data,
                                revealItems = $scope.component.revealItems,
                                revealItemsIndex = $scope.component.idx,
                                revealItemsButtonImage = $scope.component.revealItems.buttonImage;
                        var buttonData = $scope.feedback || {};
                        this.revealItems = $scope.component.revealItems;
                        this.revealItemComponent = $scope.component.revealItems[0];
                        this.revealItemComponents = $scope.component.revealItems;
                        this.revealItemVideoType = $scope.component.baseURL;
                        this.id = cmpData.id;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.feedback = this.feedback = cmpData.feedback;
                        $scope.image = this.image = cmpData.image;
                        $log.debug('npReveal::data', cmpData, buttonData);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on ready set states
                                //////////////////////////////////////////////////////////////////////////////////////
                                setTimeout(function () {
                                    var maxHeight = 0;
                                    $(".reveal-wrapper").each(function () {
//                                        console.log(
//                                                '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                                '\n::maxHeight::', maxHeight,
//                                                '\n::$(this).outerHeight()::', $(this).outerHeight(true),
//                                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                                );
                                        if ($(this).outerHeight() > maxHeight) {
                                            maxHeight = ($(this).outerHeight() + 100);
                                        }
                                    });
                                    $(".np-reveal").height(maxHeight);
                                }, 1);
                                TweenMax.to($(".reveal-object"), 0, {
                                    opacity: 0
                                });
                                TweenMax.set($(".reveal-button"), {
                                    opacity: 0,
                                    scale: .25,
                                    force3D: true
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //build init state
                                //////////////////////////////////////////////////////////////////////////////////////
                                TweenMax.to($(".button-screen"), 1.5, {
                                    autoAlpha: 0.75,
                                    ease: Power4.easeOut
                                });
                                TweenMax.staggerTo($(".reveal-button"), 2, {
                                    scale: 1,
                                    opacity: 1,
                                    delay: 0.25,
                                    ease: Power4.easeOut,
                                    force3D: true
                                }, 0.2);
                                TweenMax.to($(".button-screen"), 1.5, {
                                    autoAlpha: 0.75,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(".button-screen")[0], 1.75, {
                                    autoAlpha: 0,
                                    delay: 1.75,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(".reveal-object")[0], 1.75, {
                                    autoAlpha: 1,
                                    delay: 1.75,
                                    ease: Power4.easeOut
//                                    onComplete: function () {
//
//                                    }
                                });
                            });
                        });
                        this.update = function (button) {
                            var idx = this.revealItems.indexOf(button);
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change stop and reset all video files
                            //////////////////////////////////////////////////////////////////////////////////////
                            $('video').each(function () {
                                this.pause();
                                this.currentTime = 0;
                                this.load();
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change cross fade items
                            //////////////////////////////////////////////////////////////////////////////////////
                            TweenMax.to($(".button-screen"), 1.5, {
                                autoAlpha: 0.75,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(".button-screen")[idx], 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(".reveal-object"), 1.5, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(".reveal-object")[idx], 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                        };
                    }
            )
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npReveal::component loaded!');
                    }
            );
})();