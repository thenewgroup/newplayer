'use strict';
angular
        .module(
                'npNavBar',
                []
                );
angular
        .module('npNavBar')
        /** @ngInject */
        .controller('npNavBarController',
                function ($log, $scope, $sce) {
                    var cmpData = $scope.component.data || {},
                            position = cmpData.position;
                    $log.debug('npNavBar::data', cmpData);
                    console.log(
                            '\n::::::::::::::::::::::::::::::::::::::npNavBarController::data:::::::::::::::::::::::::::::::::::::::::::::',
                            '\n::cmpData::', cmpData,
                            '\n::position::', position,
                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                            );
//                    this.position = position;
                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npNavBar::component loaded!');
                }
        );