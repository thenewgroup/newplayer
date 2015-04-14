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
                            } else if (/^([a-zA-Z]{1,10}:)?\/\//.test(btnLink)) {
                                if (!this.target) {
                                    this.target = '_blank';
                                }
                                this.linkInternal = false;
                            } else if (typeof ManifestService.getPageId() === 'undefined' || ManifestService.getPageId() === '') {
                                if (!this.target) {
                                    this.target = '_blank';
                                }
                                ManifestService.goToNextPage();
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
                                    '\n::cmpData::', cmpData,
                                    '\n::btnLink::', btnLink,
                                    '\n::cmpData.link::', cmpData.link,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            if (this.linkInternal) {
                                btnLink = ManifestService.getNextPageId();
//                                btnLink = ManifestService.getNextPageId();
                                ManifestService.setPageId(btnLink);
                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::this.linkInternal:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::cmpData::', cmpData,
                                        '\n::this.link::', this.link,
                                        '\n::cmpData.link::', cmpData.link,
                                        '\n::btnLink::', btnLink,
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
