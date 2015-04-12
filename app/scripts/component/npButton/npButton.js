(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npButtonController',
                    function ($log, $scope, $sce, $location, $element, ConfigService, ManifestService, APIService, TrackingService) {
                        var cmpData = $scope.component.data || {};
                        $log.debug('npButton::data', cmpData);
                        this.content = '';
                        var btnContent = cmpData.content;
                        if (angular.isString(btnContent)) {
                            this.content = $sce.trustAsHtml(btnContent);
                            //$element.append( btnContent );
                        }
                        this.link = '';
                        this.target = cmpData.target;
                        this.linkInternal = true;
                        this.apiLink = false;
                        var btnLink = cmpData.link;
                        console.log(
                                '\n::::::::::::::::::::::::::::::::::::::this.go:::::::::::::::::::::::::::::::::::::::::::::::::',
                                '\n::this::', this,
                                '\n::cmpData::', cmpData,
                                '\n::$(cmpData)::', $(cmpData),
                                '\n::this::', $(this),
                                '\n::this::', $(this).parent(),
                                '\n::cmpData::', cmpData,
//                                '\n::idx::', idx,
                                '\n::btnLink::', btnLink,
                                '\n::cmpData.link::', cmpData.link,
                                '\n::angular.isString(btnLink)::', angular.isString(btnLink),
                                '\n::btnLink.indexOf(/)::', btnLink.indexOf('/'),
                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                );
                        if (angular.isString(btnLink)) {
                            if (btnLink.indexOf('/') === 0) {
                                if (/^\/api\//.test(btnLink)) {
                                    this.apiLink = true;
                                    this.linkInternal = false;
                                } else {
                                    if (!this.target) {
                                        this.target = '_top';
                                    }
                                    this.linkInternal = false;
                                }
                            } else if (typeof btnLink === 'undefined' || btnLink === '') {
                                var parentPage = $('.npPage').closest('[data-cmptype="npPage"]');
                                var allPages = ManifestService.getAll(parentPage, $scope.cmpIdx);
//                                data-cmptype="npPage"
                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::btnLink===undefined:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::allPages::', allPages,
                                        '\n::parentPage::', parentPage,
                                        '\n::parentPage.length::', parentPage.length,
                                        '\n::cmpData::', cmpData,
                                        '\n::ManifestService.getPageId()::', ManifestService.getPageId(),
//                                        '\n::ManifestService.getComponentIdx()::', ManifestService.getNextComponent(),
                                        '\n::npPage::', $('.npPage'),
                                        '\n::npPage::', $('.npPage').length,
                                        '\n::$(this).closest(.npPage)::', $(this).closest('.npPage'),
                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        );
                                this.link = parentPage[1];
//                                if (!this.target) {
//                                    this.target = '_blank';
//                                }
//                                ManifestService.setPageId('Page2');
                                ManifestService.goToNextPage();
//                                this.linkInternal = true;
                            } else if (/^([a-zA-Z]{1,10}:)?\/\//.test(btnLink)) {
                                if (!this.target) {
                                    this.target = '_blank';
                                }
                                this.linkInternal = false;
                            } else {
                                if (btnLink.indexOf('#') === 0) {
                                    btnLink = btnLink.substr(1);
                                } else {
                                    btnLink = '/' + ConfigService.getManifestId() + '/' + btnLink;
                                }
                            }
                            $log.debug('npButton::link', btnLink);
                            this.link = $sce.trustAsResourceUrl(btnLink);
                        }
                        this.go = function () {
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::this.go:::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::this::', this,
                                    '\n::cmpData::', cmpData,
                                    '\n::cmpData.link::', cmpData.link,
                                    '\n::ManifestService.setPageId(cmpData.link)::', ManifestService.setPageId(cmpData.link),
                                    '\n::$location.url(this.link)::', $location.url(this.link),
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            if (this.linkInternal) {
                                //$location.url(this.link);
                                ManifestService.setPageId(cmpData.link);
                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::this.linkInternal:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::cmpData::', cmpData,
                                        '\n::cmpData.link::', cmpData.link,
                                        '\n::ManifestService.setPageId(cmpData.link)::', ManifestService.setPageId(cmpData.link),
                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        );
                            } else {
                                if (this.apiLink) {
                                    //TODO: we may need a `method` property to know what to use here
                                    // i.e. GET, POST, PUT, DELETE
                                    TrackingService.trackApiCall(btnLink);
                                    APIService.postData(btnLink);
                                    return;
                                }
                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::this.target:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::this.link::', this.link,
                                        '\n::this.target::', this.target,
                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        );
                                window.open(this.link, this.target);
                            }
                        };
                    }
            )

            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npButton::component loaded!');
                    }
            );
})();
