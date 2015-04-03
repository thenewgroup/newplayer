/* jshint -W003, -W117, -W004 */
(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .service('AssessmentService', AssessmentService);

  /** @ngInject */
  function AssessmentService($log, $rootScope, ConfigService, AssessmentIOService) {
    var minPassing = 0,
        vm = this,
        pages = {
          required: 0, total: 0, inventory: {},
          viewed: {required: 0, inventory: {}}
        },

        questions = {
          required: 0, total: 0, inventory: {},
          answered: {requiredCorrect: 0, inventory: {}}
        },
        io = AssessmentIOService,              // This is the I/O module for saving/restoring assessment stuff
        config = ConfigService.getConfig();

      if( config.hasOwnProperty('minPassing')) {
        setMinPassing(config.minPassing);
      }

      if( config.hasOwnProperty('assessmentIO')) {
        setIO(config.assessmentIO);
      }

    /**
     *
     */
    function setIO(newAssessmentIO) {
      // at some point this may change to validating the plugin
      io = newAssessmentIO;
    }

    /**
     * Initializes the assessment service for this page/session
     *
     * @param ??
     */
    function setRequirements(requiredPages, requiredQuestions, minimumPassing) {
      //$log.info('Assessment:setRequirements | reqPages, reqQuestions, minPassing',
      //          requiredPages, requiredQuestions, minimumPassing);

      pages.required = requiredPages;
      questions.required = requiredQuestions;
      minPassing = minimumPassing;
    }

    function getMinPassing() {
      return minPassing;
    }

    function setMinPassing(newMinPassing) {
      minPassing = newMinPassing;
      //$log.info('Assessment:setMinPassing', minPassing);
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
      if( pages.inventory.hasOwnProperty(pageName)) {
        $log.warn('Assessment:addPage | ignoring duplicate page ' + pageName);
      } else {
        pages.total++;
        pages.inventory[pageName] = pageIsRequired;
        pages.viewed.inventory[pageName] = false;

        if( pageIsRequired ) {
          pages.required++;
        }
      }
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
      if( questions.inventory.hasOwnProperty(questionName)) {
        $log.warn('Assessment:addQuestion | ignoring duplicate page ' + questionName);
      } else {
        questions.total++;
        questions.inventory[questionName] = questionIsRequired;
        questions.answered.inventory[questionName] = {
          isCorrect: null,
          isRequired: questionIsRequired,
          answered: false
        };

        if( questionIsRequired ) {
          questions.required++;
        }
      }
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

      return Math.min(( pages.viewed.required + questions.answered.requiredCorrect ) / totalRequired, 1);
    }

    /**
     * Determine if the user is passing based on the minPassing score
     *
     * @return bool
     */
    function isPassing() {
      if (minPassing === 0) {
        return true;
      }

      return getScore() >= minPassing;
    }

    /**
     * Record that a page was viewed and whether it was required
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param pageIsRequired bool Whether the page was required so it can help user's score.
     */
    function pageViewed(pageId) {
      //$log.info('Assessment:pageViewed | ', pageId);

      if( pages.viewed.inventory[pageId] === false ) {
        pages.viewed.inventory[pageId] = new Date();

        if( pages.inventory[pageId] === true ) {
          pages.viewed.required++;
          io.updatePage(pageId, getAssessment());
        }
      } else {
        $log.warning('Assessment:pageViewed | page already viewed, ', pageId);
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

      if( questions.answered.inventory[questionId].answered === false ) {
        questions.answered.inventory[questionId].answered = new Date();
        questions.answered.inventory[questionId].isCorrect = !!isCorrect;

        if( isCorrect && questions.answered.inventory[questionId].isRequired ) {
          questions.answered.requiredCorrect++;
        }

        io.updateQuestion(questionId, getAssessment());
      } else {
        $log.warning('Assessment:questionAnswered | question already answered, ', questionId);
      }
    }

    /**
     * Mark assessment as complete, whatever that will mean to the end system
     */
    function finalize() {
      io.updateFinal(getAssessment());
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

    function getAssessment() {
      return {
        isPassing: isPassing(),
        minPassing: minPassing,
        pages: pages,
        questions: questions,
        score: getScore()
      };
    }

    /**
     * DEBUG ONLY
     */
    function dumpState() {
      $log.info('Assessment:dumpState | ', getAssessment());
    }

    var service = {
      addPage: addPage,
      addQuestion: addQuestion,
      finalize: finalize,
      getAssessment: getAssessment,
      getMinPassing: getMinPassing,
      getPageStats: getPageStats,
      getQuestionStats: getQuestionStats,
      getScore: getScore,
      isPassing: isPassing,
      pageViewed: pageViewed,
      questionAnswered: questionAnswered,
      setMinPassing: setMinPassing,
      setRequirements: setRequirements,

      // DEBUG
      dumpState: dumpState
    };

    $log.info('Assessment | service init');

    return service;
  }
})();
