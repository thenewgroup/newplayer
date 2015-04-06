/* jshint -W003, -W117, -W004 */
(function () {
  'use strict';

  angular
    .module('newplayer.service')
    .service('AssessmentService', AssessmentService);

  /** @ngInject */
  function AssessmentService($log, $rootScope, ConfigService, AssessmentIOService) {
    var assessmentID, pages, questions,
      vm = this,
      isAssessing,
      minPassing = 0,
      io = AssessmentIOService,              // This is the I/O module for saving/restoring assessment stuff
      config = ConfigService.getConfig();

    if (config.hasOwnProperty('assessmentIO')) {
      setIO(config.assessmentIO);
    }

    // NOTE: this function is run below to initialize this service

    /**
     * Initializes the assessment service back to its 'blank' state.
     */
    function reset() {
      assessmentID = false;
      isAssessing = false;
      minPassing = -1;

      questions = {
        required: 0, total: 0, inventory: {},
        answered: {requiredCorrect: 0, inventory: {}}
      };

      pages = {
        required: 0, total: 0, inventory: {},
        viewed: {required: 0, inventory: {}}
      };
    }

  // NOTE: reset when the IIFE executes after the script is loaded.
    reset();

    /**
     * Begins an assessment session for a given ID and optionally a minimum passing score
     *
     * @param id The unique string for this assessment to identify it to the backend
     * @param newMinPassing A fractional number from 0 to 1 (e.g. 0.75 for 75%)
     */
    function beginFor(id, newMinPassing) {
      //$log.debug('Beginning assessments for ', id, newMinPassing);

      reset();
      assessmentID = id;
      setMinPassing(newMinPassing);

      isAssessing = true;
    }

    /**
     * Mark assessment as complete, whatever that will mean to the end system
     */
    function finalize() {
      if (!isAssessing) {
        //$log.debug('Assessment:finalize | assessment is disabled, ignoring');
        return;
      }

      //$log.debug('NP assessment::finalize | Finalizing assessments for ', assessmentID);

      // TODO - should this wait for a promise?
      io.updateFinal(getAssessment());

      isAssessing = false;
    }


    function getAssessment() {
      return {
        assessmentID: assessmentID,
        isAssessing: isAssessing,
        isPassing: isPassing(),
        minPassing: minPassing,
        pages: pages,
        questions: questions,
        score: getScore()
      };
    }

    /**
     * This sets the mechanism for how the assessment service communicates data
     * to an external data store. See the example in the assessmentio.service.js
     *
     * @see app/scripts/service/assessmentio.service.js
     */
    function setIO(newAssessmentIO) {
      // at some point this may change to validating the plugin
      io = newAssessmentIO;
    }

    // ---------------------------| Scoring

    /**
     * Get the minimum passing score
     * @returns {number} fraction of 1 (e.g. 0.6 for 60%)
     */
    function getMinPassing() {
      return minPassing;
    }

    /**
     * Sets the minimum passing score for this assessment.
     *
     * @param newMinPassing {number} fraction of 1 (e.g. 0.6 for 60%)
     */
    function setMinPassing(newMinPassing) {
      //$log.info('Assessment:setMinPassing', minPassing);

      newMinPassing = parseFloat(newMinPassing);

      if (!isNaN(newMinPassing)) {

        if (newMinPassing > 1) {
          $log.warn('NP assessment::setMinPassing | minPassing should be a fraction of 1. It is unlikely users will pass this assessment.', newMinPassing);
        }

        minPassing = newMinPassing;

      } else if (minPassing === -1 && config.hasOwnProperty('minPassing')) {
        minPassing = config.minPassing;
      } else if( minPassing === -1 ) {
        $log.warn('NP assessment::setMinPassing | no minimum passing score provided to beginFor or in config; any score will pass.');
        minPassing = 0;
      }
    }

    /**
     * Get the user's current score according to page and answer counts
     *
     * @return score from 0..1. Returns 1 if there are no required questions or answers.
     */
    function getScore() {

      if (!isAssessing) {
        return 0;
      }


      /*
       * (# of req. pages viewed + # of correctly answered req. questions) /
       *      (total req. pages + total req. questions)
       */

      var totalRequired = pages.required + questions.required;

      // User scores 100% if there are no requirements...
      if (totalRequired === 0) {
        return 1;
      }

      return Math.min(( pages.viewed.required + questions.answered.requiredCorrect ) / totalRequired, 1);
    }

    /**
     * Determine if the user is passing based on the minPassing score
     *
     * @return bool
     */
    function isPassing() {

      if (!isAssessing) {
        return false;
      }

      if (minPassing === 0) {
        return true;
      }

      return getScore() >= minPassing;
    }

    // ---------------------------| Pages

    function setRequiredPages(newRequiredPages) {

      var requiredPagesInt = parseInt(newRequiredPages);

      if( isNaN(requiredPagesInt)) {
        $log.error('Assessment:setRequiredPages | pages must be a number');
        return;
      }

      pages.required = requiredPagesInt;
    }

    /**
     * Add a potential page to view and whether it is required for score
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param pageIsRequired bool Whether the page was required so it can help user's score.
     */
    function addPage(pageName, pageIsRequired) {

      $log.info('Assessment:addPage | name, required?', pageName, pageIsRequired);

      // look in the inventory to see if this property already exists
      if (pages.inventory.hasOwnProperty(pageName)) {
        $log.warn('Assessment:addPage | ignoring duplicate page ' + pageName);
      } else {
        pages.total++;
        pages.inventory[pageName] = pageIsRequired;
        pages.viewed.inventory[pageName] = false;

        // NOTE: commented for now, we're for now declaring the number of required pages directly
        //if (pageIsRequired) {
        //  pages.required++;
        //}
      }
    }

    /**
     * Record that a page was viewed
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     */
    function pageViewed(pageId) {
      //$log.info('Assessment:pageViewed | ', pageId);

      if (pages.viewed.inventory[pageId] === false) {
        pages.viewed.inventory[pageId] = new Date();

        if (pages.inventory[pageId] === true) {
          pages.viewed.required++;

          if (isAssessing) {
            io.updatePage(pageId, getAssessment());
          }
        }
      } else {
        $log.warning('Assessment:pageViewed | page already viewed, ', pageId);
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
     * Gets the count of number of unique pageviews
     * @returns {pages.viewed.total|*}
     */
    function getPageviewsCount() {
      return pages.viewed.total;
    }



    // ---------------------------| Q+A


    function setRequiredQuestions(newRequiredQuestions) {

      var requiredQuestionsInt = parseInt(newRequiredQuestions);

      if( isNaN(requiredQuestionsInt)) {
        $log.error('Assessment:setRequiredQuestions | questions must be a number');
        return;
      }

      questions.required = requiredQuestionsInt;
      dumpState();
    }

    /**
     * Record that a question was correctly answered and whether it was required
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param pageIsRequired bool Whether the page was required so it can help user's score.
     */
    function addQuestion(questionName, questionIsRequired) {

      $log.info('Assessment:addQuestion | name, required?', questionName, questionIsRequired);

      // look in the inventory to see if this property already exists
      if (questions.inventory.hasOwnProperty(questionName)) {
        $log.warn('Assessment:addQuestion | ignoring duplicate page ' + questionName);
      } else {
        questions.total++;
        questions.inventory[questionName] = questionIsRequired;
        questions.answered.inventory[questionName] = {
          isCorrect: null,
          isRequired: questionIsRequired,
          answered: false
        };

        //NOTE: We are setting question required count through setRequiredQuestions()
        //if (questionIsRequired) {
        //  questions.required++;
        //}
      }
    }

    /**
     * Record that a question was correctly answered and whether it was required
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param isCorrect bool Whether the answer provided is correct
     */
    function questionAnswered(questionId, isCorrect) {

      $log.info('Assessment:questionAnswered | ', questionId, isCorrect);

      if (questions.answered.inventory[questionId].answered === false) {
        questions.answered.inventory[questionId].answered = new Date();
        questions.answered.inventory[questionId].isCorrect = !!isCorrect;

        if (isCorrect && questions.answered.inventory[questionId].isRequired) {
          questions.answered.requiredCorrect++;
        }

        if (isAssessing) {
          io.updateQuestion(questionId, getAssessment());
        }

      } else {
        $log.warning('Assessment:questionAnswered | question already answered, ', questionId);
      }
    }

    /**
     * Gets all questions stats
     *
     * @return obj of questions stats
     */
    function getQuestionStats() {
      return questions;
    }

    /**
     * DEBUG ONLY
     */
    function dumpState() {
      $log.info('Assessment:dumpState | ', getAssessment());
    }

    var service = {
      beginFor: beginFor,
      finalize: finalize,
      getAssessment: getAssessment,
      reset: reset,
      setIO: setIO,

      //--- Scoring
      getMinPassing: getMinPassing,
      getScore: getScore,
      isPassing: isPassing,
      setMinPassing: setMinPassing,

      //--- Pages
      addPage: addPage,
      getPageviewsCount: getPageviewsCount,
      getPageStats: getPageStats,
      pageViewed: pageViewed,
      setRequiredPages: setRequiredPages,

      //--- Questions
      addQuestion: addQuestion,
      getQuestionStats: getQuestionStats,
      questionAnswered: questionAnswered,
      setRequiredQuestions: setRequiredQuestions,

      // DEBUG
      dumpState: dumpState
    };

    $log.info('Assessment | service init');

    return service;
  }
})();
