//'use strict';
/*jshint bitwise: false, -W003, -W117*/
angular
        .module('npDragAndMatch', ['npDragAndMatchDragDirective']);
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
        .module('npDragAndMatch')
        .controller('npDragAndMatchController',
                function ($log, $scope, $sce, $element) {
                    var cmpData = $scope.component.data;
                    var buttonData = $scope.feedback || {};
                    $log.debug('npDragAndMatch::data', cmpData, buttonData);
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
                    $log.debug('npDragAndMatch::component loaded!');
                }
        );
//////////////////////////////////////////////////////////////////////////////////////
//GSAP draggable Angular directive
//////////////////////////////////////////////////////////////////////////////////////
angular
        .module('npDragAndMatchDragDirective', [])
        .directive("dragButton", function () {
            return {
                restrict: "A",
                $scope: {
                    onDragEnd: "&",
                    onDrag: "&"
                },
                link: function ($scope, $element, attrs) {
                    var hitArea;
                    var hitAreaWrapper = document.getElementById('draggableContainer');
//                    var draggables = document.getElementsByClassName('draggableButton');
                    var currentTarget;
                    var currentElement;
                    //////////////////////////////////////////////////////////////////////////////////////
                    //set states
                    //////////////////////////////////////////////////////////////////////////////////////
                    TweenMax.to($('#draggableContainer'), 0, {
                        autoAlpha: 0
                    });
                    setTimeout(function () {
                        $scope.$apply(function () {
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on ready set states
                            //////////////////////////////////////////////////////////////////////////////////////
                            hitArea = document.getElementsByClassName('hit-area');
                            TweenMax.to($('.hit-area'), 0, {
                                strokeOpacity: 0
                            });
                            TweenMax.to($(hitArea).find('.button-completion-content'), 0.5, {
                                autoAlpha: 0,
                                ease: Power4.easeOut
                            });
                            TweenMax.to($('#draggableContainer'), 1.75, {
                                autoAlpha: 1,
                                ease: Power4.easeOut
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //get actuall height
                            //////////////////////////////////////////////////////////////////////////////////////
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $.each($('.boxElements'), function () {
                                        var currentHeight = $(this).find('.button-content').outerHeight(true);
                                        console.log(
                                                '\n::::::::::::::::::::::::::::::::::::::get actuall height:::::::::::::::::::::::::::::::::::::::::::::::::::',
                                                '\n::currentHeight::', currentHeight,
                                                '\n:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                                                );
                                        $(this).height(currentHeight);
                                    });
                                });
                            });
                            //////////////////////////////////////////////////////////////////////////////////////
                            //shuffle that
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
                        var clientHeight = elem.clientHeight || 0;
                        var offsetHeight = elem.offsetHeight || 0;
                        var scrollHeight = elem.scrollHeight || 0;
                        var top = box.top + scrollTop - clientTop;
                        var left = box.left + scrollLeft - clientLeft;
                        var height = box.height - scrollTop;
                        var bottom = top + (box.bottom - box.top);
                        var right = left + (box.right - box.left);
//                            var height = clientHeight;
//                        console.log(
//                                '\n::::::::::::::::::::::::::::::::::::::getOffsetRect:::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
//                                '\n::elem.clientHeight::', elem.clientHeight,
//                                '\n::box.height::', box.height,
//                                '\n::box.bottom::', box.bottom,
//                                '\n::clientHeight::', clientHeight,
//                                '\n::offsetHeight::', offsetHeight,
//                                '\n::scrollHeight::', scrollHeight,
//                                '\n::scrollTop::', scrollTop,
//                                '\n::clientTop::', clientTop,
//                                '\n::height::', height,
//                                '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                );
                        return {
                            top: Math.round(top),
                            left: Math.round(left),
                            bottom: Math.round(bottom),
                            right: Math.round(right)
                        };
                    }
                    var windowOffset;
                    $(window).scroll(function () {
                        windowOffset = $(window).scrollTop();
                    });
                    function update() {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //create draggable, set vars
                        //////////////////////////////////////////////////////////////////////////////////////
                        Draggable.create($element, {
                            type: "x,y",
                            edgeResistance: 0.65,
//                                autoScroll: 1,
                            bounds: "#draggableContainer",
                            throwProps: true,
                            overlapThreshold: '50%',
                            onDrag: function (e) {
                                $scope.$apply(function () {
                                    $scope.onDrag();
                                });
                            },
                            //////////////////////////////////////////////////////////////////////////////////////
                            //on drag method/vars
                            //////////////////////////////////////////////////////////////////////////////////////
                            onDragEnd: function (e) {
                                $scope.$apply(function () {
                                    $scope.onDragEnd();
                                    var targetNumber = hitArea.length;
                                    var hitAreaPosition = 'undefined';
                                    for (var i = 0; i < targetNumber; i++) {
                                        hitArea = document.getElementsByClassName('hit-area');
                                        currentTarget = 'id' + i;
                                        currentElement = $element.attr("id");
                                        hitAreaPosition = getOffsetRect(hitArea[i]);
                                        if (Draggable.hitTest(hitAreaPosition, e) && (currentElement === currentTarget)) {
                                            hitAreaPosition = getOffsetRect(hitAreaWrapper);
                                            var positionX = (hitAreaPosition.left - hitAreaPosition.left);
//                                          var positionY = (hitAreaPosition.top - hitAreaPosition.top) - (Math.round(draggablePositionTop[i].top) - hitAreaPosition.top);
                                            var postionTopOffset = Math.round(windowOffset + hitAreaPosition.top);
//                                            console.log(
//                                                    '\n::::::::::::::::::::::::::::::::::::::atTop::atTop:::::::::::::::::::::::::::::::::::::::::::::::::',
//                                                    '\n::hitAreaPosition.top::', hitAreaPosition.top,
//                                                    '\n::hitAreaPosition.height::', hitAreaPosition.height,
//                                                    '\n::postionTopOffset::', postionTopOffset,
//                                                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                                                    );
                                            //////////////////////////////////////////////////////////////////////////////////////
                                            //on drag match set match position/states
                                            //////////////////////////////////////////////////////////////////////////////////////
                                            TweenMax.to($element, 0.15, {
                                                autoAlpha: 0,
                                                x: positionX,
//                                            y: positionY,
                                                ease: Power4.easeOut
                                            });
                                            TweenMax.to(hitArea[i], 0.5, {
                                                autoAlpha: 0.95,
                                                strokeOpacity: 1,
                                                ease: Power4.easeOut
                                            });
                                            TweenMax.to($(hitArea[i]).find('.button-content'), 0.5, {
                                                autoAlpha: 0,
                                                ease: Power4.easeOut
                                            });
                                            TweenMax.to($(hitArea[i]).find('.button-completion-content'), 0.5, {
                                                autoAlpha: 1,
                                                ease: Power4.easeOut
                                            });
                                            return;
                                        } else {
                                            //////////////////////////////////////////////////////////////////////////////////////
                                            //on drag no match set state
                                            //////////////////////////////////////////////////////////////////////////////////////
                                            TweenMax.to($element, 1, {
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
                    $(window).scroll(function () {
                        update();
                    });
                    update();
                }
            };
        });