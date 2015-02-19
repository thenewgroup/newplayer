'use strict';

angular
        .module(
                'npDragAndDrop', ['DarggableAngular']
                );

/** @ngInject */
function npMediaElementDirective($log) {
    $log.debug('\nnpDragAndDrop mediaelementDirective::Init\n');
    var Directive = function () {
        this.restrict = 'A';
        this.link = function (scope, element, attrs, controller) {
        };
    };
    return new Directive();
}
angular
        .module('npDragAndDrop')
        .controller('npDragAndDropController',
                function ($log, $scope, $sce, $element) {
                    var cmpData = $scope.component.data;
                    var buttonData = $scope.feedback || {};
                    $log.debug('npDragAndDrop::data', cmpData, buttonData);
                    var draggableButtons = '';
                    this.draggableButtons = cmpData.draggableButtons;

                    this.id = cmpData.id;
                    this.baseURL = cmpData.baseURL;
                    this.src = cmpData.image;
                    $scope.feedback = this.feedback = cmpData.feedback;
                    $scope.image = this.image = cmpData.image;
                    $scope.content = cmpData.content;
                    $scope.ID = cmpData.id;
//                    this.update = function (button) {
//                        var idx = this.draggableButtons.indexOf(button);
//                        this.feedback = button.feedback;
//                        console.log('idx: ', idx);
//                    };
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
                    /**
                     * DRAG event handler
                     */
                    $scope.onDrag = function (value) {
                        $scope.currentRotation = value;
                    };
                    /**
                     * DRAG END event handler
                     */
                    $scope.onDragEnd = function (value) {
                        $scope.currentRotation = value;
                        console.log("DRAG_END", value);
                    };
                }
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
        )
        .directive('mediaelement', npMediaElementDirective)
        /** @ngInject */
        .run(
                function ($log, $rootScope) {
                    $log.debug('npDragAndDrop::component loaded!');
                }
        );