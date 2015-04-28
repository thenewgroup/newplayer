/* jshint -W003, -W117, -W064 */
(function () {
    'use strict';
    angular
            .module('newplayer.component')
            /** @ngInject */
            .controller('npTriviaController',
                    function ($log, $scope, $rootScope, $timeout, $sce, ManifestService, AssessmentService) {
                        var vm = this;
                        var cmpData = $scope.component.data;
//                        var pagesLen = $scope.components.length;
                        $log.debug('npTrivia::data', cmpData);
                        vm.id = cmpData.id;
                        vm.content = $sce.trustAsHtml(cmpData.content);
                        vm.type = cmpData.type;
                        vm.currentPage = 0;
                        vm.feedback = '';
                        vm.pageId = cmpData.id;
                        vm.difficulty = cmpData.difficulty || 0;
                        //AssessmentService.addPage(cmpData.id, cmpData.required);
                        //////////////////////////////////////////////////////////////////////////////////////
                        //get ready
                        //////////////////////////////////////////////////////////////////////////////////////
                        setTimeout(function () {
                            $scope.$apply(function () {
                                //////////////////////////////////////////////////////////////////////////////////////
                                //on ready set states
                                //////////////////////////////////////////////////////////////////////////////////////
                                var btnNextHeight = $('.btn-next ').outerHeight(true);
                                var pageHeight = $('.npPage').outerHeight(true);
                                TweenMax.set($('.npPage'), {
                                    height: btnNextHeight + pageHeight
                                });
                                TweenMax.set($('.trivia-question-wrapper'), {
                                    height: $('.trivia-question-wrapper').outerHeight(true) + $('.btn-next').outerHeight(true) + 20
                                });
                            });
                        });
                        /* NOTE: commented 2015-04-20 cw77, this disables shuffling of pages */
                        // go to the first page, since pages were shuffled
//                        vm.assment = AssessmentService();
//                        vm.assment.setRequiredPages(pagesLen);
//                        vm.seenComponents = _.shuffle($scope.components); // re-enable for more shuffle
//                        vm.seenComponents = $scope.components;
//                        vm.pageId = vm.seenComponents[0].data.id;
//                        vm.difficulty = vm.seenComponents[0].components[0].data.difficulty || 0;
                        //$timeout(function () {
                        //    ManifestService.setPageId(vm.pageId);
                        //});
                        $rootScope.$on('question.answered', function (evt, correct) {
                            if (correct) {
                                /* NOTE: commented 2015-04-20 cw77, this disables shuffling of pages */
                                //AssessmentService.pageViewed();
                                //vm.currentPage = vm.assment.getPageviewsCount();
                                //vm.pageId = vm.seenComponents[vm.currentPage] ? vm.seenComponents[vm.currentPage].data.id : '';
                                //  ManifestService.setPageId(vm.pageId);
                                $rootScope.$emit('spin-to-win');
                                // end of the trivia questions
                                // TODO - add this message the template and set the two values
                                // here in the controller
                                // NOTE: This text should come from the app
                                //  min-height: 740px;
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