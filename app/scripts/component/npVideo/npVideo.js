'use strict';

angular
        .module(
                'npVideo', []
                /*, [ 'com.2fdevs.videogular' ] */
                );

/** @ngInject */
function NpVideoDirective($log) {
    $log.info('DEBUG | \npVideo::Init\n');
    return {
        restrict: 'EA',
        controller: NpVideoController,
        controllerAs: 'npVideo',
        bindToController: true
    };
}

angular
        .module('npVideo')
        /** @ngInject */
        .controller('npVideoController',
                function ($log, $scope, $sce, $element) {
                    var cmpData = $scope.component.data,
                            types = cmpData.types;
                    $log.debug('npVideo::data', cmpData, $element);
                    this.id = cmpData.id;
                    this.baseURL = cmpData.baseURL;
                    this.sourceURL = '';
                    $scope.poster = this.poster = cmpData.poster;
                    $scope.height = this.height = cmpData.height || 360;
                    $scope.width = this.width = cmpData.width || 640;
                    $scope.preload = this.preload = cmpData.preload || 'none';
                    $scope.videoUrl = $sce.trustAsResourceUrl(cmpData.baseURL + '.' + types);
                    console.log(
                            '\n::::::::::::::::::::::::::::::::::::::npVideoController:::::::::::::::::::::::::::::::::::::::::::::::::',
                            '\n::cmpData::', cmpData,
                            '\n::$scope.poster::', $scope.poster,
                            '\n::this.baseURL::', this.baseURL,
                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                            );
                    if (angular.isArray(types) && types.length > 0) {
                        $log.debug('npVideo::data:types', types);
//                        var sources = '';
                        for (var typeIdx in types) {
                            var type = types[typeIdx];
                            $log.debug('npVideo::data:types:type', typeIdx, type);
//                            sources += '<source type="video/' + type + '" ng-src="' + this.baseURL + '.' + type + '" />';
                            $scope[type] = this.baseURL + '.' + type;
                        }
//                        this.sourceURL = $scope[type];
                        $scope.videoType = cmpData.types[0];
//                        $scope.sources = sources;
                        console.log(
                                '\n::::::::::::::::::::::::::::::::::::::npVideoController:::::::::::::::::::::::::::::::::::::::::::::::::',
                                '\n::cmpData::', cmpData,
                                '\n::types.length::', types.length,
                                '\n::$scope[type]::', $scope[type],
                                '\n::this.sourceURL::', this.sourceURL,
                                '\n::$scope.poster::', $scope.poster,
                                '\n::this.baseURL::', this.baseURL,
                                '\n::$scope.videoType::', $scope.videoType,
                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                );
                    }
                }
        )
//        .directive('mediaelement', NpVideoDirective)
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npVideo::component loaded!');
                }
        );