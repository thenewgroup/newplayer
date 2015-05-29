/* jshint -W003, -W117 */
'use strict';
angular
        .module('npButton', []);
angular
        .module('npButton')
        /** @ngInject */
        .controller('npButtonController',
                function ($log, $scope, $sce, $location, $element, ConfigService, ManifestService, APIService) {
//                function ($log, $scope, $sce, $location, $element, ConfigService, ManifestService, APIService, TrackingService) {
                    var cmpData = $scope.component.data || {};
                    $log.debug('npButton::data', cmpData);
                    this.content = '';
                    var btnContent = cmpData.content;
                    if (angular.isString(btnContent)) {
                        this.content = $sce.trustAsHtml(btnContent);
                    }
                    this.link = '';
                    this.target = cmpData.target;
                    this.npButton = buttonType;
                    this.linkInternal = true;
                    this.apiLink = false;
                    var btnLink = cmpData.link;
                    var buttonType = cmpData.type;
                    var currentPageIDX = '';
//                    console.log(
//                            '\n::::::::::::::::::::::::::::::::::::::npButton:::::::::::::::::::::::::::::::::::::::::::::::::',
//                            '\n::$sce::', $sce,
//                            '\n::$location::', $location,
//                            '\n::$element::', $element,
//                            '\n::$element.parent()::', $element.parent(),
//                            '\n::$element.parent()::', $element.parent().attr('idx'),
//                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                            );
                    //////////////////////////////////////////////////////////////////////////////////////
                    //check type and add class if next button type
                    //////////////////////////////////////////////////////////////////////////////////////
                    if (typeof buttonType !== 'undefined' && buttonType === 'btn-next') {
                        $scope.buttonTypeClass = buttonType;
                    }
                    if (angular.isString(btnLink)) {
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::angular.isString(btnLink):::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::btnLink::', btnLink,
//                                '\n::angular.isString(btnLink)::', angular.isString(btnLink),
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
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
                            if (typeof buttonType !== 'undefined' && buttonType === 'btn-next') {
                                ManifestService.goToNextPage();
                            }
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
//                    console.log(
//                            '\n::::::::::::::::::::::::::::::::::::::npButton:::before:::::::::::::::::::::::::::::::::::::::::::::::::',
//                            '\n::ManifestService.getFirst(npPage)::', ManifestService.getFirst('npPage').idx,
//                            '\n::currentPageIDX::', currentPageIDX,
//                            '\n::this.linkInternal::', this.linkInternal,
//                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                            );
                    this.go = function () {
                        if ($element.find('.btn-open-favorites')) {
                            $element.find('.elx-heart').toggleClass("elx-heart-filled");
                        }
                        if ($element.find('.btn-open-favorites')) {
                            $element.find('.elx-heart-filled').toggleClass("elx-heart");
                        }
                        if ($element.find('.btn-open-favorites')) {
                            $element.find('.elx-heart').toggleClass("elx-heart-filled");
                        }
                        if (this.linkInternal) {
                            currentPageIDX = $element.parent().attr('idx');
                            var currentComponent = ManifestService.getComponent();
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npButton:::this.linkInternal:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::ManifestService.getFirst(npPage)::', ManifestService.getFirst('npPage').idx,
//                                    '\n::ManifestService.getNextIdx(npPage)::', ManifestService.getNextIdx('npPage').idx,
//                                    '\n::ManifestService.getPageId()::', ManifestService.getPageId(),
//                                    '\n::currentComponent::', currentComponent.idx,
//                                    '\n::currentPageIDX::', currentPageIDX,
//                                    '\n::this.linkInternal::', this.linkInternal,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            if (typeof buttonType !== 'undefined' && buttonType === 'btn-next') {
                                ManifestService.goToNextPage(currentPageIDX);
                            }
                            if (typeof buttonType !== 'undefined' && buttonType === 'btn-previous') {
                                ManifestService.goToPreviousPage(currentPageIDX);
                            }
                        } else {
                            if (this.apiLink) {
                                // TODO: we may need a `method` property to know what to use here
                                // i.e. GET, POST, PUT, DELETE
//                                TrackingService.trackApiCall(btnLink);
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
                function ($log, $rootScope)
                {
                    $log.debug('npButton::component loaded!');
                }
        );