'use strict';
angular
        .module(
                'npQuote',
                []
                );
angular
        .module('npQuote')
        /** @ngInject */
        .controller('npQuoteController',
                function ($log, $scope, $sce) {
                    var cmpData = $scope.component.data;
                    $log.debug('npQuote::data', cmpData);
                    this.content = $sce.trustAsHtml(cmpData.content);
                    $log.debug('npQuote::content', $scope.content);
                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npQuote::component loaded!');
                }
        );