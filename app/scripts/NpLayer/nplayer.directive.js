/* jshint -W003,-W004, -W038, -W117 */

(function () {

    'use strict';
    angular
            .module('newplayer')
            .directive('npLayer', NpLayer);

    /** @ngInject */
    function NpLayer($log/*,  $timeout*/) {
        $log.debug('NpLayer::Init\n');

        var directive = {
            restrict: 'E',
            scope: {
                manifestId: '@npId',
                manifestURL: '@npUrl',
                overrideURL: '@npOverrideUrl',
                overrideData: '@npOverrideData',
                language: '@npLang',
                onTrackService: '@onTrackService'
            },
            //compile: function (tElement, tAttrs, transclude, ConfigService)
            //{
            //  /** @ngInject */
            //  return function ($scope, $element, $attributes)
            //  {
            //    $log.info('ComponentDirective::compile!', $attributes);
            //    var vm = $scope.vm;
            //
            //
            //
            //    parseComponent( $scope, $element, $attributes );
            //  };
            //},
            controller: NpLayerController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;
    }

    /** @ngInject */
    function NpLayerController($scope, $rootScope, $element, $attrs, $log, $compile,
            APIService, ComponentService, ConfigService, ManifestService) {
        var vm = this;
        vm.manifestData = null;
        vm.overrideData = null;

        // $rootScope.$on('npLangChanged', npLangChanged);
        // $rootScope.$on('npPageWantsChange', npPageChanged);
        //.on('npManifestChanged', npManifestChanged)

        ConfigService.setConfigData(vm);
        loadManifests();

        //function npManifestChanged(event, toManifest, toPage) {
        //
        //}
        function npLangChanged(event, toLang) {
            $log.info('npLangChanged', event, toLang);
            if (!!toLang) {
                ManifestService.setLang(toLang);
                parseComponent($scope, $element, $attrs, $compile);
            }
        }

        function npPageWantsChange(event, toPage) {
            $log.info('npPageWantsChange', event, toPage);
            if (!!toPage) {
                ManifestService.setPageId(toPage);
                //$element.empty();
                //parseComponent($scope, $element, $attrs, $compile);
            }
        }

        //$log.info('NpLayer ConfigService:', ConfigService);

        /*
         * ---------------- supporting functions INSIDE function to keep scope
         */

        function loadManifests() {
            var manifestURL = ConfigService.getManifestURL();
            APIService.getData(manifestURL).then(function (md) {
                vm.manifestData = md;

                var overrideURL = ConfigService.getOverrideURL();

                if (!!vm.language) {
                    ManifestService.setLang(lang);
                }

                if (!!overrideURL) {
                    $log.info('NpLayer: getting override data from:', overrideURL);
                    ConfigService.getOverrideData(overrideURL).then(function (od) {
                        vm.overrideData = od;
                        renderComponent(vm, $scope, $element, $attrs, $compile);
                    });

                } else {
                    $log.info('NpLayer: init manifest', vm.manifestData);
                    renderComponent(vm, $scope, $element, $attrs, $compile);
                }
            });
        }

        $rootScope.$on('npReplaceManifest', function (obj, newManifest) {
            $log.info('NpLayer:changeManifestTo | ', newManifest);
            ConfigService.setManifestURL(newManifest);
            loadManifests();
        });


        function renderComponent(vm, $scope, $element, $attrs, $compile) {
            $element.empty();
            ManifestService.initialize(vm.manifestData, vm.overrideData);
            parseComponent($scope, $element, $attrs, $compile);
        }

        function parseComponent($scope, $element, $attributes, $compile) {
            var cmp = ManifestService.getComponent($attributes.idx);
            var cmpIdx = cmp.idx || [0];

            $log.debug('NpLayer::parseComponent', cmp, cmpIdx, $attributes);
            if (!!cmp) {

                $log.debug('NpLayer::parseComponent then', cmp, cmpIdx);
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
                    $log.debug('NpLayer::parseComponent - HAS SUBS:', cmp);
                    $scope.subCmp = true;
                    $scope.components = cmp.components;
                }

                var templateData = ComponentService.getTemplate(cmp);
                $log.debug('npComponent::parseComponent: template', templateData);

                // modify template before compiling!?
                var tmpTemplate = document.createElement('div');
                tmpTemplate.innerHTML = templateData;

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

                //  }
                //);
            }
        }
    }

})();
