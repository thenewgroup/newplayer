//
///*jshint bitwise: false*/
//
//angular.module('DraggableAngular', []).
//        directive("dragButton", function () {
//            return {
//                restrict: "A",
//                scope: {
//                    onDragEnd: "&",
//                    onDrag: "&"
//                },
//                link: function (scope, element, attrs) {
//                    var droppables = document.getElementsByClassName('hit-area');
//                    var hitAreaWrapper = document.getElementById('draggableContainer');
//                    var draggables = document.getElementsByClassName('draggableButton');
//                    var hitAreaPosition = getOffsetRect(hitAreaWrapper);
//                    var currentTarget;
//                    var currentElement;
//                    var draggablePositionTop = [];
//                    //////////////////////////////////////////////////////////////////////////////////////
//                    //set states
//                    //////////////////////////////////////////////////////////////////////////////////////
//                    TweenMax.to($('#draggableContainer'), 0, {
//                        autoAlpha: 0
//                    });
//                    //////////////////////////////////////////////////////////////////////////////////////
//                    //get ready
//                    //////////////////////////////////////////////////////////////////////////////////////
//                    var tid = setInterval(function () {
//                        if (document.readyState !== 'complete') {
//                            return;
//                        }
//                        clearInterval(tid);
//                        //////////////////////////////////////////////////////////////////////////////////////
//                        //on ready
//                        //////////////////////////////////////////////////////////////////////////////////////
//                        console.log('ready');
//                        TweenMax.to($('.hit-area'), 0, {
//                            strokeOpacity: 0
//                        });
//                        TweenMax.to($(droppables).find('.button-completion-content'), 0.5, {
//                            autoAlpha: 0,
//                            ease: Power4.easeOut
//                        });
//                        TweenMax.to($('#draggableContainer'), 1.75, {
//                            autoAlpha: 1,
//                            ease: Power4.easeOut
//                        });
//                        //////////////////////////////////////////////////////////////////////////////////////
//                        //////////////////////////////////////////////////////////////////////////////////////
//                        function shuffle() {
//                            $("#draggableButtons").each(function () {
//                                var divs = $(this).find('.draggableButton');
//                                for (var i = 0; i < divs.length; i++) {
//                                    $(divs[i]).remove();
//                                }
//                                //the fisher yates algorithm, from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
//                                var i = divs.length;
//                                if (i === 0) {
//                                    return false;
//                                }
//                                while (--i) {
//                                    var j = Math.floor(Math.random() * (i + 1));
//                                    var tempi = divs[i];
//                                    var tempj = divs[j];
//                                    divs[i] = tempj;
//                                    divs[j] = tempi;
//                                }
//                                for (var i = 0; i < divs.length; i++) {
//                                    $(divs[i]).appendTo(this);
//                                }
//                            });
//                        }
//                        shuffle();
//                        //////////////////////////////////////////////////////////////////////////////////////
//                        //////////////////////////////////////////////////////////////////////////////////////
//                        $.each($('.boxElements'), function () {
//                            var currentHeight = $(this).find('.button-content').outerHeight();
//                            console.log("height ::: ", currentHeight);
//                            $(this).height(currentHeight);
//                        });
//                        //////////////////////////////////////////////////////////////////////////////////////
//                        //////////////////////////////////////////////////////////////////////////////////////
//                    }, 100);
//                    //////////////////////////////////////////////////////////////////////////////////////
//                    //////////////////////////////////////////////////////////////////////////////////////
//                    function getOffsetRect(elem) {
//                        var box = elem.getBoundingClientRect();
//                        var body = document.body;
//                        var docElem = document.documentElement;
//                        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
//                        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
//                        var clientTop = docElem.clientTop || body.clientTop || 0;
//                        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
//                        var top = box.top + scrollTop - clientTop;
//                        var left = box.left + scrollLeft - clientLeft;
//                        return {top: Math.round(top), left: Math.round(left)};
//                    }
//                    console.log("hitAreaPosition Left: " + hitAreaPosition.left, 'hitAreaPosition Top: ' + hitAreaPosition.top);
//                    //////////////////////////////////////////////////////////////////////////////////////
//                    //////////////////////////////////////////////////////////////////////////////////////
//                    var dragging;
//                    function setElementPositions(dragging) {
//                        if (dragging = !dragging) {
//                            $('.draggableButton').each(function () {
//                                draggablePositionTop.push($(this).offset());
//                                console.log(':::::::::::::::::::::::::::::::::::::::', $(this).offset(), ':::', $(this).position(), ':::', Math.round(draggablePositionTop[0].top));
//                            });
//                        }
//                    }
//                    Draggable.create(element, {
//                        type: "x,y",
//                        edgeResistance: 0.65,
//                        bounds: "#draggableContainer",
//                        throwProps: true,
//                        overlapThreshold: '50%',
//                        onDrag: function (e) {
//                            scope.$apply(function () {
//                                scope.onDrag();
//                                setElementPositions(true);
//                            });
//                        },
//                        onDragEnd: function (e) {
//                            scope.$apply(function () {
//                                scope.onDragEnd();
//                                setElementPositions(false);
//                                var targetNumber = droppables.length;
//                                var droppablesPosition;
//                                for (var i = 0; i < targetNumber; i++) {
//                                    currentTarget = 'id' + i;
//                                    currentElement = element.attr("id");
//                                    if (Draggable.hitTest(droppables[i], e) && (currentElement === currentTarget)) {
//                                        droppablesPosition = getOffsetRect(droppables[i]);
//                                        var positionX = (droppablesPosition.left - hitAreaPosition.left);
//                                        var positionY = (droppablesPosition.top - hitAreaPosition.top) - (Math.round(draggablePositionTop[i].top) - hitAreaPosition.top);
////                                        console.log('inside this droppablesPosition.top: ', droppablesPosition.top, 'positionY: ', positionY);
//                                        TweenMax.to(element, 0.15, {
//                                            autoAlpha: 0,
//                                            x: positionX,
////                                            y: positionY,
//                                            ease: Power4.easeOut
//                                        });
//                                        TweenMax.to(droppables[i], 0.5, {
//                                            autoAlpha: 0.95,
////                                            fill: '#313131',
//                                            strokeOpacity: 1,
//                                            ease: Power4.easeOut
//                                        });
//                                        TweenMax.to($(droppables[i]).find('.button-content'), 0.5, {
//                                            autoAlpha: 0,
//                                            ease: Power4.easeOut
//                                        });
//                                        TweenMax.to($(droppables[i]).find('.button-completion-content'), 0.5, {
//                                            autoAlpha: 1,
//                                            ease: Power4.easeOut
//                                        });
//                                        return;
//                                    } else {
//                                        TweenMax.to(element, 1, {
//                                            x: "0px",
//                                            y: '0px',
//                                            ease: Power4.easeOut
//                                        });
//                                    }
//                                }
//                            });
//                        }
//                    });
//                }
//            };
//        });