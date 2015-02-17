(function () {

  'use strict';
  angular
    .module('newplayer.component')
  /** @ngInject */
    .controller('npHotspotButtonController',
    function ($log, $scope, $sce, $location, $element, ConfigService) {
      var cmpData = $scope.component.data || {};
      $log.debug('npHotspotButton::data', cmpData);
      console.log('npHotspotButton::data', cmpData);
      //////////////////////////////
      this.src = cmpData.image;
      $scope.image = this.image = cmpData.image;
      console.log('button image ref: ' + $scope.image);
      ////////////////////////////

      this.content = '';
      var btnContent = cmpData.content;
      console.log('button content: ' + btnContent);
      if (angular.isString(btnContent)) {
        this.content = $sce.trustAsHtml(btnContent);
        //$element.append( btnContent );
      }

      this.link = '';
      this.type = cmpData.type;
      this.target = cmpData.target;
      this.linkInternal = true;
      var btnLink = cmpData.link;
      if (angular.isString(btnLink)) {
        if (btnLink.indexOf('/') === 0) {
          if (!this.target) {
            this.target = '_top';
          }
          this.linkInternal = false;
        } else if (/^([a-zA-Z]{1,10}:)?\/\//.test(btnLink)) {
          if (!this.target) {
            this.target = '_blank';
          }
          this.linkInternal = false;
        } else {
          if (btnLink.indexOf('#') === 0) {
            btnLink = btnLink.substr(1);
          } else {
            btnLink = '/' + ConfigService.getManifestId() + '/' + btnLink;
          }
        }
        $log.debug('npHotspotButton::link', btnLink);
        this.link = $sce.trustAsResourceUrl(btnLink);
      }
      this.go = function () {
        if (this.linkInternal) {
          $location.url(this.link);
        } else {
          window.open(this.link, this.target);
        }
      };
    }
  )

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npHotspotButton::component loaded!');
    }
  );
})();
