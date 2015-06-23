'use strict';
angular
        .module(
                'npAccordion',
                []
                );
angular
        .module('npAccordion')
        /** @ngInject */
        .controller('npAccordionController',
                function ($log, $scope, $sce, $element) {
                    var cmpData = $scope.component.data,
                            collapseAllBoolean = $scope.component.collapseAll,
                            visitedState,
                            iconVisitedState,
                            iconCheckmark,
                            iconMinus,
                            iconPlus,
                            thisButton,
                            contentTop,
                            contentTopHeight,
                            accordionWrapperHeight,
                            accordionWrapper;
                    this.visitedState = visitedState = $scope.component.visited;
                    accordionWrapper = $element.find('.accordion-wrapper');
                    contentTop = $element.find('.content-top');
                    iconPlus = $element.find('.elx-thin-plus');
                    iconMinus = $element.find('.elx-thin-minus');
                    //////////////////////////////////////////////////////////////////////////////////////
                    // on ready
                    //////////////////////////////////////////////////////////////////////////////////////
                    setTimeout(function () {
                        $scope.$apply(function () {
                            contentTopHeight = contentTop.outerHeight(true);
                            accordionWrapperHeight = accordionWrapper.outerHeight(true);
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npAccordionController::data:::::::::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n:: contentTop ::', contentTop,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            TweenMax.set(accordionWrapper, {
                                height: contentTopHeight
                            });
                            TweenMax.set(iconMinus, {
                                autoAlpha: 0
                            });
                            TweenMax.set(iconPlus, {
                                autoAlpha: 1
                            });
                            accordionWrapper.addClass("closed");
                        });
                    });
                    $log.debug('npAccordion::data', cmpData);
                    this.contentTop = $sce.trustAsHtml(cmpData.contentTop);
                    this.contentBodyItems = cmpData.contentBodyItem;
                    this.contentItem = cmpData.contentItem;
                    $log.debug('npAccordion::content', $scope.content);
                    if (!!visitedState) {
                        //////////////////////////////////////////////////////////////////////////////////////
                        // on ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                iconVisitedState = $element.find('.accordion-visited-state');
                                iconCheckmark = $element.find('.checkmark-icon');
                                TweenMax.to(iconCheckmark, 1, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                            });
                        });
                    }
                    this.update = function (event) {
                        thisButton = event.currentTarget;
                        if (!accordionWrapper.hasClass("closed")) {
                            TweenMax.to(accordionWrapper, 1, {
                                height: contentTopHeight,
                                ease: Power4.easeOut
                            });
                            TweenMax.to(iconMinus, 1, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to(iconPlus, 1, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            accordionWrapper.addClass("closed");
                        } else {
                            if (collapseAllBoolean) {
                                $.each($('.accordion-wrapper'), function () {
                                    var height = $(this).find('.content-top').outerHeight(true);
                                    TweenMax.to($(this), 1, {
                                        height: height,
                                        ease: Power4.easeOut
                                    });
                                });
                                TweenMax.to($('.elx-thin-plus'), 1, {
                                    autoAlpha: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($('.elx-thin-minus'), 1, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to(accordionWrapper, 1, {
                                    height: accordionWrapperHeight,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to(iconMinus, 1, {
                                    autoAlpha: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to(iconPlus, 1, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                                accordionWrapper.addClass("closed");
                            } else {
                                TweenMax.set(accordionWrapper, {
                                    height: "auto"
                                });
                                TweenMax.from(accordionWrapper, 1, {
                                    height: contentTopHeight,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to(iconMinus, 1, {
                                    autoAlpha: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to(iconPlus, 1, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                                accordionWrapper.removeClass("closed");
                            }
                        }
                        if (!!visitedState) {
                            iconVisitedState = $element.find('.accordion-visited-state');
                            iconCheckmark = $element.find('.checkmark-icon');
                            TweenMax.set(iconCheckmark, {
                                marginTop: '20px',
                                transformOrigin: "center center",
                                scale: 0.25
                            });
                            TweenMax.to(iconCheckmark, 1, {
                                autoAlpha: 1,
                                marginTop: '0px',
                                transformOrigin: "center center",
                                scale: 1,
                                ease: Power4.easeOut
                            });
                        }
                    };
                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npAccordion::component loaded!');
                }
        );