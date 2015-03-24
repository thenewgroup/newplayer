(function () {

    'use strict';
    angular
            .module('newplayer.component')

            /** @ngInject */
            .controller('npFeatureController',
                    function ($log, $scope/*, ManifestService*/, $element) {
                        var cmpData = $scope.component.data || {};
                        $log.debug('npFeature::data', cmpData);

//                        setTimeout(function () {
//                            $scope.$apply(function () {
//                                var hotspotImage = $element.find('.hotspotImage');
//                                var page_container = $element.find('.container');
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::page_container::setTimeout:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::page_container::', page_container,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
//                                TweenMax.to(page_container, 0.25, {
//                                    autoAlpha: 0,
//                                    ease: Power2.easeOut
//                                });
//                                TweenMax.to(window, 1.25, {
//                                    scrollTo: {y: 100},
//                                    ease: Power2.easeOut
//                                });
//
//                            });
//                        });


                    }
            )
            .directive('newPlayerPageTop', function () {
                return function ($scope, $element, attrs) {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            var main = $element.find('.np_outside-padding');
                            var hotspotImage = $element.find('.hotspotImage');
                            var page_container = $element.find('.container');
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::page_container::setTimeout:::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::page_container::', page_container,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            TweenMax.to(main, 0.25, {
                                autoAlpha: 0,
                                ease: Power2.easeOut
                            });
                            function scroller() {
                                TweenMax.to(window, .75, {
                                    scrollTo: {y: 0},
                                    ease: Power2.easeInOut,
                                    onComplete: atTop
                                });
                            }
                            function atTop() {
                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::page_container::', page_container,
                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        );
                                TweenMax.to(main, 0.5, {
                                    autoAlpha: 1,
                                    ease: Power2.easeOut
                                });
                            }
                            scroller();
                        });
                    });
                };
            })

            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npFeature::component loaded!');
                    }
            );
})();

