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
                                flashCardsIndex = $scope.component.idx,
                                flashCardsButtonImage = $scope.component.flashCards.buttonImage;
                        var buttonData = $scope.feedback || {};
                        this.flashCards = $scope.component.flashCards;
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
                            this.windowsCenter = $(window).width() / 2;
                            TweenMax.to($(".flash-card-content-back"), 0, {
                                autoAlpha: 0
                            });
//                            console.log(
//                                    '\n::::::::::::::::::::::::::::::::::::::npFlashCards::data tests:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                    '\n:::', this.windowsCenter,
//                                    '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                    );
                            //////////////////////////////////////////////////////////////////////////////////////
                            //finish ready check items
                            //////////////////////////////////////////////////////////////////////////////////////
                        }, 100);
                        this.update = function (button) {
                            var idx = this.flashCards.indexOf(button);
                             TweenMax.set($('.flash-card-front-wrapper'),{
                                autoAlpha: 0
                            });
                            TweenMax.set($('.flash-card-back-wrapper'),{
                                autoAlpha: 1
                            });
                            console.log(
                                    '\n::::::::::::::::::::::::::::::::::::::npFlashCards::data tests:::::::::::::::::::::::::::::::::::::::::::::::::',
                                    '\n:::', idx,
                                    '\n:::', button,
                                    '\n:::', this.windowsCenter,
                                    '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                    );
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on navigation change stop and reset all video files
                            //////////////////////////////////////////////////////////////////////////////////////
                            $('video').each(function () {
                                this.pause();
                                this.currentTime = 0;
                                this.load();
                            });
                            //////////////////////
//                            TweenMax.to($(".reveal-object"), 0, {
//                                autoAlpha: 0,
//                                ease: Power4.easeOut
//                            });
//                            TweenMax.to($(".reveal-object")[idx], 0.75, {
//                                autoAlpha: 1,
//                                ease: Power4.easeOut
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
//                        elementWrapper: 0
                    },
                    link: function (scope, element, attrs) {
//                        var hitAreaWrapper = document.getElementById('draggableContainer');
//                        var currentTarget;
//                        var currentElement;
//                        var windowsCenter = $(window).width() / 2;
//                        var elementPosition;
//                        scopeelementWrapper = document.getElementsByClassName("flash-cards-wrapper");
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set states
                        //////////////////////////////////////////////////////////////////////////////////////
                        TweenMax.to($('#draggableContainer'), 0, {
                            autoAlpha: 0
                        });
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
                            TweenMax.to($('#draggableContainer'), 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            TweenMax.set($('.flash-card-front-wrapper'),{
                                autoAlpha: 1
                            });
                            TweenMax.set($('.flash-card-back-wrapper'),{
                                autoAlpha: 0
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //get actuall height
                            //////////////////////////////////////////////////////////////////////////////////////
                            $.each($('.boxElements'), function () {
                                var currentHeight = $(this).find('.button-content').outerHeight();
                                $(this).height(currentHeight);
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //finish ready check items
                            //////////////////////////////////////////////////////////////////////////////////////
                            var winWidth = 0;
                            $(document).ready(function () {
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
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //finish ready check items
                            //////////////////////////////////////////////////////////////////////////////////////
                        }, 100);
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
                            return {top: Math.round(top), left: Math.round(left)};
                        }
                        //////////////////////////////////////////////////////////////////////////////////////
                        //drag and throw vars
                        //////////////////////////////////////////////////////////////////////////////////////
                        var front = '2003';
                        var middle = '2002';
                        var back = '2001';
                        var flashCardsDraggable;
                        var windowWidth;
                        var maxScroll;
                        var elementWrapper;
                        var elementIteration;
                        var sections;
                        var elementWidth;
                        var dragAreaWidth;
                        var dragAreaLeftPadding;
                        //////////////////////////////////////////////////////////////////////////////////////
                        //drag and throw conditionals & animation
                        //////////////////////////////////////////////////////////////////////////////////////
                        function updateAnimation() {
                            var windowCenter = $(window).width() / 2;
                            for (var i = elementIteration.length - 1; i >= 0; i--) {
                                TweenMax.set(elementIteration, {
                                    transformPerspective: "140"
                                });
                                var currentIteration = elementIteration[i];
                                var currentIterationWidth = currentIteration.offsetWidth;
                                var currentIterationCenterWidth = (currentIterationWidth / 2);
                                var itemsOffset = getOffsetRect(currentIteration);
                                var itemsOffsetLeft = itemsOffset.left;
                                var itemsOffsetCenter = (itemsOffsetLeft + currentIterationCenterWidth);
//                                console.log(
//                                        '\n::::::::::::::::::::::::::::::::::::::npFlashCards::data tests:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                        '\n::i:', i,
//                                        '\n::currentIteration:', currentIteration,
//                                        '\n::windowCenter:', windowCenter,
//                                        '\n::(windowCenter - 150):', (windowCenter - 150),
//                                        '\n::itemsOffsetCenter:', itemsOffsetCenter,
//                                        '\n::(windowCenter + 150):', (windowCenter + 150),
////                                                '\n::elementWrapper:', elementWrapper,
//                                        '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                        );
                                //////////////////////////////////////////////////////////////////////////////////////
                                //drag and throw CENTER item animation
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ((itemsOffsetCenter <= (windowCenter + 200)) && (itemsOffsetCenter >= (windowCenter - 200))) {
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
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
                                if ((itemsOffsetCenter >= (windowCenter + 201)) && (itemsOffsetCenter <= (windowCenter + 600))) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: middle
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        z: '-50',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        opacity: 0.5,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-content-front'), 1.75, {
                                        force3D: true,
//                                        marginLeft: '-7em',
                                        ease: Power4.easeOut
                                    });
                                } else if (itemsOffsetCenter >= (windowCenter + 601)) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: back
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        z: '-70',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        opacity: 0.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-content-front'), 1.75, {
                                        force3D: true,
//                                        marginLeft: '-30em',
                                        ease: Power4.easeOut
                                    });
                                }
                                //////////////////////////////////////////////////////////////////////////////////////
                                //drag and throw LEFT items animation
                                //////////////////////////////////////////////////////////////////////////////////////
                                if ((itemsOffsetCenter <= (windowCenter - 201)) && (itemsOffsetCenter >= (windowCenter - 600))) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: middle
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        z: '-50',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        opacity: 0.5,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-content-front'), 1.75, {
                                        force3D: true,
//                                        marginLeft: '7em',
                                        ease: Power4.easeOut
                                    });
                                } else if (itemsOffsetCenter <= (windowCenter - 601)) {
                                    TweenMax.set(currentIteration, {
                                        zIndex: middle
                                    });
                                    TweenMax.to(currentIteration, 1.75, {
                                        force3D: true,
                                        z: '-70',
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-overlay'), 1.75, {
                                        opacity: 0.75,
                                        ease: Power4.easeOut
                                    });
                                    TweenMax.to($(currentIteration).find('.flash-card-content-front'), 1.75, {
                                        force3D: true,
//                                        marginLeft: 30em',
                                        ease: Power4.easeOut
                                    });
                                }
                            }
                        }
