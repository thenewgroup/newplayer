'use strict';
angular
        .module(
                'npList',
                []
                );
angular
        .module('npList')
        /** @ngInject */
        .controller('npListController',
                function ($log, $scope, $rootScope, $element) {
                    var vm = this,
                            cmpData = $scope.component.data,
                            content = null,
                            listObjectVideo,
                            listObject;
                    $log.debug('npList::data', cmpData);
                    if (cmpData.link) {
                        vm.link = cmpData.link;
                    }
                    vm.heading = cmpData.heading;
                    vm.content = cmpData.content;
                    vm.wrap = cmpData.wrap;
                    $log.info('npList::content', $scope.content, vm.content, cmpData.link, 'this.wrap: ', this.wrap);
                    this.handleLink = function () {
                        $log.info('npList:handleLink | link is a manifest');
                        $rootScope.$broadcast('npReplaceManifest', cmpData.link);
                    };
                    var bodyWidth;
                    $scope.$watch(function () {
                        bodyWidth = window.innerWidth;
                    });
                    var columnWrap = 'true';
                    $(".np-cmp-wrapper").each(function () {
                        columnWrap = $(this).attr("data-ng:wrap");
                        if ($(this).attr("data-ng:wrap") === 'true') {
                            $(this).find('.column-1').removeClass('col-md-4');
                            $(this).find('.column-1').addClass('col-md-12');
                            $(this).find('.column-2').removeClass('col-md-8');
                            $(this).find('.column-2').addClass('col-md-12');
                        }
                        if (window.innerWidth < 992) {
                            $(this).find('.list-row').removeClass('vertical-align');
                        } else if ((window.innerWidth > 992) && ($(this).attr("data-ng:wrap") === 'false')) {
                            $(this).find('.list-row').addClass('vertical-align');
                        }
                    });
                    //////////////////////////////////////////////////////////////////////////////////////
                    // on ready
                    //////////////////////////////////////////////////////////////////////////////////////list-object
                    setTimeout(function () {
                        $scope.$apply(function () {
                            listObject = $element.find('.list-object');
                            listObjectVideo = $element.find('video');
                            if (listObjectVideo) {
                                TweenMax.set(listObjectVideo, {
                                    autoAlpha: 0
                                });
                                TweenMax.to(listObjectVideo, 1, {
                                    autoAlpha: 1,
                                    delay: 1.2,
                                    ease: Power4.easeOut
                                });
                            }
                        });
                    });
                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npList::component loaded!');
                }
        );
