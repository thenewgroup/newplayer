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
                        var buttonType = cmpData.type;
                        this.linkInternal = true;
                        this.apiLink = false;
                        var btnLink = cmpData.link;
                        console.log(
                                '\n::::::::::::::::::::::::::::::::::::::this.go:::::::::::::::::::::::::::::::::::::::::::::::::',
                                '\n::this::', this,
                                '\n::buttonType::', buttonType,
                                '\n::cmpData::', cmpData,
                                '\n::$(cmpData)::', $(cmpData),
                                '\n::this::', $(this),
                                '\n::this::', $(this).parent(),
                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                );
                        if (typeof buttonType !== 'undefined') {
//var el = document.getElementById('hello');
//if(el) {
//    el.className += el.className ? ' someClass' : 'someClass';
//}
//                            document.getElementById('foo').className += ' class_two';
                            var currentElement = $element[0];
//                            currentElement.className += (' ' + buttonType);
                            $(this).addClass(buttonType);
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::this.go.buttonType:::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::$element::', $element,
                                    '\n::$element::', $element[0],
                                    '\n::currentElement::', currentElement,
                                    '\n::$element.className::', $element.className,
                                    '\n::buttonType::', buttonType,
                                    '\n::cmpData::', cmpData,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                        }
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
                            if (this.linkInternal) {
                                btnLink = ManifestService.getNextPageId();
                                ManifestService.setPageId(btnLink);
                            } else {
                                if (this.apiLink) {
                                    //TODO: we may need a `method` property to know what to use here
                                    // i.e. GET, POST, PUT, DELETE
                                    TrackingService.trackApiCall(btnLink);
                                    APIService.postData(btnLink);
                                    return;
                                }
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
