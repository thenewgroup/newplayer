angular.module('DarggableAngular', []).
        directive("dragButton", function () {
            return {
                restrict: "A",
                scope: {
                    onDragEnd: "&",
                    onDrag: "&"
                },
                link: function (scope, element) {
                    var gridWidth = 200;
                    var gridHeight = 100;
//                    var droppables = $(".box");
                    var droppables = document.getElementsByClassName('hit-area');

                    Draggable.create(element, {
                        type: "x,y",
                        edgeResistance: 0.65,
                        bounds: "#draggableContainer",
                        throwProps: true,
//                        snap: {
//                            x: function (endValue) {
//                                return Math.round(endValue / gridWidth) * gridWidth;
//                            },
//                            y: function (endValue) {
//                                return Math.round(endValue / gridHeight) * gridHeight;
//                            }
//                        },
                        onDrag: function (e) {
                            scope.$apply(function () {
                                scope.onDrag();
                            });
                        },
                        onDragEnd: function (e) {
                            scope.$apply(function () {
                                scope.onDragEnd();
//                                console.log('outside this: ', element);
//                                console.log('outside this: ', element.attr("id"));
//                                console.log('outside this: ', element.children('div'));
//                                console.log('outside this: ', element.children('div').attr("id"));
//                                console.log('outside this: ', document.getElementsByClassName('hit-area')[1]);
//                                var draggedButton = element.children('div').attr("id");
                                //checks if at least 50% of the surface area of either element is overlapping:
//                                if (scope.hitTest(".hit-area", "50%")) {
//                                    console.log('inside');
//                                }
                                var i = droppables.length;
                                while (--i > -1) {
                                    /*if (this.hitTest(droppables[i], overlapThreshold)) {
                                     $(droppables[i]).addClass("highlight");
                                     } else {
                                     $(droppables[i]).removeClass("highlight");
                                     }*/
                                    /*ALTERNATE TEST: you can use the static Draggable.hitTest() method for even more flexibility, like passing in a mouse event to see if the mouse is overlapping with the element...*/
                                    if (Draggable.hitTest(droppables[i], e) && droppables[i] !== this.target) {
//                                        $(droppables[i]).addClass("highlight");
                                        console.log('inside :: e: ', e, ' droppables[i]: ', droppables[i]);
//                                        transform: translate(1000px, 100px);
//                                        TweenMax.to(Draggable, 1, {
//                                            x: 10, 
//                                            y: 10, 
//                                            top: 0, 
//                                            left: 0,
//                                            ease: Power4.easeOut
//                                        });
                                    } else {
                                        console.log('outside :: e: ', e, ' droppables[i]: ', droppables[i]);
//                                        $(droppables[i]).removeClass("highlight");
                                        TweenMax.to(this, 1, {
                                            x: "100px", 
                                            y: '100px', 
                                            ease: Power4.easeOut
                                        });
//                                        TweenMax.to(Draggable, 1, {
//                                            transform: 'translate(0px, 0px)',
//                                            ease: Power4.easeOut
//                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            };
        });