(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npFeatureController',
                    function ($log, $scope, ManifestService, $element) {
                        var cmpData = $scope.component.data || {};
                        //$log.debug('npFeature::data', cmpData);
                    }
            )
            .directive('newPlayerPageTop', function () {
                return function ($scope, $element, attrs, ManifestService) {
                    setTimeout(function () {
                        $scope.$apply(function () {
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::ManifestService::Initialize:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::ManifestService.initialize()::', ManifestService,
//                                    '\n::$scope::', $scope,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
//                            var cmpData = $scope.component.data || {};
//                            ManifestService.initialize($scope);
//                            ManifestService.initializeComponent($scope.component);
//                            var np_wrapper = $element.find('.np_outside-padding');
//                            var hotspotImage = $element.find('.hotspotImage');
//                            var page_container = $element.find('.modal-open');
//                            var page_container = $('.modal-open');
//                            TweenMax.to(np_wrapper, 0.25, {
//                                autoAlpha: 0.25,
//                                ease: Power2.easeOut
//                            });
//                            function scroller() {
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::page_container::', page_container,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
//                                TweenMax.to(page_container, .75, {
//                                    scrollTo: {y: 0},
//                                    ease: Power2.easeInOut,
//                                    onComplete: atTop
//                                });
//                            }
//                            function atTop() {
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::page_container::', page_container,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
//                                TweenMax.to(np_wrapper, 0.5, {
//                                    autoAlpha: 1,
//                                    ease: Power2.easeOut
//                                });
//                            }
//                            scroller();
                        });
                    });
                };
            })
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        //$log.debug('npFeature::component loaded!');
                    }
            );
})();

