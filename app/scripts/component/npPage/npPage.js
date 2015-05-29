'use strict';
angular
        .module('npPage', []);
angular
        .module('npPage')
        /** @ngInject */
        .controller('npPageController',
                function ($log, $scope, $rootScope, $state, ManifestService) {
                    var cmpData = $scope.component.data || {};
                    $log.debug('npPage::data', cmpData, $scope.contentTitle);
                    this.title = cmpData.title;
                    var parentIdx = $scope.component.idx.slice(0);
                    parentIdx.pop();
                    var pageId = ManifestService.getPageId();
                        console.log(
                                '\n::::::::::::::::::::::::::::::::::::::npPageController::out:::::::::::::::::::::::::::::::::::::::::::::::',
                                '\n::pageId::', pageId,
                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                );
                    if (!pageId) {
                        var firstPageCmp = ManifestService.getFirst('npPage', parentIdx);
                        pageId = firstPageCmp.data.id;
                        ManifestService.setPageId(pageId);
                        console.log(
                                '\n::::::::::::::::::::::::::::::::::::::npPageController::in::!pageId:::::::::::::::::::::::::::::::::::::::::::::',
                                '\n::pageId::', pageId,
                                '\n::firstPageCmp::', firstPageCmp,
                                '\n::parentIdx::', parentIdx,
                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                );
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
                        } else {
                            $scope.currentPage = false;
                        }
                    }
                }
        )
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npPage::component loaded!');
                }
        );