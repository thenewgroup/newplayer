(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npHTMLController',
                    function ($log, $scope, $rootScope) {
                        var vm = this,
                                cmpData = $scope.component.data,
                                content = null;
                        $log.debug('npHTML::data', cmpData);
//                        console.log(':: cmpData :: ', cmpData);

                        if (cmpData.link) {
                            this.link = cmpData.link;
                        }
                        this.content = cmpData.content;
                        $log.info('npHTML::content', $scope.content, this.content, cmpData.link);
                        this.handleLink = function () {
                            $log.info('npHTML:handleLink | link is a manifest');
                            $rootScope.$broadcast('npReplaceManifest', cmpData.link);
                        };
                        ////////////////////////////////////////////////////////////
                        ////////////////////////////////////////////////////////////
                        var isCollapsed = false;
                        var eleHeight;
                        var bodyWidth;
                        $scope.$watch(function () {
                            return window.innerWidth;
                        }, function (value) {
//                            console.log('innerWidth:',value);
                            bodyWidth = value;
                        });
                        $scope.selectLink = function (MyTarget) {
//                            var ele = document.getElementById(MyTarget);
//                            var icon = document.getElementById('caretSVG');
//                            console.log('bodyWidth: ' + bodyWidth);
                            if (bodyWidth < 450) {
                                eleHeight = '2150px';
                            } else if (bodyWidth < 650) {
                                eleHeight = '1650px';
                            } else if (bodyWidth < 750) {
                                eleHeight = '1050px';
                            } else if (bodyWidth < 1250) {
                                eleHeight = '950px';
                            } else {
                                eleHeight = '850px';
                            }
//                            console.log('eleHeight: ' + eleHeight);
                            if (isCollapsed) {
                                TweenMax.to(icon, .75, {
                                    css: {
                                        transformOrigin: "50% 50%",
                                        rotation: 0
                                    },
                                    ease: Cubic.easeOut
                                });
                                TweenMax.to(ele, .75, {
                                    css: {
                                        autoAlpha: 0,
                                        height: "10px"
                                    },
                                    ease: Cubic.easeOut
                                });
                                isCollapsed = !isCollapsed;
                            } else if (!isCollapsed) {
                                TweenMax.to(icon, .75, {
                                    css: {
                                        transformOrigin: "50% 50%",
                                        rotation: 90
                                    },
                                    ease: Cubic.easeOut
                                });
                                TweenMax.to(ele, 1.25, {
                                    css: {
                                        autoAlpha: 1,
                                        height: eleHeight
                                    },
                                    ease: Cubic.easeOut
                                });
                                isCollapsed = !isCollapsed;
                            }
                        };
                        ////////////////////////////////////////////////////////////
                        ////////////////////////////////////////////////////////////
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npHTML::component loaded!');
                    }
            );
})();
