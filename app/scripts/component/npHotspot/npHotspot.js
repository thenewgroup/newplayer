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
//            jQuery(element).attr('img', scope.image);
        };
    };
    return new Directive();
}

angular
        .module('npHotspot')
        /** @ngInject */
        .controller('npHotspotController', function ($log, $scope, $sce, $element) {
            var cmpData = $scope.component.data;
            $log.debug('npHotspot::data', cmpData, $element);
//            console.log('npHotspot::data', cmpData, $element);

            this.id = cmpData.id;
            this.baseURL = cmpData.baseURL;
            this.src = cmpData.image;
//            var content = ManifestService.getComponent( this.content );

            $scope.content = this.content = cmpData.content;
            console.log('hotspot button content: ' + $scope.content);

            $scope.image = this.image = cmpData.image;
            console.log('hotspot image reference: ' + $scope.image);

        }
        )

        .directive('mediaelement', npMediaElementDirective)

        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npHotspot::component loaded!');
                    console.log('npHotspot::component loaded!');
                }
        );

