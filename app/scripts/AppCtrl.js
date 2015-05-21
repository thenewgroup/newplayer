'use strict';
/** @ngInject */
var viewStats = false;
function AppController($log, AssessmentService/*, ImagePreloadFactory, HomeService, $scope*/) {
    if (viewStats) {
        $log.debug('AppController::Init');
    }
    AssessmentService.setRequirements(10, 5, 0.8);
    if (viewStats) {
        $log.info('Initial------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {

        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);

    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.questionCorrectlyAnswered('fq', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake non-required', false);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
    }
    AssessmentService.pageViewed('fake required', true);
    if (viewStats) {
        $log.info('------------------------');
        $log.info('Current Score', AssessmentService.getScore());
        $log.info('Passing', AssessmentService.isPassing());
        $log.info('Page stats', AssessmentService.getPageStats());
        $log.info('Question stats', AssessmentService.getQuestionStats());
    }
}