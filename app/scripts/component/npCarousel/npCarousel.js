//'use strict';
/*jshint bitwise: false, -W003, -W117*/
angular
        .module('npCarousel', [])
        .service('sharedService',
                function () {
                    return {
                        currentIndex: {
                            idx: 0
                        }
                    };
                });
/** @ngInject */
function npMediaElementDirective($log) {
    $log.debug('\nnpDragAndMatch mediaelementDirective::Init\n');
    var Directive = function () {
        this.restrict = 'A';
        this.link = function ($scope, $element, attrs, controller) {
        };
    };
    return new Directive();
}
angular
        .module('npCarousel')
        .controller('npCarouselController',
                function ($log, $scope, $sce, $element, sharedService) {
                    var cmpData = $scope.component.data,
                            stackLength,
                            contentAreaCenter,
                            outsidePaddingOffset,
                            outsidePaddingCenter,
                            buttonData = $scope.feedback || {},
                            indexValue,
                            indexValueNext,
                            scaleLevel_0,
                            scaleLevel_1,
                            scaleLevel_2,
                            scaleLevel_3,
                            scaleLevel_4,
                            itemAutoAlpha_0,
                            itemAutoAlpha_1,
                            itemAutoAlpha_2,
                            itemAutoAlpha_3,
                            itemAutoAlpha_4,
                            outsidePaddingCenter,
                            outsidePaddingOffset,
                            contentObjectCenter;
                    this.carouselComponent = $scope.component.carouselItem[0];
                    this.carouselComponents = $scope.component.carouselItem;
                    this.id = cmpData.id;
                    this.baseURL = cmpData.baseURL;
                    this.src = cmpData.image;
                    $scope.feedback = this.feedback = cmpData.feedback;
                    $scope.image = this.image = cmpData.image;
                    $log.debug('npCarousel::data', cmpData, buttonData);
                    //////////////////////////////////////////////////////////////////////////////////////
                    //
                    //////////////////////////////////////////////////////////////////////////////////////
                    setTimeout(function () {
                        $scope.$apply(function () {
                            if (typeof indexValue === "undefined") {
                                indexValue = 0;
                            }
                            stackLength = $(".np-carousel-object").length;
                            outsidePaddingCenter = $('.np_outside-padding').width() / 2;
                            outsidePaddingOffset = $('.np_outside-padding').offset();
                            contentAreaCenter = outsidePaddingCenter;
                            contentObjectCenter = $element.find(".np-carousel-object").width() / 2;
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npCarouselController::updateLeft:::::::::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n:: indexValue ::', indexValue,
//                                    '\n:: $scope.image ::', $scope.image,
//                                    '\n:: outsidePaddingCenter ::', outsidePaddingCenter,
//                                    '\n:: outsidePaddingOffset ::', outsidePaddingOffset.left,
//                                    '\n:: contentAreaCenter ::', contentAreaCenter,
//                                    '\n:: $(".np-carousel-object")[indexValue] ::', $(".np-carousel-object")[indexValue],
//                                    '\n:: contentObjectCenter ::', contentObjectCenter,
//                                    '\n:: $element ::', $element.find(".np-carousel-object")[0],
//                                    '\n:: indexValue::', indexValue,
//                                    '\n:: contentAreaCenter - contentObjectCenter::', contentAreaCenter - contentObjectCenter,
//                                    '\n:: $(".np-carousel-object")::', $(".np-carousel-object"),
//                                    '\n:: $(".np-carousel-object")[indexValue]::', $(".np-carousel-object")[indexValue],
//                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            TweenMax.set($(".np-carousel-object"), {
                                force3D: true,
                                top: '0px',
                                left: contentAreaCenter - contentObjectCenter,
                                autoAlpha: 0,
                                scale: scaleLevel_0
                            });
                            TweenMax.to($(".np-carousel-object")[0], .75, {
                                force3D: true,
                                top: '0px',
                                left: contentAreaCenter - contentObjectCenter,
                                autoAlpha: 1,
                                scale: scaleLevel_0,
                                ease: Power4.easeOut
                            });
                            TweenMax.set($('.carousel-overlay'), {
                                force3D: true,
                                autoAlpha: 0
                            });
                        });
                    });
                    $scope.updateRight = function (carouselButton) {
                        if (indexValue < (stackLength - 1)) {
                            indexValueNext = indexValue = indexValue + 1;
                            $scope.setIndex(indexValueNext);
                            TweenMax.set($(".np-carousel-object"), {
                                force3D: true,
                                top: '0px',
                                left: contentAreaCenter - contentObjectCenter,
                                autoAlpha: 0,
                                scale: scaleLevel_0
                            });
                            TweenMax.to($(".np-carousel-object")[indexValueNext], .75, {
                                force3D: true,
                                top: '0px',
                                left: contentAreaCenter - contentObjectCenter,
                                autoAlpha: 1,
                                scale: scaleLevel_0,
                                ease: Power4.easeOut

                            });
                        }
                    };
                    $scope.updateLeft = function (carouselButton) {
                        if (indexValue > 0) {
                            indexValueNext = indexValue = indexValue - 1;
                            TweenMax.set($(".np-carousel-object"), {
                                force3D: true,
                                top: '0px',
                                left: contentAreaCenter - contentObjectCenter,
                                autoAlpha: 0,
                                scale: scaleLevel_0
                            });
                            TweenMax.to($(".np-carousel-object")[indexValueNext], .75, {
                                force3D: true,
                                top: '0px',
                                left: contentAreaCenter - contentObjectCenter,
                                autoAlpha: 1,
                                scale: scaleLevel_0,
                                ease: Power4.easeOut
                            });
                        }
                    };
                    //////////////////////////////////////////////////////////////////////////////////////
                    // set animation vaules
                    //////////////////////////////////////////////////////////////////////////////////////
                    scaleLevel_0 = 1;
                    scaleLevel_1 = 1;
                    scaleLevel_2 = 1;
                    scaleLevel_3 = 1;
                    scaleLevel_4 = 1;
                    itemAutoAlpha_0 = 1;
                    itemAutoAlpha_1 = 0;
                    itemAutoAlpha_2 = 0;
                    itemAutoAlpha_3 = 0;
                    itemAutoAlpha_4 = 0;
                    //////////////////////////////////////////////////////////////////////////////////////
                    // apply animation vaules
                    //////////////////////////////////////////////////////////////////////////////////////
                    $scope.setIndex = function (indexValue) {
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::CENTER:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::indexValue:', indexValue,
//                                '\n::$(".np-carousel-object")[indexValue]:', $(".np-carousel-object")[indexValue],
//                                '\n::$(".np-carousel-object").length:', $(".np-carousel-object").length,
//                                '\n::$(".np-carousel-object")[0].position().left:', $(".np-carousel-object")[0].offsetLeft,
//                                '\n::sharedService::', sharedService,
//                                '\n::$scope.someThing::', $scope.someThing,
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
                        var cardNumber = $(".np-carousel-object").length;
                        for (var i = 0; i < cardNumber; i++) {
                        }
                    };
                }
        )


        .directive('mediaelement', npMediaElementDirective)
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npCarousel::component loaded!');
                }
        );