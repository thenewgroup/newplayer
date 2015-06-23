'use strict';
angular
        .module(
                'npMenu',
                []
                );

/** @ngInject */
function npMenuDirective($log, $compile/*, $stateParams, $state, $timeout*/) {
    $log.debug('\nnpMenuDirective::Init\n');
    var Directive = function () {
        this.restrict = 'EA';
        this.scope = {'menuitem': '='};
        this.template =
                '<a ng-href="{{menuitem.link}}" target="{{menuitem.target}}" id="menu{{menuitem.id}}" ng-class="(menuitem.current===true) ? \'selected\' : \'\'">{{ menuitem.text }}</a>' +
                '<ul>' +
                '<li ng-repeat="child in menuitem.children">' +
                '<span np-menu menuitem="child"></span>' +
                '</li>' +
                '</ul>';
        this.compile = function (tElement, tAttrs, transclude) {
            var contents = tElement.contents().remove();
            $log.debug('npMenu::compile', contents);
            var compiled;
            /** @ngInject */
            return function ($scope, $element, $attributes) {
                if (!compiled) {
                    compiled = $compile(contents);
                }
                compiled($scope, function (clone) {
                    $log.debug('npMenu::compile:linked', clone);
                    $element.append(clone);
                });
            };
        };
    };
    return new Directive();
}
angular
        .module('npMenu')
        /** @ngInject */
        .controller('npMenuController',
                function ($log, $scope, ManifestService, ConfigService, $sce, $element) {
                    var cmpData = $scope.component.data || {};
                    $log.debug('npMenu::data', cmpData);
                    this.items = (cmpData || {}).items;
                    if (!angular.isArray(this.items)) {
                        this.items = new Array('pages');
                    }
                    this.title = cmpData.title;
                    this.titleDefault = cmpData.titleDefault;
                    var menuHeadWrapper = $element.find('.menu-head-wrapper');
                    var menuItemTitle = $element.find('.menu-item-title');
                    var menuItemTitleDefault = $element.find('.menu-item-title-default');
                    var menuWrapper = $element.find('.menu-item-wrapper');
                    var iconDown = $element.find('.elx-carat-down');
                    var iconClose = $element.find('.elx-menu-close');
                    var menuItems = $element.find('.menu-item');
                    function initState() {
                        TweenMax.set(menuHeadWrapper, {
                            force3D: true,
                            backgroundColor: 'rgba(0, 0, 0, 0.01)',
                            ease: Power4.easeOut
                        });
                        TweenMax.set(menuItemTitle, {
                            force3D: true,
                            color: 'rgba(27, 156, 59, 0.01)',
                            ease: Power4.easeOut
                        });
                        TweenMax.set(menuWrapper, {
                            force3D: true,
                            height: '0px',
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
                        TweenMax.set(iconDown, {
                            force3D: true,
                            autoAlpha: 1,
                            ease: Power4.easeOut
                        });
                        TweenMax.set(iconClose, {
                            force3D: true,
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
                        TweenMax.set(menuItems, {
                            force3D: true,
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
                    }
                    initState();
//                    console.log(
//                            '\n::::::::::::::::::::::::::::::::::::::npMenuController:::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
//                            '\n::menuHeadWrapper::', menuHeadWrapper,
//                            '\n::$element::', $element.find('.menu-item-wrapper'),
//                            '\n::cmpData::', cmpData,
//                            '\n::cmpData.title::', cmpData.title,
//                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                            );
                    for (var itemIdx in this.items) {
                        var item = this.items[ itemIdx ];
                        if (item === 'pages') {
                            // have pages been indexed?
                            $log.debug('inside content scope', $scope.currentContent);
                            if (!$scope.currentContent.pages) {
                                var parentIdx = $scope.component.idx.slice(0);
                                parentIdx.pop();
                                // index pages
                                var pages = ManifestService.getAll('npPage', parentIdx);
                                var nestedPages = [];
                                for (var pageIdx in pages) {
                                    var page = pages[pageIdx];
                                    $log.debug('npPage::index:', page);
                                    if (!!page.data && page.data.inMenu) {
                                        var aPage = {
                                            id: page.data.id,
                                            link: '#/' + ConfigService.getManifestId() + '/' + page.data.id,
                                            text: page.data.menuTitle || page.data.title,
                                            children: []
                                        };
                                        if (ManifestService.getPageId() === aPage.id) {
                                            $log.debug('npPage::index:current:', page);
                                            // TBD - need to be able to adjust current page
                                            // disabling for now
                                            //aPage.current = true;
                                        }
                                        var parentId = page.data.parentId;
                                        $log.debug('npPage::index:parent?', parentId);
                                        if (!parentId) {
                                            $log.debug('npPage::index:top level:', aPage);
                                            nestedPages.push(aPage);
                                        } else {
                                            $log.debug('npPage::index:nest:', parentId, aPage);
                                            for (var parentPage in nestedPages) {
                                                $log.debug('npPage::index:nest:isEqual?', parentId, nestedPages[parentPage].id);
                                                if (nestedPages[parentPage].id === parentId) {
                                                    nestedPages[parentPage].children.push(aPage);
                                                }
                                            }
                                        }
                                    }
                                }
                                $log.debug('npPage::index results:', nestedPages);
                                $scope.currentContent.pages = nestedPages;
                            } else {
                                // TBD - edit pages $scope.currentContent.pages array to reset current page
                            }
                            $log.debug('npMenu::pages', $scope.pages);
                            var spliceArgs = [itemIdx, 1].concat($scope.pages);
                            Array.prototype.splice.apply(this.items, spliceArgs);
                        }
                    }
                    $scope.isActive = true;
                    $scope.menuStatus = function () {
                        if (!!$scope.isActive) {
                            TweenMax.to(menuHeadWrapper, .75, {
                                force3D: true,
                                backgroundColor: 'rgba(0, 0, 0, 1)',
                                ease: Power4.easeOut
                            });
                            TweenMax.to(menuItemTitle, .75, {
                                force3D: true,
                                color: 'rgba(27, 156, 59, 1)',
                                ease: Power4.easeOut
                            });
                            TweenMax.to(menuItemTitleDefault, .75, {
                                force3D: true,
                                color: 'rgba(255, 255, 255, 0.01)',
                                ease: Power4.easeOut
                            });
                            TweenMax.to(menuWrapper, .75, {
                                force3D: true,
                                height: 'auto',
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.to(iconDown, .75, {
                                force3D: true,
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to(iconClose, .75, {
                                force3D: true,
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.staggerTo(menuItems, .75, {
                                force3D: true,
                                autoAlpha: 1,
                                delay: 0.05,
                                ease: Power4.easeOut
                            }, 0.25);
                        } else {
                            TweenMax.to(menuHeadWrapper, .75, {
                                force3D: true,
                                backgroundColor: 'rgba(0, 0, 0, 0.01)',
                                ease: Power4.easeOut
                            });
                            TweenMax.to(menuItemTitle, .75, {
                                force3D: true,
                                color: 'rgba(0, 0, 0, 0.01)',
                                ease: Power4.easeOut
                            });
                            TweenMax.to(menuItemTitleDefault, .75, {
                                force3D: true,
                                color: 'rgba(255, 255, 255, 1)',
                                ease: Power4.easeOut
                            });
                            TweenMax.to(menuWrapper, .75, {
                                force3D: true,
                                height: '0px',
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to(iconDown, .75, {
                                force3D: true,
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.to(iconClose, .75, {
                                force3D: true,
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.staggerTo(menuItems, .75, {
                                force3D: true,
                                autoAlpha: 0,
                                delay: 0.05,
                                ease: Power4.easeOut
                            }, 0.25);
                        }
                        $scope.isActive = !$scope.isActive;
                        console.log(
                                '\n::::::::::::::::::::::::::::::::::::::npMenuController::menuStatus:::::::::::::::::::::::::::::::::::::::::::::::::::::::',
                                '\n::$scope.isActive::', $scope.isActive,
                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                );
                    };
                    $log.debug('npMenu::items', this.items);
                }
        )
        .directive('npMenu', npMenuDirective)
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npMenu::component loaded!');
                }
        );