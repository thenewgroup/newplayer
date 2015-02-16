(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .service('AssessmentService', AssessmentService)

  /** @ngInject */
  function AssessmentService($log) {

    var pages = {required: 0, viewed: {required: 0, total: 0, log: []}};
    var questions = {required: 0, answered: {required: 0, total: 0, log: []}};
    var minimumPassing = 0.8;

    /**
     * Initializes the assessment service for this page/session
     *
     * @param ??
     */
    function setRequirements(requiredPages, requiredQuestions, minimumPassing) {
      pages.required = requiredPages;
      questions.required = requiredQuestions;
      minimumPassing = minimumPassing;
    }

    /**
     * Get the user's current score according to page and answer counts
     *
     * @return score from 0..1. Returns 1 if there are no required questions or answers.
     */
    function getScore() {
      /*
       * (# of req. pages viewed + # of correctly answered req. questions) /
       *      (total req. pages + total req. questions)
       */

      var totalRequired = pages.required + questions.required;

      // User scores 100% if there are no requirements...
      if (totalRequired === 0) {
        return 1;
      }

      return Math.min(( pages.viewed.required + questions.answered.required ) / totalRequired, 1);
    }

    /**
     * Determine if the user is passing based on the minimumPassing score
     *
     * @return bool
     */
    function isPassing() {

      if (minimumPassing === 0) {
        return true;
      }

      return getScore() >= minimumPassing;
    }

    /**
     * Record that a page was viewed and whether it was required
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param pageIsRequired bool Whether the page was required so it can help user's score.
     */
    function pageViewed(pageName, pageIsRequired) {
      pages.viewed.total++;
      pages.viewed.log.push(pageName);

      if (pageIsRequired) {
        pages.viewed.required++;
      }
    }

    /**
     * Record that a question was correctly answered and whether it was required
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param pageIsRequired bool Whether the page was required so it can help user's score.
     */
    function questionCorrectlyAnswered(questionName, questionIsRequired) {
      questions.answered.total++;
      questions.answered.log.push(questionName);

      if (questionIsRequired) {
        questions.answered.required++;
      }
    }

    /**
     * Gets all pageview data
     *
     * @return obj of pageview stats
     */
    function getPageStats() {
      return pages;
    }

    /**
     * Gets all questions stats
     *
     * @return obj of questions stats
     */
    function getQuestionStats() {
      return questions;
    }

    var service = {
      getScore: getScore,
      isPassing: isPassing,
      setRequirements: setRequirements,
      pageViewed: pageViewed,
      questionCorrectlyAnswered: questionCorrectlyAnswered,
      getPageStats: getPageStats,
      getQuestionStats: getQuestionStats
    };

    return service;
  }
})();
