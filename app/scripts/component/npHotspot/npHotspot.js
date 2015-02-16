'use strict';

angular
        .module(
                'npHotspot', []
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

angular
        .module('npHotspot')
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

                    $scope.feedback = this.feedback = cmpData.feedback;
                    $scope.image = this.image = cmpData.image;

                    this.update = function (button) {
                        this.feedback = button.feedback;
                        var idx = this.hotspotButtons.indexOf(button);

                        //////////////////////
                        $scope.$watch('npHotspot.feedback', function (newValue, oldValue) {
                            $('.npHotspot-feedback p').each(function (index, totalArea) {
                                var contentAreaHeight = $(this).outerHeight(true) + 50;
                                TweenMax.to($('.content-background'), 1, {
                                    height: contentAreaHeight,
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
                        //////////////////////
                    };
                }
        )
        .directive('mediaelement', npMediaElementDirective)
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npHotspot::component loaded!');
                }
        );