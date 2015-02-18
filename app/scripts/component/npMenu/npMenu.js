(function () {

  'use strict';
  angular
    .module('newplayer.component')

  /** @ngInject */
    .controller('npMenuController',
    function ($log, $scope, ManifestService, ConfigService, $sce) {
      var cmpData = $scope.component.data || {};
      $log.debug('npMenu::data', cmpData);

      this.items = (cmpData || {}).items;
      if (!angular.isArray(this.items)) {
        this.items = new Array('pages');
      }

      for (var itemIdx in this.items) {
        var item = this.items[itemIdx];
        if (item === 'pages') {

          // have pages been indexed?
          $log.debug('inside content scope', $scope.currentContent);
          if (!$scope.currentContent.pages) {
            var parentIdx = $scope.component.idx.slice(0);
            parentIdx.pop();

            // index pages
            var pages = ManifestService.getAll('npPage', parentIdx);
            var nestedPages = [];
            for (var pageIdx in pages) {
              var page = pages[pageIdx];
              $log.debug('npPage::index:', page);
              if (!!page.data && page.data.inMenu) {
                var aPage =
                {
                  id: page.data.id,
                  //link: '#/' + ConfigService.getManifestId() + '/' + page.data.id,
                  text: page.data.menuTitle || page.data.title,
                  children: []
                };
                if (ManifestService.getPageId() === aPage.id) {
                  $log.debug('npPage::index:current:', page);
                  // TBD - need to be able to adjust current page
                  // disabling for now
                  //aPage.current = true;
                }

                var parentId = page.data.parentId;
                $log.debug('npPage::index:parent?', parentId);
                if (!parentId) {
                  $log.debug('npPage::index:top level:', aPage);
                  nestedPages.push(aPage);
                } else {
                  $log.debug('npPage::index:nest:', parentId, aPage);
                  for (var parentPage in nestedPages) {
                    $log.debug('npPage::index:nest:isEqual?', parentId, nestedPages[parentPage].id);
                    if (nestedPages[parentPage].id === parentId) {
                      nestedPages[parentPage].children.push(aPage);
                    }
                  }
                }
              }
            }
            $log.debug('npPage::index results:', nestedPages);
            $scope.currentContent.pages = nestedPages;
          }
          //else {
          //  // TBD - edit pages $scope.currentContent.pages array to reset current page
          //}


          $log.debug('npMenu::pages', $scope.pages);
          var spliceArgs = [itemIdx, 1].concat($scope.pages);
          Array.prototype.splice.apply(this.items, spliceArgs);
        }
      }
      $log.debug('npMenu::items', this.items);
    }
  )

    .directive('npMenu', npMenuDirective)

  /** @ngInject */
    .run(
    function ($log, $rootScope) {
      $log.debug('npMenu::component loaded!');
    }
  );



  /** @ngInject */
  function npMenuDirective($log, $compile, ManifestService/*, $timeout*/) {
    $log.debug('\nnpMenuDirective::Init\n');
    var Directive = function () {
      this.restrict = 'EA';
      this.scope = {'menuitem': '='};
      this.template =
        '<a ng-click="vm.changePageId(menuitem.id);" id="menu{{menuitem.id}}" ng-class="(menuitem.current===true) ? \'selected\' : \'\'">{{ menuitem.text }}</a>' +
        '<ul>' +
        '<li ng-repeat="child in menuitem.children">' +
        '<span np-menu menuitem="child"></span>' +
        '</li>' +
        '</ul>';

      this.controllerAs = 'vm';
      this.controller = npMenuDirectiveController;

      this.compile = function (tElement, tAttrs, transclude) {
        var contents = tElement.contents().remove();
        $log.debug('npMenu::compile', contents);
        var compiled;
        /** @ngInject */
        return function ($scope, $element, $attributes) {
          if (!compiled) {
            compiled = $compile(contents);
          }
          compiled($scope, function (clone) {
            $log.debug('npMenu::compile:linked', clone);
            $element.append(clone);
          });
        };
      };
    };
    return new Directive();
  }

  /** @ngInject */
  function npMenuDirectiveController($log, ManifestService) {

    var vm = this; // jshint ignore:line
    vm.changePageId = function (toPage) {
      $log.info('changePageId', toPage);
      ManifestService.setPageId(toPage);
    };
  }
})();
