/* jshint -W003, -W117, -W004 */
(function () {
  'use strict';

  angular
    .module('newplayer.service')
    .service('i18nService', i18nService);

  /** @ngInject */
  function i18nService($log) {
    var vm = this;
    var dict = {
      submit: 'Submit',
      next: 'Next',
      pass: 'Congratulations, you scored :USERSCORE:% and have passed this module.',
      fail: 'Sorry, you scored :USERSCORE:% and you needed to score :MINSCORE:% to pass. Try it again!'
    };

    $log.debug('i18n | init');

    function initWithDict(dict) {
      $log.debug('i18n | initWithDict', dict);
    }

    function get(forKey) {
      if( dict.hasOwnProperty(forKey)) {
        return dict[forKey];
      }

      return '';
    }

    var service = {
      initWithDict: initWithDict,
      get: get
    };

    $log.debug('i18n | service init');

    return service;
  }
})();
