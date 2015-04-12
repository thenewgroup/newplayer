/* jshint -W003, -W117 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            .controller('npDragAndDropSelectController',
                    function ($log, $scope, $sce, $element) {
                        var cmpData = $scope.component.data;
                        var buttonData = $scope.feedback || {};
                        $log.debug('npDragAndDropSelect::data', cmpData, buttonData);
                        var draggableButtons = '';
                        this.draggableButtons = cmpData.draggableButtons;
                        this.id = cmpData.id;
                        this.positiveFeedback = cmpData.positiveFeedback;
                        this.negativeFeedback = cmpData.negativeFeedback;
                        this.baseURL = cmpData.baseURL;
                        this.src = cmpData.image;
                        $scope.positiveFeedback = this.positiveFeedback = cmpData.positiveFeedback;
                        $scope.negativeFeedback = this.negativeFeedback = cmpData.negativeFeedback;
                        $scope.image = this.image = cmpData.image;
                        $scope.content = cmpData.content;
                        $scope.ID = cmpData.id;
                        $scope.select = cmpData.select;
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
                        $log.debug('npDragAndDropSelect::component loaded!');
                    }
            )
            //////////////////////////////////////////////////////////////////////////////////////
            //set evaluate button logic
            //////////////////////////////////////////////////////////////////////////////////////
            .directive('npDragAndDropSelectEvaluate', function () {
                return {
                    restrict: 'A',
                    link: function ($scope, $element, $attrs) {
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on ready set states
                                //////////////////////////////////////////////////////////////////////////////////////
                                TweenMax.set($('.select-response-correct'), {
                                    scale: 0.25,
                                    autoAlpha: 0
                                });
                                TweenMax.set($('.select-response-incorrect'), {
                                    scale: 0.25,
                                    autoAlpha: 0
                                });
                                var hitAreaLength = 0;
                                var hitAreaSelectedLength = '';
                                var hitAreaSelectedIncorrect = '';
                                hitAreaLength = $("[data-match=true]").length;
                                //////////////////////////////////////////////////////////////////////////////////////
                                //evaluate interaction
                                //////////////////////////////////////////////////////////////////////////////////////
                                $scope.evaluate = function () {
                                    hitAreaSelectedLength = $("[data-match=selected]").length;
                                    hitAreaSelectedIncorrect = $("[data-match=skeletor]").length;
                                    $('.hit-area').each(function () {
                                        if (Number(hitAreaLength) === Number(hitAreaSelectedLength) && (hitAreaSelectedIncorrect === 0)) {
                                            TweenMax.to($('.select-response-correct'), 0.75, {
                                                autoAlpha: 1,
                                                scale: 1,
                                                ease: Power4.easeOut
                                            });
                                            TweenMax.to($('.select-response-incorrect'), 0.75, {
                                                autoAlpha: 0,
                                                scale: 0.25,
                                                ease: Power4.easeOut
                                            });
                                        } else {
                                            TweenMax.to($('.select-response-correct'), 0.75, {
                                                autoAlpha: 0,
                                                scale: 0.25,
                                                ease: Power4.easeOut
                                            });
                                            TweenMax.to($('.select-response-incorrect'), 0.75, {
                                                autoAlpha: 1,
                                                scale: 1,
                                                ease: Power4.easeOut
                                            });
                                        }
                                    });

                                };

                            });
                        });
                    }

                };
            })
            //////////////////////////////////////////////////////////////////////////////////////
            //GSAP Draggable Angular directive
            //////////////////////////////////////////////////////////////////////////////////////
            .directive("dragButtonSelect", function () {
                return {
                    restrict: "A",
                    scope: {
                        onDragEnd: "&",
                        onDrag: "&"
                    },
                    link: function (scope, element, attrs) {
                        var hitArea;
                        var hitAreaWrapper = document.getElementById('draggableContainer');
                        var draggables = document.getElementsByClassName('draggableButton');
                        var currentTarget;
                        var currentElement;
                        //////////////////////////////////////////////////////////////////////////////////////
                        //set states
                        //////////////////////////////////////////////////////////////////////////////////////
                        TweenMax.to($('#draggableContainer'), 0, {
                            autoAlpha: 0
                        });
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            scope.$apply(function () {
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on ready set states
                                //////////////////////////////////////////////////////////////////////////////////////
                                hitArea = document.getElementsByClassName('hit-area');
                                TweenMax.to($('.hit-area'), 0, {
                                    strokeOpacity: 0
                                });
                                TweenMax.set($('.boxElements'), {
                                    autoAlpha: 0
                                });
                                TweenMax.to($(hitArea).find('.button-completion-content'), 0.5, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(hitArea).find('.feedback-draggable-button-image'), 0.5, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
                                });
                                TweenMax.to($(hitArea).find('.feedback-draggable-button-content'), 0.5, {
                                    autoAlpha: 0,
                                    ease: Power4.easeOut
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
                                //////////////////////////////////////////////////////////////////////////////////////
                                //build that
                                //////////////////////////////////////////////////////////////////////////////////////
                                shuffle();
                                TweenMax.to($('#draggableContainer'), 0.75, {
                                    autoAlpha: 1,
                                    ease: Power4.easeOut
                                });
                                TweenMax.staggerTo($(".boxElements"), 2, {
                                    scale: 1,
                                    autoAlpha: 1,
                                    delay: 0.75,
                                    ease: Power4.easeOut,
                                    force3D: true
                                }, 0.2);
                                //////////////////////////////////////////////////////////////////////////////////////
                                //get actuall height
                                //////////////////////////////////////////////////////////////////////////////////////
                                $.each($('.boxElements'), function () {
                                    var currentHeight = $(this).find('.button-content').outerHeight();
                                    $(this).height(currentHeight);
                                });
                                $.each($('.boxElements'), function () {
                                    var currentHeight = $(this).find('.select-button-completion-content').outerHeight();
                                    $(this).height(currentHeight);
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
                            var clientHeight = docElem.clientHeight || body.clientHeight || 0;
                            var top = box.top + scrollTop - clientTop;
                            var left = box.left + scrollLeft - clientLeft;
                            var height = box.top + scrollTop - clientHeight;
                            return {top: Math.round(top), left: Math.round(left), height: Math.round(height)};
                        }
                        function update() {
                            //////////////////////////////////////////////////////////////////////////////////////
                            //create draggable, set vars
                            //////////////////////////////////////////////////////////////////////////////////////
                            Draggable.create(element, {
                                type: "x,y",
                                edgeResistance: 0.65,
                                autoScroll: 1,
                                bounds: "#draggableContainer",
                                throwProps: true,
                                overlapThreshold: '50%',
                                onDrag: function (e) {
                                    scope.$apply(function () {
                                        scope.onDrag();
                                    });
                                },
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on drag method/vars
                                //////////////////////////////////////////////////////////////////////////////////////
                                onDragEnd: function (e) {
                                    scope.$apply(function () {
                                        scope.onDragEnd();
                                        var targetNumber = hitArea.length;
                                        var hitAreaPosition;
                                        var hitAreaPositionSelectId;
                                        var hitAreaPositionSelect;
                                        var hitAreaBoolean;
                                        for (var i = 0; i < targetNumber; i++) {
                                            hitArea = document.getElementsByClassName('hit-area');
                                            currentTarget = 'id' + i;
                                            currentElement = element.attr("id");
                                            hitAreaPosition = getOffsetRect(hitArea[i]);
                                            hitAreaPositionSelectId = document.getElementById('select-hit-area-background');
                                            hitAreaPositionSelect = getOffsetRect(hitAreaPositionSelectId);
                                            if (Draggable.hitTest(hitAreaPositionSelect, e) && (currentElement === currentTarget)) {
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                //on drag match set match state
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                hitAreaBoolean = $(hitArea[i]).data('match');
                                                if (Boolean(hitAreaBoolean) === true) {
                                                    $(hitArea[i]).attr('data-match', 'selected');
                                                }
                                                if (Boolean(hitAreaBoolean) === false) {
                                                    $(hitArea[i]).attr('data-match', 'skeletor');
                                                }
                                                hitAreaPosition = getOffsetRect(hitAreaWrapper);
                                                var positionX = (hitAreaPosition.left - hitAreaPosition.left);
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                //on drag match set match position/states
                                                //////////////////////////////////////////////////////////////////////////////////////
                                                TweenMax.to(element, 0.15, {
                                                    autoAlpha: 0,
                                                    x: positionX,
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
                                                TweenMax.to($(hitArea[i]).find('.feedback-draggable-button-image'), 0.5, {
                                                    autoAlpha: 1,
                                                    ease: Power4.easeOut
                                                });
                                                TweenMax.to($(hitArea[i]).find('.feedback-draggable-button-content'), 0.5, {
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
                        $(window).scroll(function () {
                            update();
                        });
                        update();
                    }
                };

            });
    /** @ngInject */
    function npMediaElementDirective($log) {
        $log.debug('\nnpDragAndDropSelect mediaelementDirective::Init\n');
        var Directive = function () {
            this.restrict = 'A';
            this.link = function (scope, element, attrs, controller) {
            };
        };
        return new Directive();
    }
})();
