/* jshint -W003, -W117 */
'use strict';
angular
        .module('npProgressUi', []);
angular
        .module('npProgressUi')
        /** @ngInject */
        .controller('npProgressUiController',
                function ($log, $scope, $sce, $location, $element, ConfigService, ManifestService, APIService) {
                    var cmpData = $scope.component.data || {},
                            btnContentNext = cmpData.contentNext,
                            btnContentPrevious = cmpData.contentPrevious,
                            btnLink = cmpData.link,
                            buttonType = cmpData.type,
                            $closestPage = '',
                            $closestPageIDX = '';
                    $log.debug('npProgressUi::data', cmpData);
                    this.content = '';
                    if (angular.isString(btnContentNext)) {
                        this.contentNext = $sce.trustAsHtml(btnContentNext);
                    }
                    if (angular.isString(btnContentPrevious)) {
                        this.contentPrevious = $sce.trustAsHtml(btnContentPrevious);
                    }
                    this.link = '';
                    this.target = cmpData.target;
                    this.npProgressUi = buttonType;
                    this.linkInternal = true;
                    this.apiLink = false;
                    //////////////////////////////////////////////////////////////////////////////////////
                    //set states after two cycles
                    //////////////////////////////////////////////////////////////////////////////////////
                    setTimeout(function () {
                        $scope.$apply(function () {
                            var contentWidth = $('.container').width();
                            TweenMax.set($('.progress-ui-wrapper'), {
                                width: contentWidth
                            });
                        });
                    });
                    //////////////////////////////////////////////////////////////////////////////////////
                    // check type and add class if next button type
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
                        } else {
                            if (btnLink.indexOf('#') === 0) {
                                btnLink = btnLink.substr(1);
                            } else {
                                btnLink = '/' + ConfigService.getManifestId() + '/' + btnLink;
                            }
                        }
                        $log.debug('npProgressUi::link', btnLink);
                        this.link = $sce.trustAsResourceUrl(btnLink);
                    }
//                    $closestPage = $element.closest("[data-cmptype='npPage']");
//                    var currentPage = $element.find("[ng-show=true]");
                    var currentPage = $element.find("[data-cmptype='npPage']");
                    var pageArray = $("[data-cmptype='npPage']");
//                    $closestPageIDX = $closestPage.attr("idx");
                    var ind = $.inArray($closestPage, pageArray);
//                    var currentPage = ManifestService.getRelativePagePosition($closestPageIDX);
//                    var currentPage = ManifestService.getRelativePagePosition($activePage);
                    var numberOfPages = ManifestService.getAll('npPage').length;
                    console.log(
                            '\n::::::::::::::::::::::::::::::::::::::percentageValue:::::::::::::::::::::::::::::::::::::::::::::::::',
                            '\n::$closestPage::', $closestPage,
//                            '\n::$activePage::', $activePage,
                            '\n::currentPage::', currentPage,
                            '\n::numberOfPages::', numberOfPages,
//                            '\n::$closestPageIDX::', $closestPageIDX,
                            '\n::pageArray::', pageArray,
                            '\n::ind::', ind,
                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                            );
                    //////////////////////////////////////////////////////////////////////////////////////
                    // Ratio Conversion
                    // @param {init} currentValue: in this case the curent page number
                    // @param {init} ratioValue: total number of pages
                    //////////////////////////////////////////////////////////////////////////////////////
                    function getPercentage(currentValue, ratioValue) {
                        var ratio = currentValue / ratioValue;
                        var percentage = ratio * 100;
                        return percentage;
                    }
                    var percentageValue = Math.round(getPercentage(currentPage, numberOfPages)) + '%';
                    console.log(
                            '\n::::::::::::::::::::::::::::::::::::::percentageValue:::::::::::::::::::::::::::::::::::::::::::::::::',
                            '\n::percentageValue::', percentageValue,
                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                            );
                    TweenMax.set($('.progress-indicator'), {
                        autoAlpha: 0,
                        width: '0%'
//                        drawSVG: '0%'
                    });
                    TweenMax.to($('.progress-indicator'), 0, {
                        autoAlpha: 1,
                        width: percentageValue + '%',
                        strokeWidth: '5px',
//                        drawSVG: "20% 80%",
//                        drawSVG: '50%',
                                ease: Power4.easeOut
                    });
                    if (currentPage !== numberOfPages) {
                        this.goNext = function () {
                            ManifestService.getRelativePagePosition($closestPageIDX);
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::$closestPageIDX::goNext:::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::$element::', $element,
//                                    '\n::currentPage::', currentPage,
//                                    '\n::$closestPageIDX::', $closestPageIDX,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            ManifestService.goToNextPage($closestPageIDX);
                        };
                    }

                    if (currentPage !== 1) {
                        this.goPrevious = function () {
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::$closestPageIDX:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::$element::', $element,
//                                    '\n::currentPage::', currentPage,
//                                    '\n::$closestPageIDX::', $closestPageIDX,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            ManifestService.goToPreviousPage($closestPageIDX);
                        };
                    }

                    if (currentPage === 1) {
                        TweenMax.to($('.progress-previous'), 0.5, {
                            autoAlpha: 0.25,
                            ease: Power4.easeOut
                        });
                    }
                    if (currentPage === numberOfPages) {
                        TweenMax.to($('.progress-next'), 0.5, {
                            autoAlpha: 0.25,
                            ease: Power4.easeOut
                        });
                    }

                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npProgressUi::component loaded!');
                }
        );