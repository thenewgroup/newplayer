/* jshint -W003, -W117, -W064 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npTriviaController',
                    function ($log, $scope, $rootScope, $timeout, ManifestService, $sce) {
                        var vm = this;
                        var cmpData = $scope.component.data;
                        var pagesLen = $scope.components.length;
                        $log.debug('npTrivia::data', cmpData);
                        vm.id = cmpData.id;
                        vm.content = $sce.trustAsHtml(cmpData.content);
                        vm.type = cmpData.type;
                        vm.currentPage = 0;
                        vm.feedback = '';
//                        vm.assment = AssessmentService();
//                        vm.assment.setRequiredPages(pagesLen);
                        vm.seenComponents = _.shuffle($scope.components);
                        vm.pageId = vm.seenComponents[0].data.id;
                        vm.difficulty = vm.seenComponents[0].components[0].data.difficulty || 0;
                        // go to the first page, since pages were shuffled
                        $timeout(function () {
                            ManifestService.setPageId(vm.pageId);
                        });
                        $rootScope.$on('question.answered', function (evt, correct) {
                            if (correct) {
                                vm.assment.pageViewed();
                                vm.currentPage = vm.assment.getPageviewsCount();
                                vm.pageId = vm.seenComponents[vm.currentPage] ? vm.seenComponents[vm.currentPage].data.id : '';
                                ManifestService.setPageId(vm.pageId);
                                $rootScope.$emit('spin-to-win');
                                // end of the trivia questions
                                // TODO - add this message the template and set the two values
                                // here in the controller
                                // NOTE: This text should come from the app
                                if (!vm.pageId) {
                                    vm.feedback = 'Good job, you scored 5,000 points out of 7,500 possible.';
                                }
                            }
                        });
                    }
            )
            /** @ngInject */
            .run(
                    function ($log, $rootScope) {
                        $log.debug('npTrivia::component loaded!');
                    }
            );
})();
