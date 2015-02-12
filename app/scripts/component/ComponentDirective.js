(function() {

'use strict';
angular
  .module('newplayer')
  .directive('newplayer' , Newplayer);

/** @ngInject */
function Newplayer($log, ManifestService, ComponentService, $compile/*, $stateParams, $state, $timeout*/) {
  $log.debug('\nNewplayer::Init\n');

  var directive = {
    restrict: 'EA',
    scope: {
      manifestId: '@npId',
      manifestURL: '@npUrl',
      overrideURL: '@npOverrideUrl',
      overrideData: '@npOverrideData',
      language: '@npLang'
    },

    controller: NewplayerController,
    controllerAs: 'vm',
    bindToController: true
  };

  //compile: function (tElement, tAttrs, transclude)
  //{
  //  /** @ngInject */
  //  return function ($scope, $element, $attributes)
  //  {
  //    $log.debug('ComponentDirective::compile!');
  //
  //    parseComponent( $scope, $element, $attributes );
  //  };
  //};

  return directive;
}

/** @ngInject */
function NewplayerController($log, $scope, $element, $attrs) {
  var vm = this;

  $log.info('NewPlayerController vm:', vm);
}

/*
 * parses a component pulled in from the manifest service
 */

function parseComponent($log, $scope, $element, $attributes) {
  var cmp = ManifestService.getComponent($attributes.idx);
  var cmpIdx = cmp.idx || [0];

  $log.debug('NewPlayer::parseComponent', cmp, cmpIdx, $attributes);
  if (!!cmp) {
    ComponentService.load(
      cmp
    )
      .then(
      function () {
        $log.debug('NewPlayer::parseComponent then', cmp, cmpIdx);
        // reset scope!!!
        $scope.subCmp = false;
        $scope.component = cmp;
        $scope.components = null;

        $scope.cmpIdx = cmpIdx.toString();

        $element.attr('data-cmpType', cmp.type);
        $element.addClass('np-cmp-sub');

        if (!!cmp.data) {
          // set known data values
          var attrId = cmp.data.id;
          if (!attrId) {
            attrId = cmp.type + ':' + cmpIdx.toString();
          }
          // id must start with letter (according to HTML4 spec)
          if (/^[^a-zA-Z]/.test(attrId)) {
            attrId = 'np' + attrId;
          }
          // replace invalid id characters (according to HTML4 spec)
          attrId = attrId.replace(/[^\w\-.:]/g, '_');
          //$element.attr( 'id', attrId );
          if (!cmp.data.id) {
            cmp.data.id = attrId;
          }
          $element.attr('id', 'np_' + attrId);

          var attrClass = cmp.data['class'];
          if (angular.isString(attrClass)) {
            attrClass = attrClass.replace(/[^\w\-.:]/g, '_');
            $element.addClass('np_' + attrClass);
          }

          var attrPlugin = cmp.data.plugin;
          if (angular.isString(attrPlugin)) {
            attrPlugin = attrPlugin.replace(/[^\w\-.:]/g, '_');
          }
        }
        if (!!cmp.components && cmp.components.length > 0) {
          $log.debug('NewPlayer::parseComponent - HAS SUBS:', cmp);
          $scope.subCmp = true;
          $scope.components = cmp.components;
        }

        ComponentService.getTemplate(
          cmp
        )
          .then(
          function (data) {
            $log.debug('NewPlayer::parseComponent: template', data);

            // modify template before compiling!?
            var tmpTemplate = document.createElement('div');
            tmpTemplate.innerHTML = data.data;

            var ngWrapperEl, ngMainEl, ngSubEl;
            ngWrapperEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-wrapper'));
            ngMainEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-main'));
            ngSubEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-sub'));
            if (ngWrapperEl.length) {
              ngWrapperEl.attr('id', attrId);
              ngWrapperEl.addClass(attrPlugin);

              // pass all "data-*" attributes into element
              angular.forEach(cmp.data, function (val, key) {
                if (angular.isString(key) && key.indexOf('data-') === 0) {
                  ngWrapperEl.attr(key, val);
                }
              });
            }
            if (ngMainEl.length) {
              if (!ngWrapperEl.length) {
                ngMainEl.attr('id', attrId);
                ngMainEl.addClass(attrPlugin);

                // pass all "data-*" attributes into element
                angular.forEach(cmp.data, function (val, key) {
                  if (angular.isString(key) && key.indexOf('data-') === 0) {
                    ngMainEl.attr(key, val);
                  }
                });
              }
              ngMainEl.addClass(attrClass);
            }

            var compiledTemplate = $compile(tmpTemplate.innerHTML);
            compiledTemplate($scope, function (clone) {
              $element.append(clone);
            });
          }
        );

      }
    );
  }
}
})();
