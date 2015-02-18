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
                    var zOriginal = 0;
                    function findHighestZIndex(elem) {
                        var elems = document.getElementsByTagName(elem);
                        var highest = 0;
                        for (var i = 0; i < elems.length; i++) {
                            var zindex = document.defaultView.getComputedStyle(elems[i], null).getPropertyValue("z-index");
                            if ((zindex > highest) && (zindex !== 'auto')) {
                                highest = zindex;
                            }
                        }
                        return highest;
                    }
                    Draggable.create(element, {
                        type: "x,y",
                        edgeResistance: 0.65,
                        bounds: "#draggableContainer",
                        throwProps: true,
                        snap: {
                            x: function (endValue) {
                                return Math.round(endValue / gridWidth) * gridWidth;
                            },
                            y: function (endValue) {
                                return Math.round(endValue / gridHeight) * gridHeight;
                            }
                        },
                        onDrag: function () {
                            scope.$apply(function () {
                                scope.onDrag(scope.draggableButton);
                            });
                        },
                        onDragEnd: function () {
                            scope.$apply(function () {
                                scope.onDragEnd({});
                            });
                        }
                    });
                }
            };
        });