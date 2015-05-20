//'use strict';
/*jshint bitwise: false, -W003, -W117*/
angular
        .module('npCarousel', ['npCarouselModule']);
/** @ngInject */
function npMediaElementDirective($log) {
    $log.debug('\nnpCarousel mediaelementDirective::Init\n');
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
                function ($log, $scope, $sce, $element) {
                    var cmpData = $scope.component.data,
                            carouselItem = $scope.component.carouselItem,
                            buttonData = $scope.feedback || {};
                    this.carouselComponent = $scope.component.carouselItem[0];
                    this.carouselComponents = $scope.component.carouselItem;
                    this.flashCardVideoType = $scope.component.baseURL;
                    this.id = cmpData.id;
                    this.baseURL = cmpData.baseURL;
                    this.src = cmpData.image;
                    $scope.feedback = this.feedback = cmpData.feedback;
                    $scope.image = this.image = cmpData.image;
                    $log.debug('npCarousel::data', cmpData, buttonData);
                    //////////////////////////////////////////////////////////////////////////////////////
                    //on button click do these things
                    //////////////////////////////////////////////////////////////////////////////////////
                    this.update = function (flashCardButton) {
                        var idx = carouselItem.indexOf(flashCardButton),
                                clickedFlashCard = $element.getElementsByClassName(".carousel-object")[idx];
                        TweenMax.killAll(false, true, false);
                        TweenMax.to(clickedFlashCard, 1, {
                            rotationY: 180,
                            ease: Power4.easeOut,
                            overwrite: 0
                        });
                        TweenMax.to(clickedFlashCard.getElementsByClassName('flash-card-back-wrapper'), 1, {
                            autoAlpha: 1,
                            ease: Power4.easeOut
                        });
                        TweenMax.to(clickedFlashCard.getElementsByClassName('flash-card-front-wrapper'), 1, {
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
                    };
                    //////////////////////////////////////////////////////////////////////////////////////
                    //set drag and drag end event handlers
                    //////////////////////////////////////////////////////////////////////////////////////
                    $scope.onDrag = function (value) {
                        $scope.currentRotation = value;
                    };
                    $scope.onDragEnd = function (value) {
                        $scope.currentRotation = value;
                    };
                }
        );
////////////////////////////////////////////////////////////////////////////////////////
//GSAP Swipeable/Snapable Angular directive!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
////////////////////////////////////////////////////////////////////////////////////////
angular.module('npCarouselModule', [])
        .directive("npCarouselDirective", function () {
            return {
                restrict: "A",
                scope: {
                    onDragEnd: "&",
                    onDrag: "&"
                },
                link: function ($scope, $element, attrs) {
                    //////////////////////////////////////////////////////////////////////////////////////
                    //set states
                    //////////////////////////////////////////////////////////////////////////////////////
                    setTimeout(function () {
                        $scope.$apply(function () {
                            TweenMax.set($('.flash-card-front-wrapper'), {
                                autoAlpha: 1
                            });
                            TweenMax.set($('.flash-card-back-wrapper'), {
                                autoAlpha: 0
                            });
                            TweenMax.set($('.flash-card-back-wrapper'), {
                                rotationY: -180
                            });
                            TweenMax.set([$('.flash-card-content-back'), $('.flash-card-content-front')], {
                                backfaceVisibility: "hidden"
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //set height
                            //////////////////////////////////////////////////////////////////////////////////////
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::getOffsetRect::$( #npHTML\\:0_0_1 ):::::::::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::$( #npHTML\\:0_0_1 )::', $("#npHTML\\:0_0_1").height(),
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
                            TweenMax.set($('.carousel-object'), {
                                height: '800px'
                            });
                            TweenMax.set($('.np_outside-padding'), {
                                height: '800px'
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //page build
                            //////////////////////////////////////////////////////////////////////////////////////
                            TweenMax.to($('#draggableContainer'), 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.from($('#carousel'), 2, {
                                left: '1000px',
                                force3D: true,
                                ease: Power4.easeOut
                            });
                            var $cardTwo = $(".carousel-object")[1];
                            TweenMax.set($($cardTwo).find('.flash-card-overlay'), {
                                force3D: true,
                                opacity: 0.5
                            });
                            TweenMax.to($cardTwo, .75, {
                                force3D: true,
                                zIndex: middle,
                                top: '10px',
                                rotationY: 0,
                                marginLeft: '-7em',
                                marginRight: '7em',
                                scale: 0.9,
                                z: '-35',
                                ease: Power4.easeOut
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //offset top on scroll
                            //////////////////////////////////////////////////////////////////////////////////////
                            var flashCardsOffset = $('.npCarousel').offset();
                            $(window).scroll(function () {
                                var windowPosition = $(window).scrollTop();
                                var doc = document.documentElement;
                                var topOffset = Math.round((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
                                TweenMax.to($('.npCarousel'), 1.25, {
                                    force3D: true,
                                    top: -(topOffset - flashCardsOffset.top - 10),
                                    ease: Power4.easeOut
                                });
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //finish ready check items
                            //////////////////////////////////////////////////////////////////////////////////////
                            var winWidth = 0;
                            setContainerDims();
                            function setContainerDims() {
                                winWidth = parseInt($(window).width());
                                $("#carousel").css({
                                    "width": winWidth,
                                    'bottom': '-30px'
                                });
                            }
                            $(window).resize(function () {
                                setContainerDims();
                            });
                            TweenMax.to($('#draggableContainer'), 5, {
                                autoAlpha: 0
                            });
                        });
                    });
                    //////////////////////////////////////////////////////////////////////////////////////
                    //offset method
                    //////////////////////////////////////////////////////////////////////////////////////
                    function getOffsetRect(elem) {
                        var box = elem.getBoundingClientRect();
                        var body = document.body;
                        var docElem = document.documentElement;
                        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
                        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
                        var clientTop = docElem.clientTop || body.clientTop || 0;
                        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
                        var top = box.top + scrollTop - clientTop;
                        var left = box.left + scrollLeft - clientLeft;
                        var bottom = top + (box.bottom - box.top);
                        var right = left + (box.right - box.left);
                        return {
                            top: Math.round(top),
                            left: Math.round(left),
                            bottom: Math.round(bottom),
                            right: Math.round(right)
                        };
                    }
                    //////////////////////////////////////////////////////////////////////////////////////
                    //drag and throw vars
                    //////////////////////////////////////////////////////////////////////////////////////
                    var front = '12003';
                    var middle = '12002';
                    var back = '12001';
                    var flashCardsDraggable;
                    var windowWidth;
                    var maxScroll;
                    var elementWrapper;
                    var elementIteration;
                    var sections;
                    var elementWidth;
                    var dragAreaWidth;
                    var dragAreaLeftPadding;
                    var nativeSCrl = true;
                    //////////////////////////////////////////////////////////////////////////////////////
                    //drag and throw conditionals & animation
                    //////////////////////////////////////////////////////////////////////////////////////
                    function updateAnimation() {
                        var windowCenter = $(window).width() / 2;
                        for (var i = elementIteration.length - 1; i >= 0; i--) {
                            TweenMax.set(elementIteration, {
                                transformPerspective: "1000"
                            });
                            var currentIteration = elementIteration[i],
                                    currentIterationWidth = currentIteration.offsetWidth,
                                    currentIterationCenterWidth = (currentIterationWidth / 2),
                                    itemsOffset = getOffsetRect(currentIteration),
                                    itemsOffsetLeft = itemsOffset.left,
                                    itemsOffsetCenter = (itemsOffsetLeft + currentIterationCenterWidth),
                                    windowCenterOffsetOne = ($(".carousel-object").width() / 3),
                                    windowCenterOffsetTwo = $(".carousel-object").width(),
                                    itemTopCenter,
                                    itemAutoAlphaCenter,
                                    itemAutoAlphaOne,
                                    itemAutoAlphaTwo,
                                    itemBlurCenter,
                                    itemBlurOne,
                                    itemBlurTwo,
                                    itemMarginOffsetOne,
                                    itemMarginOffsetTwo;
                            //////////////////////////////////////////////////////////////////////////////////////
                            //set animation params
                            //////////////////////////////////////////////////////////////////////////////////////
                                windowCenterOffsetTwo = windowCenterOffsetTwo + 10;
                                itemTopCenter = '10px';
                                itemAutoAlphaCenter = 1;
                                itemAutoAlphaOne = 1;
                                itemAutoAlphaTwo = 1;
                                itemBlurCenter = 0;
                                itemBlurOne = 0;
                                itemBlurTwo = 0;
                                itemMarginOffsetOne = '0em';
                            //////////////////////////////////////////////////////////////////////////////////////
                            //drag and throw CENTER item animation
                            //////////////////////////////////////////////////////////////////////////////////////
                            if ((itemsOffsetCenter <= (windowCenter + windowCenterOffsetOne)) && (itemsOffsetCenter >= (windowCenter - windowCenterOffsetTwo))) {
                                TweenMax.to(currentIteration, 1.75, {
                                    force3D: true,
                                    top: itemTopCenter,
                                    marginLeft: '-1em',
                                    marginRight: '0em',
                                    scale: 1,
                                    autoAlpha: itemAutoAlphaCenter,
                                    filter: "blur(" + itemBlurCenter + "px)",
                                    webkitFilter: "blur(" + itemBlurCenter + "px)",
                                    z: '0',
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(currentIteration).find('.flash-card-content-front'), 1.75, {
                                    force3D: true,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                    force3D: true,
                                    opacity: 0,
                                    ease: Power4.easeOut
                                });
                                TweenMax.set(currentIteration, {
                                    zIndex: front
                                });
                            }
                            //////////////////////////////////////////////////////////////////////////////////////
                            //drag and throw RIGHT items animation
                            //////////////////////////////////////////////////////////////////////////////////////
                            if ((itemsOffsetCenter >= (windowCenter + (windowCenterOffsetOne)))) {
                                TweenMax.set(currentIteration, {
                                    zIndex: middle
                                });
                                TweenMax.to(currentIteration, 1.75, {
                                    force3D: true,
                                    top: itemTopCenter,
                                    rotationY: 0,
                                    marginLeft: '-' + itemMarginOffsetOne,
                                    marginRight: itemMarginOffsetOne,
                                    scale: 0.9,
                                    autoAlpha: itemAutoAlphaOne,
                                    filter: "blur(" + itemBlurOne + "px)",
                                    webkitFilter: "blur(" + itemBlurOne + "px)",
                                    z: '-35',
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                    force3D: true,
                                    opacity: 0.5,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(currentIteration).find('.flash-card-front-wrapper'), 1.75, {
                                    autoAlpha: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(currentIteration).find('.flash-card-back-wrapper'), 1.75, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                            }
                            //////////////////////////////////////////////////////////////////////////////////////
                            //drag and throw LEFT items animation
                            //////////////////////////////////////////////////////////////////////////////////////
                            if ((itemsOffsetCenter <= (windowCenter - (windowCenterOffsetOne + 1)))) {
                                TweenMax.set(currentIteration, {
                                    zIndex: middle
                                });
                                TweenMax.to(currentIteration, 1.75, {
                                    force3D: true,
                                    top: itemTopCenter,
                                    rotationY: 0,
                                    marginRight: '-' + itemMarginOffsetOne,
                                    marginLeft: itemMarginOffsetOne,
                                    scale: 0.9,
                                    autoAlpha: itemAutoAlphaOne,
                                    filter: "blur(" + itemBlurOne + "px)",
                                    webkitFilter: "blur(" + itemBlurOne + "px)",
                                    z: '-50',
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                    force3D: true,
                                    opacity: 0.5,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(currentIteration).find('.flash-card-front-wrapper'), 1.75, {
                                    autoAlpha: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(currentIteration).find('.flash-card-back-wrapper'), 1.75, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                            }
                        }
                    }
                    function update() {
                        var content;
                        var dragContent;
                        setTimeout(function () {
                            $scope.$apply(function () {
                                windowWidth = window.innerWidth;
                                content = document.getElementById("carousel");
                                elementWrapper = document.getElementById("carousel-container");
                                elementIteration = document.getElementsByClassName("carousel-object");
                                sections = elementIteration.length;
                                maxScroll = content.scrollWidth - (content.offsetWidth / 2);
                                elementWidth = elementIteration[0].offsetWidth;
                                sections = elementIteration.length;
                                dragAreaLeftPadding = (windowWidth / 2) - (elementWidth / 2);
                                dragAreaWidth = (elementWidth * sections) + (dragAreaLeftPadding * 2);
                                TweenMax.set(elementWrapper, {
                                    width: dragAreaWidth,
                                    paddingLeft: dragAreaLeftPadding
                                });
                                dragContent = Draggable.get(content);
                                updateAnimation();
                            });
                        });
                        elementWrapper = document.getElementById("carousel-container");
                        content = document.getElementById("carousel");
                        var dragContent = Draggable.get(content);
                        function killTweens() {
                            TweenMax.killTweensOf([dragContent.scrollProxy]);
                        }
                        content.addEventListener("DOMMouseScroll", killTweens);
                        flashCardsDraggable = Draggable.create(content, {
                            type: "scrollLeft",
                            edgeResistance: 0.015,
                            throwProps: true,
                            snap: function (endValue) {
                                var step = elementWidth;
                                return Math.round(endValue / step) * -step;
                            },
                            onDrag: function (e) {
                                updateAnimation();
                                $scope.onDrag();
                                nativeSCrl = false;
                            },
                            onThrowUpdate: function (e) {
                                updateAnimation();
                                nativeSCrl = true;
                            },
                            onThrowComplete: function () {
                                nativeSCrl = true;
                            }
                        });
                    }
                    update();
                    function nScrollSNAP(Array, val) {
                        var SPoint, range = 400, i = 0;
                        for (i in Array) {
                            var MResult = Math.abs(val - Array[i]);
                            if (MResult < range) {
                                range = MResult;
                                SPoint = Array[i];
                            }
                        }
                        return SPoint;
                    }
                    function NScrollSnap() {
                        if (nativeSCrl) {
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::npCarousel::NScrollSnap:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::nativeSCrl:', nativeSCrl,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
                            var S = nScrollSNAP(flashCardsDraggable[0].vars.snap,
                                    flashCardsDraggable[0].scrollProxy.scrollTop());
                            TweenMax.to(flashCardsDraggable[0].scrollProxy.element,
                                    0.5, {
                                        scrollTo: {x: S}
                                    });
                        }
                    }
                    document.getElementById("carousel").onscroll = function () {
                        TweenMax.killDelayedCallsTo(NScrollSnap);
                        TweenMax.delayedCall(0.35, NScrollSnap);
                    };
                }
            };
        })
        .directive('mediaelement', npMediaElementDirective)
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npCarousel::component loaded!');
                }
        );