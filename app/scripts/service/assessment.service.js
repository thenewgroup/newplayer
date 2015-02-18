(function() {
  'use strict';

  angular
    .module('newplayer.service')
    .service('npAssessment', NpAssessment);

  /** @ngInject */
  function NpAssessment($log, $rootScope, ConfigService) {
    var minPassing = 0,
        vm = this,
        pages = {
          required: 0, total: 0, inventory: {},
          viewed: {required: 0, inventory: {}}
        },

        questions = {
          required: 0, total: 0, inventory: {},
          answered: {required: 0, inventory: {}}
        },
        config = ConfigService.getConfig();

        if( !!config && config.hasOwnProperty('assessment')) {
          if( config.assessment.hasOwnProperty('minPassing')) {
            setMinPassing(config.assessment.minPassing);
          }
        }

    /**
     * Initializes the assessment service for this page/session
     *
     * @param ??
     */
    function setRequirements(requiredPages, requiredQuestions, minimumPassing) {
      $log.info('Assessment:setRequirements | reqPages, reqQuestions, minPassing',
                requiredPages, requiredQuestions, minimumPassing);

      pages.required = requiredPages;
      questions.required = requiredQuestions;
      minPassing = minimumPassing;
    }

    function getMinPassing() {
      return minPassing;
    }

    function setMinPassing(newMinPassing) {
      minPassing = newMinPassing;
      $log.info('Assessment:setMinPassing', minPassing);
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
        questions.answered.inventory[questionName] = false;

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

      return Math.min(( pages.viewed.required + questions.answered.required ) / totalRequired, 1);
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
      $log.info('Assessment:pageViewed | ', pageId);

      if( pages.viewed.inventory[pageId] === false ) {
        pages.viewed.inventory[pageId] = new Date();

        if( pages.inventory[pageId] === true ) {
          pages.viewed.required++;
        }
      } else {
        $log.warning('Assessment:pageViewed | page already viewed, ', pageId);
      }

    }

    /**
     * Record that a question was correctly answered and whether it was required
     *
     * @param pageNamed string The name or ID of the page (we'll keep a stack of it)
     * @param pageIsRequired bool Whether the page was required so it can help user's score.
     */
    function questionCorrectlyAnswered(questionId) {
      $log.info('Assessment:questionCorrectlyAnswered | ', questionId);

      if( questions.answered.inventory[questionId] === false ) {
        questions.answered.inventory[questionId] = new Date();

        if( questions.inventory[questionId] === true ) {
          questions.answered.required++;
        }
      } else {
        $log.warning('Assessment:questionCorrectlyAnswered | question already answered, ', questionId);
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

    /**
     * DEBUG ONLY
     */
    function dumpState() {
      $log.info('Assessment:dumpState | score', getScore());
      $log.info('Assessment:dumpState | isPassing', isPassing());
      $log.info('Assessment:dumpState | pages', pages);
      $log.info('Assessment:dumpState | questions', questions);
      $log.info('Assessment:dumpState | minPassing', minPassing);
    }

    var service = {
      getMinPassing: getMinPassing,
      setMinPassing: setMinPassing,
      getScore: getScore,
      isPassing: isPassing,
      setRequirements: setRequirements,
      addPage: addPage,
      addQuestion: addQuestion,
      pageViewed: pageViewed,
      questionCorrectlyAnswered: questionCorrectlyAnswered,
      getPageStats: getPageStats,
      getQuestionStats: getQuestionStats,

      // DEBUG
      dumpState: dumpState
    };

    $log.info('Assessment | service init');

    return service;
  }
})();
