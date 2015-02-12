'use strict';

angular
        .module(
                'npHotspot', []
                /*, [ 'com.2fdevs.videogular' ] */
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
                    $log.debug('npHotspot::data', cmpData, buttonData);

                    var hotspotButtons = '';
                    this.hotspotButtons = cmpData.hotspotButtons;

                    this.id = cmpData.id;
                    this.baseURL = cmpData.baseURL;
                    this.src = cmpData.image;

                    $scope.feedback = this.feedback = cmpData.feedback;
                    $scope.image = this.image = cmpData.image;

                    this.update = function (button) {
                        var idx = this.hotspotButtons.indexOf(button);
                        this.feedback = button.feedback;
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