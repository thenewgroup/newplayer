'use strict';

/** @ngInject */
function ManifestController($log, ManifestService, ConfigService, $scope, $state, $stateParams, manifestData/*, ComponentService, $timeout*/) {
  $log.debug('ManifestCtrl::Init');

  var vm = this;

  function initialize() {
    $log.debug('ManifestCtrl:: manifestData ', manifestData);
    //vm.manifestId = ManifestService.getManifestId();
    vm.lang = $stateParams.lang;
    vm.pageId = $stateParams.pageId;

    $log.info(
      'ManifestCtrl::', {
        'state': $state.current.name,
        'url': $state.current.url,
        'manifestData': vm.manifestData,
        'lang': vm.lang,
        'pageId': vm.pageId
      }
    );

    var lang = 'tbd';
    var pageId = 'tbd';
    var config = ConfigService.getConfig();

    if ($state.is('manifest')) {

      if (!!config && !!config.Content && typeof( config.Content.lang ) === 'string') {
        lang = config.Content.lang;
      }
      if (!!config && !!config.Page && typeof( config.Page.pageId ) === 'string') {
        pageId = config.Page.pageId;
      }
      $state.go(
        'manifest.lang.page',
        {
          lang: lang,
          pageId: pageId
        },
        {
          location: 'replace'
        }
      );
    } else if ($state.is('manifest.lang')) {
      lang = $stateParams.lang;
      if (lang !== 'tbd') {
        ManifestService.setLang(lang);
      }
      if (!!config && !!config.Page && typeof( config.Page.pageId ) === 'string') {
        pageId = config.Page.pageId;
      }
      $log.info('Going to manifest.lang.page');
      $state.go(
        'manifest.lang.page',
        {
          lang: lang,
          pageId: pageId
        },
        {
          location: 'replace'
        }
      );
    }


    if ($state.is('manifest.page') || $state.is('manifest.lang.page')) {
      pageId = $stateParams.pageId;
      if (pageId !== 'tbd') {
        ManifestService.setPageId(pageId);
      }
    }


  }

  initialize();
}
