/* jshint -W003, -W117, -W004 */
(function () {
    'use strict';
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpFlashCards mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
    angular
            .module('newplayer.component')
            .controller('npFlashCardsController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data,
                                flashCards = $scope.component.flashCards,
                                buttonData = $scope.feedback || {};
                        this.flashCardComponent = $scope.component.flashCards[0];
                        this.flashCardComponents = $scope.component.flashCards;
                        this.flashCardVideoType = $scope.component.baseURL;
                        this.id = cmpData.id;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.feedback = this.feedback = cmpData.feedback;
                        $scope.image = this.image = cmpData.image;
                        $log.debug('npFlashCards::data', cmpData, buttonData);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //on button click do these things
                        //////////////////////////////////////////////////////////////////////////////////////
                        this.update = function (flashCardButton) {
                            var idx = flashCards.indexOf(flashCardButton),
                                    clickedFlashCard = $(".flash-cards-object")[idx],
                                    flipped;
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
                            TweenMax.to($('.flash-card-button'), 1, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
//                            if (flipped === !flipped){
//                                TweenMax.to($('.flash-card-button'), 1, {
//                                    autoAlpha: 0,
//                                    ease: Power4.easeOut
//                                });
//                                TweenMax.set($('.flash-card-button'), {
//                                    left: '15px'
//                                });
//                                TweenMax.to($('.flash-card-button'), 1, {
//                                    autoAlpha: 1,
//                                    ease: Power4.easeOut
//                                });
//                            }
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change stop and reset all video files
                            //////////////////////////////////////////////////////////////////////////////////////
//                            $('video').each(function () {
//                                this.pause();
//                                this.currentTime = 0;
//                                this.load();
//                            });
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
            )
            ////////////////////////////////////////////////////////////////////////////////////////
            //GSAP Swipeable/Snapable Angular directive!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            ////////////////////////////////////////////////////////////////////////////////////////
            .directive("npSwipeAngularDraggable", function () {
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
                                TweenMax.set($('.flash-card-button'), {
                                    autoAlpha: 0
                                });
                                TweenMax.set($('.flash-card-back-wrapper'), {
                                    rotationY: -180
                                });
                                TweenMax.set([$('.flash-card-content-back'), $('.flash-card-content-front')], {
                                    backfaceVisibility: "hidden"
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //get actuall height
                                //////////////////////////////////////////////////////////////////////////////////////
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::getOffsetRect::$( #npHTML\\:0_0_1 ):::::::::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::$( #npHTML\\:0_0_1 )::', $("#npHTML\\:0_0_1").height(),
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
                                imagesLoaded(document.querySelector('.np-flash-card'), function (instance) {
                                    var maxHeight = Math.max.apply(null, $('.flash-card-content-back').map(function () {
                                        return $(this).outerHeight(true);
                                    }).get());
//                                    $('.flash-card-content-back').outerHeight(true);
                                    var outsidePaddingHeight = $('.np_outside-padding').outerHeight(true);
                                    var outsideHeight = $("#npHTML\\:0_0_1").outerHeight(true);
                                    console.log(
                                            '\n::::::::::::::::::::::::::::::::::::::npFlashCards::max Height:::::::::::::::::::::::::::::::::::::::::::::::::',
                                            '\n::maxHeight:', maxHeight,
                                            '\n::outsideHeight:', outsideHeight,
                                            '\n::outsidePaddingHeight:', outsidePaddingHeight,
                                            '\n::$(.flash-card-content-back).outerHeight(true):', $('.flash-card-content-back').outerHeight(true),
                                            '\n::$(div .flash-card-content-back).outerHeight(true):', $('div .flash-card-content-back').outerHeight(true),
                                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                            );
                                    TweenMax.set($('.flash-cards-object'), {
                                        height: maxHeight
                                    });
                                    TweenMax.set($('.np_outside-padding'), {
                                        height: maxHeight + outsideHeight + 350
                                    });
                                    TweenMax.set($('.btn-next'), {
                                        marginTop: maxHeight + 50
                                    });
                                    //////////////////////////////////////////////////////////////////////////////////////
                                    //page build
                                    //////////////////////////////////////////////////////////////////////////////////////
                                    TweenMax.to($('#draggableContainer'), 1.75, {
                                        autoAlpha: 1,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.from($('#flash-cards'), 2, {
                                        left: '1000px',
                                        force3D: true,
                                        ease: Power4.easeOut
                                    });
                                    var $cardTwo = $(".flash-cards-object")[1];
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
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //offset top on scroll
                                //////////////////////////////////////////////////////////////////////////////////////
                                var flashCardsOffset = $('.npFlashCards').offset();
                                $(window).scroll(function () {
                                    var windowPosition = $(window).scrollTop();
                                    var doc = document.documentElement;
                                    var topOffset = Math.round((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
                                    TweenMax.to($('.npFlashCards'), 1.25, {
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
                                    $("#flash-cards").css({
                                        "width": winWidth
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
                                        windowCenterOffsetOne = ($(".flash-cards-object").width() / 3),
                                        windowCenterOffsetTwo = $(".flash-cards-object").width() -100,
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
                                //get version for animation style from class
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ($("#" + 'ND').length === 0) {
                                    itemTopCenter = '10px';
                                    itemAutoAlphaCenter = 1;
                                    itemAutoAlphaOne = 1;
                                    itemAutoAlphaTwo = 1;
                                    itemBlurCenter = 0;
                                    itemBlurOne = 0;
                                    itemBlurTwo = 0;
                                    itemMarginOffsetOne = '7em';
                                    itemMarginOffsetTwo = '20em';
                                } else {
//                                    console.log(
//                                            '\n::::::::::::::::::::::::::::::::::::::getOffsetRect::#ND .np-flash-card exists:::::::::::::::::::::::::::::::::::::::::::::::::::::::',
//                                            '\n::$("#ND .np-flash-card")::', $("#ND .np-flash-card"),
//                                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                            );
                                    itemTopCenter = '10px';
                                    itemAutoAlphaCenter = 1;
                                    itemAutoAlphaOne = 0.75;
                                    itemAutoAlphaTwo = 0.45;
                                    itemBlurCenter = 0;
                                    itemBlurOne = 3;
                                    itemBlurTwo = 6;
                                    itemMarginOffsetOne = '15em';
                                    itemMarginOffsetTwo = '33em';
                                }

                                //////////////////////////////////////////////////////////////////////////////////////
                                //drag and throw CENTER item animation
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ((itemsOffsetCenter <= (windowCenter + windowCenterOffsetOne)) && (itemsOffsetCenter >= (windowCenter - windowCenterOffsetTwo))) {
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        top: itemTopCenter,
                                        marginLeft: '0em',
                                        marginRight: '0em',
                                        scale: 1,
                                        autoAlpha: itemAutoAlphaCenter, 
                                        filter:"blur(" + itemBlurCenter + "px)",
                                        webkitFilter:"blur(" + itemBlurCenter + "px)",
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
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 1,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.set(currentIteration, {
                                        zIndex: front
                                    });
                                }
                                //////////////////////////////////////////////////////////////////////////////////////
                                //drag and throw RIGHT items animation
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ((itemsOffsetCenter >= (windowCenter + (windowCenterOffsetOne + 1))) && (itemsOffsetCenter <= (windowCenter + windowCenterOffsetTwo))) {
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
                                        filter:"blur(" + itemBlurOne + "px)",
                                        webkitFilter:"blur(" + itemBlurOne + "px)",
                                        z: '-35',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0.5,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 0,
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
                                } else if (itemsOffsetCenter >= (windowCenter + (windowCenterOffsetTwo + 1))) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: back
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        top: itemTopCenter,
                                        marginLeft: '-' + itemMarginOffsetTwo,
                                        marginRight: itemMarginOffsetTwo,
                                        scale: 0.75,
                                        autoAlpha: itemAutoAlphaTwo,
                                        filter:"blur(" + itemBlurTwo + "px)",
                                        webkitFilter:"blur(" + itemBlurTwo + "px)",
                                        z: '-70',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 0,
                                        ease: Power4.easeOut
                                    });
                                }
                                //////////////////////////////////////////////////////////////////////////////////////
                                //drag and throw LEFT items animation
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ((itemsOffsetCenter <= (windowCenter - (windowCenterOffsetOne + 1))) && (itemsOffsetCenter >= (windowCenter - windowCenterOffsetTwo))) {
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
                                        filter:"blur(" + itemBlurOne + "px)",
                                        webkitFilter:"blur(" + itemBlurOne + "px)",
                                        z: '-50',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0.5,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
                                        autoAlpha: 0,
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
                                } else if (itemsOffsetCenter <= (windowCenter - (windowCenterOffsetTwo + 1))) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: middle
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        top: itemTopCenter,
                                        z: '-70',
                                        marginRight: '-' + itemMarginOffsetTwo,
                                        marginLeft: itemMarginOffsetTwo,
                                        scale: 0.75,
                                        autoAlpha: itemAutoAlphaTwo,
                                        filter:"blur(" + itemBlurTwo + "px)",
                                        webkitFilter:"blur(" + itemBlurTwo + "px)",
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        force3D: true,
                                        opacity: 0.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-button'), 1.75, {
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
                                    content = document.getElementById("flash-cards");
                                    elementWrapper = document.getElementById("flash-cards-swipe-container");
                                    elementIteration = document.getElementsByClassName("flash-cards-object");
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
                            elementWrapper = document.getElementById("flash-cards-swipe-container");
                            content = document.getElementById("flash-cards");
                            var dragContent = Draggable.get(content);
                            function killTweens() {
                                TweenMax.killTweensOf([dragContent.scrollProxy]);
                            }
                            content.addEventListener("DOMMouseScroll", killTweens);
                            flashCardsDraggable = Draggable.create(content, {
                                type: "scrollLeft",
                                edgeResistance: 0.5,
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
//                                        '\n::::::::::::::::::::::::::::::::::::::npFlashCards::NScrollSnap:::::::::::::::::::::::::::::::::::::::::::::::::',
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
                        document.getElementById("flash-cards").onscroll = function () {
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
                        $log.debug('npFlashCards::component loaded!');
                    }
            );
})();
