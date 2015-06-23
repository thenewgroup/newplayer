//'use strict';
/*jshint bitwise: false, -W003, -W117*/
angular
        .module('npFlashCards', ['npFlashCardsDirective']);
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
        .module('npFlashCards')
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
                    //on front button click do these things
                    //////////////////////////////////////////////////////////////////////////////////////
                    this.update = function (flashCardButton) {
                        Draggable.get("#flash-cards").disable();
                        var idx = flashCards.indexOf(flashCardButton),
                                clickedFlashCard = $(".flash-cards-object")[idx],
                                flipped;
                        TweenMax.killAll(false, true, false);
                        var maxHeight = $(clickedFlashCard).find('.flash-card-content-back').outerHeight(true);
                        TweenMax.to(clickedFlashCard, 1, {
                            rotationY: 180,
                            height: maxHeight,
                            ease: Power4.easeOut,
                            overwrite: 0
                        });
                        TweenMax.to($(clickedFlashCard).find('.flash-card-back-button'), 1, {
                            autoAlpha: 1,
                            ease: Power4.easeOut
                        });
                        TweenMax.to(clickedFlashCard.getElementsByClassName('flash-card-back-wrapper'), 1, {
                            autoAlpha: 1,
                            ease: Power4.easeOut
                        });
                        TweenMax.to(clickedFlashCard.getElementsByClassName('flash-card-front-wrapper'), 1, {
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
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
                    // on back button click do these things
                    // TODO: If possible roll below method and center match method into single function
                    //////////////////////////////////////////////////////////////////////////////////////
                    this.updateBack = function (flashCardButton) {
                        Draggable.get("#flash-cards").enable();
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::flashCard::updateBack:::::::::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::$( #npHTML\\:0_0_1 )::', $("#npHTML\\:0_0_1").height(),
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
                        var idx = flashCards.indexOf(flashCardButton),
                                clickedFlashCard = $(".flash-cards-object")[idx];
                        TweenMax.killAll(false, true, false);
                        var maxHeight = $(clickedFlashCard).find('.flash-card-content-back').outerHeight(true);
                        TweenMax.to(clickedFlashCard, 1, {
                            rotationY: 0,
                            height: '400px',
                            ease: Power4.easeOut,
                            overwrite: 0
                        });
                        TweenMax.to($(clickedFlashCard).find('.flash-card-back-button'), 1, {
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
                        TweenMax.to(clickedFlashCard.getElementsByClassName('flash-card-back-wrapper'), 1, {
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
                        TweenMax.to(clickedFlashCard.getElementsByClassName('flash-card-front-wrapper'), 1, {
                            autoAlpha: 1,
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
angular.module('npFlashCardsDirective', [])
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
                            TweenMax.set($('.flash-card-back-button'), {
                                autoAlpha: 0
                            });
                            TweenMax.set($('.flash-card-back-wrapper'), {
                                rotationY: -180
                            });
                            TweenMax.set([$('.flash-card-content-back'), $('.flash-card-content-front')], {
//                                backfaceVisibility: "hidden"
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
//                                var maxHeight = Math.max.apply(null, $('.flash-card-content-back').map(function () {
//                                    return $(this).outerHeight(true);
//                                }).get());
//                                    $('.flash-card-content-back').outerHeight(true);
                                var maxHeightCard = $('.flash-card-content-back').outerHeight(true);
                                var maxHeight = '400px';
                                var outsidePaddingHeight = $('.np_outside-padding').outerHeight(true);
                                var outsideHeight = $("#npHTML\\:0_0_1").outerHeight(true);
                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::npFlashCards::max Height:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::maxHeight:', maxHeight,
                                        '\n::instance:', instance,
//                                        '\n::outsideHeight:', outsideHeight,
//                                        '\n::outsidePaddingHeight:', outsidePaddingHeight,
//                                        '\n::$(.flash-card-content-back).outerHeight(true):', $('.flash-card-content-back').outerHeight(true),
//                                        '\n::$(div .flash-card-content-back).outerHeight(true):', $('div .flash-card-content-back').outerHeight(true),
                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        );
                                TweenMax.set($('.flash-cards-object'), {
                                    height: maxHeight
                                });
//                                TweenMax.set($('.np_outside-padding'), {
//                                    height: maxHeightCard + outsideHeight + 550
//                                });
                                TweenMax.set($('.btn-next'), {
                                    marginTop: maxHeightCard + 50
                                });
                                //////////////////////////////////////////////////////////////////////////////////////
                                //page build
                                //////////////////////////////////////////////////////////////////////////////////////
                                TweenMax.to($('#draggableContainer'), 1.75, {
                                    autoAlpha: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.from($('#flash-cards'), 2, {
//                                    left: '1000px',
                                    force3D: true,
                                    ease: Power4.easeOut
                                });
//                                var itemMarginOffset_1 = '0em';
//                                var itemMarginOffset_2 = '0em';
//                                var itemMarginOffset_3 = '0em';
                                var itemMarginOffset_1 = '18em';
                                var itemMarginOffset_2 = '36em';
                                var itemMarginOffset_3 = '52em';
//                                var $cardTwo = $(".flash-cards-object")[1];
//                                var $cardThree = $(".flash-cards-object")[2];
//                                var $cardFour = $(".flash-cards-object")[3];
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::CENTER:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::$(".flash-cards-object")[0].position().left:', $(".flash-cards-object")[0].offsetLeft,
//                                        '\n::windowHorizontalCenter:', $(window).width() / 2,
//                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
//                                if ($(".flash-cards-object")[0].offsetLeft < $(window).width() / 2) {
//                                    TweenMax.set($($cardTwo).find('.flash-card-overlay'), {
//                                        force3D: true,
//                                        opacity: 0.5
//                                    });
//                                    TweenMax.to($cardTwo, .75, {
//                                        force3D: true,
//                                        zIndex: level_1,
//                                        top: '10px',
//                                        rotationY: 0,
//                                        marginLeft: '-' + itemMarginOffset_1,
//                                        marginRight: itemMarginOffset_1,
//                                        scale: 0.9,
////                                    z: '-35',
//                                        ease: Power4.easeOut
//                                    });
//                                    TweenMax.set($($cardThree).find('.flash-card-overlay'), {
//                                        force3D: true,
//                                        opacity: 0.5
//                                    });
//                                    TweenMax.to($cardThree, .75, {
//                                        force3D: true,
//                                        zIndex: level_2,
//                                        top: '10px',
//                                        rotationY: 0,
//                                        marginLeft: '-' + itemMarginOffset_2,
//                                        marginRight: itemMarginOffset_2,
//                                        scale: 0.7,
////                                    z: '-35',
//                                        ease: Power4.easeOut
//                                    });
//                                    TweenMax.set($($cardFour).find('.flash-card-overlay'), {
//                                        force3D: true,
//                                        opacity: 0.5
//                                    });
//                                    TweenMax.to($cardFour, .75, {
//                                        force3D: true,
//                                        zIndex: level_3,
//                                        top: '10px',
//                                        rotationY: 0,
//                                        marginLeft: '-' + itemMarginOffset_3,
//                                        marginRight: itemMarginOffset_3,
//                                        scale: 0.5,
////                                    z: '-35',
//                                        ease: Power4.easeOut
//                                    });
//                                }
                                var $card_0 = $(".flash-cards-object")[0];
                                var $card_1 = $(".flash-cards-object")[1];
                                var $card_2 = $(".flash-cards-object")[2];
                                var $card_3 = $(".flash-cards-object")[3];
                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::CENTER:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::$(".flash-cards-object")[0].position().left:', $(".flash-cards-object")[0].offsetLeft,
                                        '\n::windowHorizontalCenter:', $(window).width() / 2,
                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        );
//                                if ($(".flash-cards-object")[0].offsetLeft > $(window).width() / 2) {
                                TweenMax.set($($card_0).find('.flash-card-overlay'), {
                                    force3D: true,
                                    opacity: 0
                                });
                                TweenMax.to($card_0, .75, {
                                    force3D: true,
                                    zIndex: level_0,
                                    opacity: 1,
                                    top: '10px',
                                    rotationY: 0,
                                    marginLeft: '-' + 0,
                                    marginRight: 0,
                                    scale: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.set($($card_1).find('.flash-card-overlay'), {
                                    force3D: true,
                                    opacity: 0.5
                                });
                                TweenMax.to($card_1, .75, {
                                    force3D: true,
                                    zIndex: level_1,
                                    top: '10px',
                                    rotationY: 0,
                                    marginLeft: '-' + itemMarginOffset_1,
                                    marginRight: itemMarginOffset_1,
                                    scale: 0.9,
                                    ease: Power4.easeOut
                                });
                                TweenMax.set($($card_2).find('.flash-card-overlay'), {
                                    force3D: true,
                                    opacity: 0.5
                                });
                                TweenMax.to($card_2, .75, {
                                    force3D: true,
                                    zIndex: level_2,
                                    top: '10px',
                                    rotationY: 0,
                                    marginLeft: '-' + itemMarginOffset_2,
                                    marginRight: itemMarginOffset_2,
                                    scale: 0.7,
                                    ease: Power4.easeOut
                                });
                                TweenMax.set($($card_3).find('.flash-card-overlay'), {
                                    force3D: true,
                                    opacity: 0.5
                                });
                                TweenMax.to($card_3, .75, {
                                    force3D: true,
                                    zIndex: level_3,
                                    top: '10px',
                                    rotationY: 0,
                                    marginLeft: '-' + itemMarginOffset_3,
                                    marginRight: itemMarginOffset_3,
                                    scale: 0.5,
                                    ease: Power4.easeOut
                                });
//                                }
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
                    var level_0 = '12004';
                    var level_1 = '12003';
                    var level_2 = '12002';
                    var level_3 = '12001';
                    var level_4 = '12000';
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
//                        var windowCenter = $(window).width() / 2;
//                        for (var i = elementIteration.length - 1; i >= 0; i--) {
                        TweenMax.set(elementIteration, {
                            transformPerspective: "700"
                        });
//                            var currentIteration = elementIteration[0],
                        var centerIteration,
                                previousIndex,
                                nextIterationRight_1,
                                nextIterationRight_2,
                                nextIterationRight_3,
                                nextIterationRight_4,
                                nextIterationLeft_1,
                                nextIterationLeft_2,
                                nextIterationLeft_3,
                                nextIterationLeft_4,
                                scaleLevel_0,
                                scaleLevel_1,
                                scaleLevel_2,
                                scaleLevel_3,
                                scaleLevel_4,
                                defaultHeight = '400px',
                                windowCenterOffsetTwo = $(".flash-cards-object").width(),
                                itemTopCenter,
                                itemAutoAlpha_0,
                                itemAutoAlpha_1,
                                itemAutoAlpha_2,
                                itemAutoAlpha_3,
                                itemAutoAlpha_4,
                                itemBlur_0,
                                itemBlur_1,
                                itemBlur_2,
                                itemBlur_3,
                                itemBlur_4,
                                itemMarginOffset_1,
                                itemMarginOffset_2,
                                itemMarginOffset_3,
                                itemMarginOffset_4,
                                overwriteSetting = 2;
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get version for animation style from class
                        //////////////////////////////////////////////////////////////////////////////////////
                        if (!!$("#ND .np-flash-card").length) {
                            windowCenterOffsetTwo = windowCenterOffsetTwo - 100;
                            itemTopCenter = '10px';
                            itemAutoAlpha_0 = 1;
                            itemAutoAlpha_1 = 0.75;
                            itemAutoAlpha_2 = 0.45;
                            itemBlur_0 = 0;
                            itemBlur_1 = 3;
                            itemBlur_2 = 6;
                            itemMarginOffset_1 = '15em';
                            itemMarginOffset_2 = '33em';
                        } else if (!!$("#NikeDigiMerch1 .np-flash-card").length) {
                            windowCenterOffsetTwo = windowCenterOffsetTwo - 160;
                            itemTopCenter = '10px';
                            itemAutoAlpha_0 = 1;
                            itemAutoAlpha_1 = 1;
                            itemAutoAlpha_2 = 1;
                            itemAutoAlpha_3 = 1;
                            itemAutoAlpha_4 = 0;
                            itemBlur_0 = 0;
                            itemBlur_1 = 0;
                            itemBlur_2 = 0;
                            itemBlur_3 = 0;
                            itemBlur_4 = 0;
//                            itemMarginOffset_1 = '2em';
//                            itemMarginOffset_2 = '5em';
//                            itemMarginOffset_3 = '7em';
//                            itemMarginOffset_4 = '8em';
                            itemMarginOffset_1 = '20em';
                            itemMarginOffset_2 = '40em';
                            itemMarginOffset_3 = '60em';
                            itemMarginOffset_4 = '30em';
//                            itemMarginOffset_1 = '26em';
//                            itemMarginOffset_2 = '52em';
//                            itemMarginOffset_3 = '78em';
//                            itemMarginOffset_4 = '58em';
                            scaleLevel_0 = 1;
                            scaleLevel_1 = 0.9;
                            scaleLevel_2 = 0.8;
                            scaleLevel_3 = 0.7;
                            scaleLevel_4 = 0.7;
                        } else {
                            windowCenterOffsetTwo = windowCenterOffsetTwo + 10;
                            itemTopCenter = '10px';
                            itemAutoAlpha_0 = 1;
                            itemAutoAlpha_1 = 1;
                            itemAutoAlpha_2 = 1;
                            itemBlur_0 = 0;
                            itemBlur_1 = 0;
                            itemBlur_2 = 0;
                            itemMarginOffset_1 = '7em';
                            itemMarginOffset_2 = '20em';
                        }
                        //////////////////////////////////////////////////////////////////////////////////////
                        //drag and throw CENTER item animation
                        //////////////////////////////////////////////////////////////////////////////////////
//                        if (previousIndex === 'undefined') {
//                            previousIndex = 0;
//                        }
                        var windowHorizontalCenter = $(window).width() / 2;
//                        var windowVerticalCenter = $(window).height() / 2;
                        var windowVerticalOffset = $(".flash-cards-object").offset();
                        var windowVerticalCenter = ($(".flash-cards-object").height() / 2) + (windowVerticalOffset.top);
                        console.log(
                                '\n::::::::::::::::::::::::::::::::::::::         CENTER         :::::::::::::::::::::::::::::::::::::::::::::::::',
                                '\n::windowVerticalCenter.top:', windowVerticalCenter.top,
                                '\n::$(".flash-cards-object").offsetTop:', $(".flash-cards-object").offsetTop,
                                '\n::windowHorizontalCenter:', $(window).width() / 2,
                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                );
//                            elementIteration = document.getElementsByClassName("flash-cards-object")
                        var elementAtCenter = document.elementFromPoint(windowHorizontalCenter, windowVerticalCenter).parentElement.parentElement;
                        var className = 'flash-cards-object';
                        var elementAtCenterClassName = document.elementFromPoint(windowHorizontalCenter, windowVerticalCenter).parentElement.parentElement.className;
//                        if ((' ' + elementAtCenter.className + ' ').indexOf(' ' + className + ' ') > -1 && $(elementAtCenter).css('z-index') === 12003) {
                        if ((' ' + elementAtCenter.className + ' ').indexOf(' ' + className + ' ') > -1) {

                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::         CENTER         :::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n::$(elementAtCenter.className):', $(elementAtCenter.className),
                                    '\n::level_1:', level_1,
                                    '\n::windowVerticalCenter:', windowVerticalCenter,
                                    '\n::$(elementAtCenter.className).css(z-index):', $(elementAtCenter).css('z-index'),
                                    '\n::$(elementAtCenter.className).css(z-index):', typeof ($(elementAtCenter).css('z-index')),
                                    '\n::elementAtCenter.offsetLeft:', elementIteration[0].offsetLeft,
                                    '\n::getOffsetRect(elementIteration[0]):', getOffsetRect(elementIteration[0]).left,
                                    '\n::windowHorizontalCenter:', $(window).width() / 2,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            if ($(elementAtCenter).css('z-index') === '0' || $(elementAtCenter).css('z-index') === level_1 || $(elementAtCenter).css('z-index') === level_3) {
                                var index = $('.flash-cards-object').index(elementAtCenter);
                                previousIndex = index;
                                centerIteration = elementIteration[index];
                                nextIterationRight_1 = elementIteration[index + 1];
                                nextIterationRight_2 = elementIteration[index + 2];
                                nextIterationRight_3 = elementIteration[index + 3];
                                nextIterationRight_4 = elementIteration[index + 4];
                                nextIterationLeft_1 = elementIteration[index - 1];
                                nextIterationLeft_2 = elementIteration[index - 2];
                                nextIterationLeft_3 = elementIteration[index - 3];
                                nextIterationLeft_4 = elementIteration[index - 4];
                            }
                        }
//                        if ($(centerIteration).) {
//                            
//                        }

                        if (!!$(centerIteration).length) {
//                            TweenMax.set($('.flash-cards-object'), {
//                                force3D: true,
//                                top: itemTopCenter,
//                                height: defaultHeight,
//                                marginLeft: '0em',
//                                marginRight: '0em',
//                                scale: scaleLevel_0,
//                                autoAlpha: 0,
//                                filter: "blur(" + itemBlur_0 + "px)",
//                                webkitFilter: "blur(" + itemBlur_0 + "px)"
//                            });
                            TweenMax.to(centerIteration, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                height: defaultHeight,
                                marginLeft: '0em',
                                marginRight: '0em',
                                scale: scaleLevel_0,
                                autoAlpha: itemAutoAlpha_0,
                                filter: "blur(" + itemBlur_0 + "px)",
                                webkitFilter: "blur(" + itemBlur_0 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(centerIteration).find('.flash-card-content-front'), 1.75, {
                                force3D: true,
                                marginLeft: 0,
                                marginRight: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(centerIteration).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(centerIteration).find('.flash-card-button'), 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.set(centerIteration, {
                                zIndex: level_0
                            });
                        }
                        //////////////////////////////////////////////////////////////////////////////////////
                        //drag and throw RIGHT items animation
                        //////////////////////////////////////////////////////////////////////////////////////
//                        for()
                        if (!!$(nextIterationRight_1).length) {
                            TweenMax.set(nextIterationRight_1, {
                                zIndex: level_1
                            });
                            TweenMax.to(nextIterationRight_1, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                rotationY: 0,
                                height: defaultHeight,
                                marginLeft: '-' + itemMarginOffset_1,
                                marginRight: itemMarginOffset_1,
                                scale: scaleLevel_1,
                                autoAlpha: itemAutoAlpha_1,
                                filter: "blur(" + itemBlur_1 + "px)",
                                webkitFilter: "blur(" + itemBlur_1 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_1).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0.5,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_1).find('.flash-card-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_1).find('.flash-card-front-wrapper'), 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_1).find('.flash-card-back-wrapper'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                        }
                        if (!!$(nextIterationRight_2).length) {
                            TweenMax.set(nextIterationRight_2, {
                                zIndex: level_2
                            });
                            TweenMax.to(nextIterationRight_2, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                marginLeft: '-' + itemMarginOffset_2,
                                marginRight: itemMarginOffset_2,
                                scale: scaleLevel_2,
                                autoAlpha: itemAutoAlpha_2,
                                filter: "blur(" + itemBlur_2 + "px)",
                                webkitFilter: "blur(" + itemBlur_2 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_2).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0.75,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_2).find('.flash-card-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                        }
                        if (!!$(nextIterationRight_3).length) {
                            TweenMax.set(nextIterationRight_3, {
                                zIndex: level_3
                            });
                            TweenMax.to(nextIterationRight_3, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                marginLeft: '-' + itemMarginOffset_3,
                                marginRight: itemMarginOffset_3,
                                scale: scaleLevel_3,
                                autoAlpha: itemAutoAlpha_3,
                                filter: "blur(" + itemBlur_3 + "px)",
                                webkitFilter: "blur(" + itemBlur_3 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_3).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0.75,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_3).find('.flash-card-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                        }
                        if (!!$(nextIterationRight_4).length) {
                            TweenMax.set(nextIterationRight_4, {
                                zIndex: level_4
                            });
                            TweenMax.to(nextIterationRight_4, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                marginLeft: '-' + itemMarginOffset_4,
                                marginRight: itemMarginOffset_4,
                                scale: scaleLevel_4,
                                autoAlpha: itemAutoAlpha_4,
                                filter: "blur(" + itemBlur_4 + "px)",
                                webkitFilter: "blur(" + itemBlur_4 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_4).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0.75,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationRight_4).find('.flash-card-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                        }
                        //////////////////////////////////////////////////////////////////////////////////////
                        //drag and throw LEFT items animation
                        //////////////////////////////////////////////////////////////////////////////////////
                        if (!!$(nextIterationLeft_1).length) {
                            TweenMax.set(nextIterationLeft_1, {
                                zIndex: level_1
                            });
                            TweenMax.to(nextIterationLeft_1, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                height: defaultHeight,
                                rotationY: 0,
                                marginRight: '-' + itemMarginOffset_1,
                                marginLeft: itemMarginOffset_1,
                                scale: scaleLevel_1,
                                autoAlpha: itemAutoAlpha_1,
                                filter: "blur(" + itemBlur_1 + "px)",
                                webkitFilter: "blur(" + itemBlur_1 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_1).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0.5,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_1).find('.flash-card-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_1).find('.flash-card-front-wrapper'), 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_1).find('.flash-card-back-wrapper'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                        }
                        if (!!$(nextIterationLeft_2).length) {
                            TweenMax.set(nextIterationLeft_2, {
                                zIndex: level_2
                            });
                            TweenMax.to(nextIterationLeft_2, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                marginRight: '-' + itemMarginOffset_2,
                                marginLeft: itemMarginOffset_2,
                                scale: scaleLevel_2,
                                autoAlpha: itemAutoAlpha_2,
                                filter: "blur(" + itemBlur_2 + "px)",
                                webkitFilter: "blur(" + itemBlur_2 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_2).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0.75,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_2).find('.flash-card-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                        }
                        if (!!$(nextIterationLeft_3).length) {
                            TweenMax.set(nextIterationLeft_3, {
                                zIndex: level_3
                            });
                            TweenMax.to(nextIterationLeft_3, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                marginRight: '-' + itemMarginOffset_3,
                                marginLeft: itemMarginOffset_3,
                                scale: scaleLevel_3,
                                autoAlpha: itemAutoAlpha_3,
                                filter: "blur(" + itemBlur_3 + "px)",
                                webkitFilter: "blur(" + itemBlur_3 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_3).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0.75,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_3).find('.flash-card-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                        }
                        if (!!$(nextIterationLeft_4).length) {
                            TweenMax.set(nextIterationLeft_4, {
                                zIndex: level_4
                            });
                            TweenMax.to(nextIterationLeft_4, 1.75, {
                                force3D: true,
                                top: itemTopCenter,
                                marginRight: '-' + itemMarginOffset_4,
                                marginLeft: itemMarginOffset_4,
                                scale: scaleLevel_4,
                                autoAlpha: itemAutoAlpha_4,
                                filter: "blur(" + itemBlur_4 + "px)",
                                webkitFilter: "blur(" + itemBlur_4 + "px)",
                                overwrite: overwriteSetting,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_4).find('.flash-card-overlay'), 1.75, {
                                force3D: true,
                                opacity: 0.75,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('.flash-card-back-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($(nextIterationLeft_4).find('.flash-card-button'), 1.75, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
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
                                    paddingLeft: dragAreaLeftPadding - 14
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
                            edgeResistance: 0.005,
                            dragResistance: 0.75,
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
                    $(window).resize(function () {
                        update();
                    });
                    var delay = 1000;
                    var timeout = null;
                    $('#flash-cards').bind('scroll', function () {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            update();
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::npFlashCards::NScrollSnap:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::nativeSCrl:', nativeSCrl,
                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                        }, delay);
                    });
                }
            };
        })
        .directive('mediaelement', npMediaElementDirective)
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npDragAndMatch::component loaded!');
                }
        );