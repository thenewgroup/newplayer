(function () {
    'use strict';
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpHotspot mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
    angular
            .module('newplayer.component')
            .controller('npRevealController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data,
                                revealItems = $scope.component.revealItems,
                                revealItemsIndex = $scope.component.idx,
                                revealItemsButtonImage = $scope.component.revealItems.buttonImage;
                        var buttonData = $scope.feedback || {};
                        this.revealItems = $scope.component.revealItems;
                        this.revealItemComponent = $scope.component.revealItems[0];
                        this.revealItemComponents = $scope.component.revealItems;
                        this.revealItemVideoType = $scope.component.baseURL;
                        this.id = cmpData.id;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.feedback = this.feedback = cmpData.feedback;
                        $scope.image = this.image = cmpData.image;
                        $log.debug('npReveal::data', cmpData, buttonData);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        var tid = setInterval(function () {
                            if (document.readyState !== 'complete') {
                                return;
                            }
                            clearInterval(tid);
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on ready set states
                            //////////////////////////////////////////////////////////////////////////////////////
                            TweenMax.to($(".reveal-object"), 0, {
                                autoAlpha: 0
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //finish ready check items
                            //////////////////////////////////////////////////////////////////////////////////////
                        }, 100);
                        this.update = function (button) {
                            var idx = this.revealItems.indexOf(button);
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::reveal::array data tests:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n:::', idx,
//                                    '\n:::', button,
//                                    '\n:::', $('video').length,
//                                    '\n:::', revealItems[idx].components[0],
//                                    '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change stop and reset all video files
                            //////////////////////////////////////////////////////////////////////////////////////
                            $('video').each(function () {
                                this.pause();
                                this.currentTime = 0;
                                this.load();
                            });
                            //////////////////////
                            TweenMax.to($(".reveal-object"), 0, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(".reveal-object")[idx], 0.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                        };
                    }
            )
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npHotspot::component loaded!');
                    }
            );
})();