//                                    Draggable.addEventListener("dragend", yourFunc);
//                                    document.getElementById("flash-cards").onscroll = function () {
//                                        updateAnimation();
//                                        Draggable.snap();
//                                    };

                        document.getElementById("flash-cards").onscroll = function () {
                            updateAnimation();
//                            flashCardsDraggable.snap();
                        };

                        function update() {
                            var content;
                            var dragContent;
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

                                console.log(
                                        '\n::::::::::::::::::::::::::::::::::::::npFlashCards::inside iteration::tests:::::::::::::::::::::::::::::::::::::::::::::::::',
                                        '\n::sections:', sections,
                                        '\n:::', content.offsetWidth,
                                        '\n:::', content.scrollWidth,
                                        '\n:::', maxScroll,
                                        '\n::elementWidth:', elementWidth,
                                        '\n::dragAreaLeftPadding:', dragAreaLeftPadding,
                                        '\n::dragAreaWidth:', dragAreaWidth,
                                        '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                        );
                                updateAnimation();
                                //////////////////////////////////////////////////////////////////////////////////////
                                //finish ready check items
                                //////////////////////////////////////////////////////////////////////////////////////
                            }, 100);
                            elementWrapper = document.getElementById("flash-cards-swipe-container");
                            content = document.getElementById("flash-cards");
                            var dragContent = Draggable.get(content);
                            function killTweens() {
                                TweenMax.killTweensOf([dragContent.scrollProxy]);
                            }
                            content.addEventListener("mousewheel", killTweens);
                            content.addEventListener("DOMMouseScroll", killTweens);

                            flashCardsDraggable = Draggable.create(content, {
                                type: "scrollLeft",
                                edgeResistance: 0.5,
                                throwProps: true,
//                                onDragStart: killTweens,
                                snap: function (endValue) {
//                                    var step = maxScroll / sections;
                                    var step = elementWidth;
                                    console.log(
                                            '\n::::::::::::::::::::::::::::::::::::::npFlashCards::Snap Numbers:::::::::::::::::::::::::::::::::::::::::::::::::',
                                            '\n::step:', step,
                                            '\n::sections:', sections,
                                            '\n::maxScroll:', maxScroll,
                                            '\n::dragAreaWidth:', dragAreaWidth,
                                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                            );
                                    return Math.round(endValue / step) * -step;
                                },
                                onDrag: function (e) {
                                    updateAnimation();
                                    scope.onDrag();
                                    document.getElementById("flash-cards-swipe-container").onscroll = function () {
                                        updateAnimation();
//                                        console.log(
//                                                '\n::::::::::::::::::::::::::::::::::::::npFlashCards::onDrag:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                                '\n::updateAnimation:', e,
//                                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                                );
                                    };
                                },
                                onThrowUpdate: function (e) {
                                    updateAnimation();
                                    console.log(
                                            '\n::::::::::::::::::::::::::::::::::::::npFlashCards::onThrowUpdate:::::::::::::::::::::::::::::::::::::::::::::::::',
                                            '\n::updateAnimation:', e,
                                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                            );
                                }

                            });
                        }
                        update();
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