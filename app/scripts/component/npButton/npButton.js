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
                        }
                        this.link = '';
                        this.target = cmpData.target;
                        this.npButton = buttonType;
                        this.linkInternal = true;
                        this.apiLink = false;
                        var btnLink = cmpData.link;
                        var buttonType = cmpData.type;
                        var $buttonTypeFavorite = '';
                        //////////////////////////////////////////////////////////////////////////////////////
                        //check type and add class if next button type
                        //////////////////////////////////////////////////////////////////////////////////////
                        if (typeof buttonType !== 'undefined' && buttonType === 'btn-next') {
                            $scope.buttonTypeClass = buttonType;
                        }
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npButtonController::$scope.buttonTypeClass = btn-open-favorites:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::cmpData::', cmpData,
//                                    '\n::cmpData::', cmpData.class,
//                                    '\n::$scope.buttonTypeClass::', $scope.buttonTypeClass,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
//                        if ($element.find('.btn-open-favorites')) {
//                            $element.find('.btn-open-favorites').find('.elx-heart').addClass('favorites-icon');
//                        }
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::npButtonController::$scope.buttonTypeClass:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::cmpData::', cmpData,
//                                '\n::cmpData::', cmpData.class,
//                                '\n::cmpData::', cmpData.content.span,
//                                '\n::$element::', $element.find('.elx-heart'),
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
//                        $('.elx-heart').addClass('icon-favorites');
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::npButtonController::$scope.buttonTypeClass:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::$element.find(.elx-heart)::', !!$element.find('.elx-heart'),
//                                '\n::$element.find(.icon-favorites)::', $element.find('.icon-favorites'),
//                                '\n::$element.find(.icon-favorites)::', !!$element.find('.icon-favorites'),
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );

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
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npButtonController::$scope.buttonTypeClass:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::!!$element.find(.elx-heart)::', !!$element.find('.elx-heart'),
//                                    '\n::!!$element.find(.elx-heart-filled)::', $('.elx-heart-filled'),
//                                    '\n::$element.find(.icon-favorites).hasClass(.elx-heart)::', $('.icon-favorites').hasClass('.elx-heart'),
//                                    '\n::$element.find(.icon-favorites).hasClass(.elx-heart-filled)::', $('.icon-favorites').hasClass('.elx-heart-filled'),
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
//                            $element.find('.icon-favorites').toggle(function () {
//                                $element.find('.icon-favorites').addClass('elx-heart-filled');
//                                $element.find('.icon-favorites').removeClass('elx-heart');
//                            }, function () {
//                                $element.find('.icon-favorites').addClass('elx-heart').removeClass('elx-heart-filled');
//                            });
//                            if ($element.find('.icon-favorites').hasClass('.elx-heart')) {
//                                $element.find('.icon-favorites').addClass('elx-heart-filled').removeClass('elx-heart');
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::npButtonController::elx-heart-:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::!!$element.find(.elx-heart)::', !!$element.find('.elx-heart'),
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
//                            }else if ($element.find('.icon-favorites').hasClass('.elx-heart-filled')) {
//                                $element.find('.icon-favorites').addClass('elx-heart').removeClass('elx-heart-filled');
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::npButtonController::elx-heart-filled:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::!!$element.find(.elx-heart-filled)::', !!$element.find('.elx-heart-filled'),
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
//                            }
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npButtonController::$scope.buttonTypeClass:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::$element.find(.btn-open-favorites)::', !!$element.find('.btn-open-favorites'),
//                                    '\n::$element::', $element.find('.elx-heart'),
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
//                            $('.btn-open-favorites').toggle(function () {
//                                $('.play', this).removeClass('pausing');
//                                $('.play', this).addClass('playing');
//                            }, function () {
//                                $('.play', this).addClass('pausing');
//                                $('.play', this).removeClass('playing');
//                            });
//                            
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
                                ManifestService.goToNextPage();
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