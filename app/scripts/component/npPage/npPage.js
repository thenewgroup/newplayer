'use strict';
angular
        .module('npPage', []);
angular
        .module('npPage')
        /** @ngInject */
        .controller('npPageController',
                function ($log, $scope, $rootScope, $state, ManifestService) {
                    var cmpData = $scope.component.data || {},
                            pageId,
                            parentIdx,
                            backgroundDiv,
                            referencedBackgroundImageFilename,
                            backgroundAlpha,
                            backgroundImage;
                    $log.debug('npPage::data', cmpData, $scope.contentTitle);
                    this.title = cmpData.title;
                    parentIdx = $scope.component.idx.slice(0);
                    backgroundAlpha = $scope.component.data.backgroundAlpha;
                    parentIdx.pop();
                    pageId = ManifestService.getPageId();
//                    console.log(
//                            '\n::::::::::::::::::::::::::::::::::::::npPageController::backgroundAlpha:::::::::::::::::::::::::::::::::::::::::::::',
//                            '\n::$scope.component.data::', $scope.component.data,
//                            '\n::backgroundAlpha::', backgroundAlpha,
//                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                            );
                    if (!pageId) {
                        var firstPageCmp = ManifestService.getFirst('npPage', parentIdx);
                        pageId = firstPageCmp.data.id;
                        ManifestService.setPageId(pageId);
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::npPageController::in::!pageId:::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::pageId::', pageId,
//                                '\n::firstPageCmp::', firstPageCmp,
//                                '\n::parentIdx::', parentIdx,
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
                        $log.debug('npPage::set page', pageId);
                    }
                    npPageIdChanged(null, pageId);
                    $rootScope.$on('npPageIdChanged', npPageIdChanged);
                    function npPageIdChanged(event, newPageId) {
                        pageId = newPageId;
                        // check if current route is for this page
                        $log.debug('npPage::on current page?', ManifestService.getPageId(), cmpData.id);
                        if (cmpData.id === pageId) {
                            $scope.currentPage = true;
                            $scope.npPage = $scope;
                            // set page title
                            if ($rootScope.PageTitle) {
                                $rootScope.PageTitle += ': ' + cmpData.title;
                            } else {
                                $rootScope.PageTitle = cmpData.title;
                            }
                            var img = backgroundDiv = document.getElementById('background-image'),
//                                    style = img.currentStyle || window.getComputedStyle(img, false),
//                                    currentBackgroundImage = style.backgroundImage.slice(4, -1),
                                    currentBackgroundImageFilename;
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npPageController::out:::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n::img::', img,
//                                    '\n::backgroundDiv::', backgroundDiv,
//                                    '\n::currentBackgroundImage::', currentBackgroundImage,
//                                    '\n::cmpData.backgroundImage::', cmpData.backgroundImage,
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            if (!!cmpData.backgroundImage) {
                                referencedBackgroundImageFilename = cmpData.backgroundImage.split('/').pop();
                                currentBackgroundImageFilename = cmpData.backgroundImage.split('/').pop();
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::npPageController::!!cmpData.backgroundImage:::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::currentBackgroundImageFilename::', currentBackgroundImageFilename,
//                                        '\n::referencedBackgroundImageFilename::', referencedBackgroundImageFilename,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
                                if (referencedBackgroundImageFilename === currentBackgroundImageFilename) {
                                    //////////////////////////////////////////////////////////////////////////////////////
                                    //set states after two cycles
                                    //////////////////////////////////////////////////////////////////////////////////////
                                    setTimeout(function () {
                                        $scope.$apply(function () {
//                                            console.log(
//                                                    '\n::::::::::::::::::::::::::::::::::::::npPageController::in:::::::::::::::::::::::::::::::::::::::::::::::',
//                                                    '\n::currentBackgroundImage::', currentBackgroundImage,
//                                                    '\n::cmpData.backgroundImage::', cmpData.backgroundImage,
//                                                    '\n::currentBackgroundImageFilename::', currentBackgroundImageFilename,
//                                                    '\n::referencedBackgroundImageFilename::', referencedBackgroundImageFilename,
//                                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                                    );
                                            TweenMax.to(backgroundDiv, 0.25, {
                                                force3D: true,
                                                autoAlpha: 0,
                                                ease: Power4.easeOut, onComplete: function () {
                                                    backgroundDiv.style.backgroundImage = 'url(' + cmpData.backgroundImage + ')';
                                                    TweenMax.to(backgroundDiv, .75, {
                                                        force3D: true,
                                                        autoAlpha: backgroundAlpha,
                                                        ease: Power4.easeOut
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }
                            }
                        } else {
                            $scope.currentPage = false;
                        }
                    }
                    function GetFilename(url) {
                        if (url) {
                            return url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
                        }
                        return "";
                    }
//                    function GetFilename(url) {
//                        if (url) {
//                            var m = url.toString().match(/.*\/(.+?)\./);
//                            if (m && m.length > 1) {
//                                return m[1];
//                            }
//                        }
//                        return "";
//                    }
                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npPage::component loaded!');
                }
        );