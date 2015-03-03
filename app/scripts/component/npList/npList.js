(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npListController',
                    function ($log, $scope, $rootScope) {
                        var vm = this,
                                cmpData = $scope.component.data,
                                content = null;
                        $log.debug('npList::data', cmpData);
                        console.log(':: cmpData :: ', cmpData);
                        if (cmpData.link) {
                            this.link = cmpData.link;
                        }
                        this.heading = cmpData.heading;
                        this.content = cmpData.content;
                        this.wrap = cmpData.wrap;
                        $log.info('npList::content', $scope.content, this.content, cmpData.link, 'this.wrap: ', this.wrap);
                        this.handleLink = function () {
                            $log.info('npList:handleLink | link is a manifest');
                            $rootScope.$broadcast('npReplaceManifest', cmpData.link);
                        };
                        ////////////////////////////////////////////////////////////
                        ////////////////////////////////////////////////////////////
//                        if(!this.wrap){
//                            console.log('column-1: ',$('.column-1').length);
//                            $('.column-1').removeClass('col-md-4');
//                            $('.column-2').removeClass('col-md-4');
//                        }
                        ////////////////////////////////////////////////////////////
                        ////////////////////////////////////////////////////////////

                        var bodyWidth;
                        $scope.$watch(function () {
                            bodyWidth = window.innerWidth;
                        });
                        var columnWrap = true;
                        $(".np-cmp-wrapper").each(function () {
                            columnWrap = $(this).attr("data-ng:wrap");
//                            console.log('I am outside: ', columnWrap);
                            if ($(this).attr("data-ng:wrap") === 'true') {
                                console.log('I got thru: ', columnWrap);
                                $(this).find('.column-1').removeClass('col-md-4');
                                $(this).find('.column-1').addClass('col-md-12');
                                $(this).find('.column-2').removeClass('col-md-8');
                                $(this).find('.column-2').addClass('col-md-12');
                            }
                            ////////////////////////////////////////////////
                            console.log('bodyWidth: ', window.innerWidth);
                            console.log('I got thru $(this).attr("data-ng:wrap"): ', $(this).attr("data-ng:wrap"));
                            if (window.innerWidth < 992) {
                                $(this).find('.list-row').removeClass('vertical-align');
                            } else if ((window.innerWidth > 992) && ($(this).attr("data-ng:wrap") === 'false')) {
                                $(this).find('.list-row').addClass('vertical-align');
                            }
                        });
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npList::component loaded!');
                    }
            );
})();
