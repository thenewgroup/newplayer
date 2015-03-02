(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .controller('npDragAndDropMatchController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data;
                        var buttonData = $scope.feedback || {};
                        $log.debug('npDragAndDropMatch::data', cmpData, buttonData);
                        var draggableButtons = '';
                        this.draggableButtons = cmpData.draggableButtons;
                        this.id = cmpData.id;
                        this.positiveFeedback = cmpData.positiveFeedback;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.positiveFeedback = this.positiveFeedback = cmpData.positiveFeedback;
                        $scope.image = this.image = cmpData.image;
                        $scope.content = cmpData.content;
                        $scope.ID = cmpData.id;
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
            .directive('mediaelement', npMediaElementDirective)
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npDragAndDropMatch::component loaded!');
                    }
            )
//////////////////////////////////////////////////////////////////////////////////////
//GSAP draggable Angular directive
//////////////////////////////////////////////////////////////////////////////////////
            .directive("dragButton", function () {
//            'use strict';
            return {
                restrict: "A",
                scope: {
                    onDragEnd: "&",
                    onDrag: "&"
                },
                link: function (scope, element, attrs) {
                    var droppables = document.getElementsByClassName('hit-area');
                    var hitAreaWrapper = document.getElementById('draggableContainer');
                    var draggables = document.getElementsByClassName('draggableButton');
                    var currentTarget;
                    var currentElement;
                    console.log(':::::::::::DraggableAngular:::::::::::::');
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
                        TweenMax.to($('.hit-area'), 0, {
                            strokeOpacity: 0
                        });
                        TweenMax.to($(droppables).find('.button-completion-content'), 0.5, {
                            autoAlpha: 0,
                            ease: Power4.easeOut
                        });
                        TweenMax.to($('#draggableContainer'), 1.75, {
                            autoAlpha: 1,
                            ease: Power4.easeOut
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //shuffle that shit
                        //////////////////////////////////////////////////////////////////////////////////////
                        function shuffle() {
                            $("#draggableButtons").each(function () {
                                var divs = $(this).find('.draggableButton');
                                for (var k = 0; k < divs.length; k++) {
                                    $(divs[k]).remove();
                                }
                                //the fisher yates algorithm, from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
                                var l = divs.length;
                                if (l === 0) {
                                    return false;
                                }
                                while (--l) {
                                    var j = Math.floor(Math.random() * (l + 1));
                                    var tempi = divs[l];
                                    var tempj = divs[j];
                                    divs[l] = tempj;
                                    divs[j] = tempi;
                                }
                                for (var m = 0; m < divs.length; m++) {
                                    $(divs[m]).appendTo(this);
                                }
                            });
                        }
                        shuffle();
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
                    var hitAreaPosition = getOffsetRect(hitAreaWrapper);
                    //////////////////////////////////////////////////////////////////////////////////////
                    //on drag offset method
                    //////////////////////////////////////////////////////////////////////////////////////
//                    var boolean;
//                    function setElementPositions(dragging) {
//                        if (boolean = !boolean) {
//                            $('.draggableButton').each(function () {
//                                draggablePositionTop.push($(this).offset());
//                                console.log(':::::::::::::::::::::::::::::::::::::::', $(this).offset(), ':::', $(this).position(), ':::', Math.round(draggablePositionTop[0].top));
//                            });
//                        }
//                    }
                    //////////////////////////////////////////////////////////////////////////////////////
                    //create draggable, set vars
                    //////////////////////////////////////////////////////////////////////////////////////
                    Draggable.create(element, {
                        type: "x,y",
                        edgeResistance: 0.65,
                        bounds: "#draggableContainer",
                        throwProps: true,
                        overlapThreshold: '50%',
                        onDrag: function (e) {
                            scope.$apply(function () {
                                scope.onDrag();
//                                setElementPositions(true);
                            });
                        },
                        //////////////////////////////////////////////////////////////////////////////////////
                        //on drag method/vars
                        //////////////////////////////////////////////////////////////////////////////////////
                        onDragEnd: function (e) {
                            scope.$apply(function () {
                                scope.onDragEnd();
//                                setElementPositions(false);
                                var targetNumber = droppables.length;
                                var droppablesPosition;
                                for (var i = 0; i < targetNumber; i++) {
                                    currentTarget = 'id' + i;
                                    currentElement = element.attr("id");
                                    if (Draggable.hitTest(droppables[i], e) && (currentElement === currentTarget)) {
                                        droppablesPosition = getOffsetRect(droppables[i]);
                                        var positionX = (droppablesPosition.left - hitAreaPosition.left);
//                                        var positionY = (droppablesPosition.top - hitAreaPosition.top) - (Math.round(draggablePositionTop[i].top) - hitAreaPosition.top);
//                                        console.log('inside this droppablesPosition.top: ', droppablesPosition.top, 'positionY: ', positionY);
                                        //////////////////////////////////////////////////////////////////////////////////////
                                        //on drag match set match position/states
                                        //////////////////////////////////////////////////////////////////////////////////////
                                        TweenMax.to(element, 0.15, {
                                            autoAlpha: 0,
                                            x: positionX,
//                                            y: positionY,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.to(droppables[i], 0.5, {
                                            autoAlpha: 0.95,
//                                            fill: '#313131',
                                            strokeOpacity: 1,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.to($(droppables[i]).find('.button-content'), 0.5, {
                                            autoAlpha: 0,
                                            ease: Power4.easeOut
                                        });
                                        TweenMax.to($(droppables[i]).find('.button-completion-content'), 0.5, {
                                            autoAlpha: 1,
                                            ease: Power4.easeOut
                                        });
                                        return;
                                    } else {
                                        //////////////////////////////////////////////////////////////////////////////////////
                                        //on drag no match set state
                                        //////////////////////////////////////////////////////////////////////////////////////
                                        TweenMax.to(element, 1, {
                                            x: "0px",
                                            y: '0px',
                                            ease: Power4.easeOut
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            };
        });
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpDragAndDropMatch mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
})();