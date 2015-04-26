(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npQuizController',
                    function ($log, $scope, AssessmentService) {
                        var minPassing, i, j, lastComponent, lastComponentIndex, nLastComponent, nLastComponentIndex, cmpData = $scope.component.data;
                        $log.debug('npQuiz::data', cmpData);
                        if (cmpData.hasOwnProperty('assessed') && parseInt(cmpData.assessed) === 1) {
                            if (cmpData.hasOwnProperty('percentage')) {
                                minPassing = parseFloat(cmpData.percentage);
                                if (minPassing > 1) {
                                    minPassing = minPassing / 100;
                                }
                            }
                            var getResultsBtn = {
                                "type": "npButton",
                                "data": {
                                    "link": "",
                                    "type": "btn-next",
                                    "class": "",
                                    "content": "See Results"
                                },
                                "components": [
                                ]
                            };
                            // add the results button if the last page is a npAsResult
                            lastComponentIndex = $scope.component.components.length - 1;
                            if (lastComponentIndex >= 0) {
                                lastComponent = $scope.component.components[lastComponentIndex];
                                if (lastComponent) {
                                    for (i = 0; i < lastComponent.components.length; i++) {
                                        $log.debug('npQuiz: looking for npAsResult', lastComponent.components[i]);
                                        if (lastComponent.components[i].type === 'npAsResult') {
                                            nLastComponentIndex = $scope.component.components.length - 2;
                                            if (nLastComponentIndex >= 0) {
                                                $scope.component.components[nLastComponentIndex].components.push(getResultsBtn);
                                            }
                                        }
                                    }
                                }
                            }
                            AssessmentService.beginFor(cmpData.id, minPassing);
                        } else {
                            AssessmentService.reset();
                        }
                        if (cmpData.hasOwnProperty('questions')) {
                            $log.debug('has questions property');
                            AssessmentService.setRequiredQuestions(parseInt(cmpData.questions));
                        }
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npQuiz::component loaded!');
                    }
            );

})();
