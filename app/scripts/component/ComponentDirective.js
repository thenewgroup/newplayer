'use strict';

/** @ngInject */
function ComponentDirective(
        $log, ManifestService, ComponentService, $compile/*, $stateParams, $state, $timeout*/
        )
{
    $log.debug('\nComponentDirective::Init\n');

    var Directive = function ()
    {
        var vm = this;
        this.restrict = 'EA';
        this.scope = true;
        /** @ngInject */
        this.controller =
                function ($scope, $element, $attrs)
                {
                    /*
                     var $attributes = $element[0].attributes;
                     $log.debug( 'ComponentDirective::controller', $element, $attrs );
                     */
                    //parseComponent( $scope, $element, $attrs );
                };
        this.controllerAs = 'vm';
        this.compile = function (tElement, tAttrs, transclude)
        {
            /** @ngInject */
            return function ($scope, $element, $attributes)
            {
                $log.debug('ComponentDirective::compile!');

                parseComponent($scope, $element, $attributes);
            };
        };


        function compileTemplate(html, $scope, $element)
        {
            var compiled = $compile(html);
            compiled($scope, function (clone) {
                $element.append(clone);
            });
            /*
             // if moving back up to parent
             if ( !!cmp.components && cmp.components.length > 0 )
             {} else {
             compiled = $compile( '<np-component>appended to ' + cmp.type + '</np-component>' );
             linked = compiled($scope);
             $element.append( linked );
             }
             */
        }

        /*
         * parses a component pulled in from the manifest service
         */
        function parseComponent($scope, $element, $attributes)
        {
            var cmp = ManifestService.getComponent($attributes.idx);
            var cmpIdx = cmp.idx || [0];

            $log.debug('ComponentDirective::parseComponent', cmp, cmpIdx, $attributes);
            if (!!cmp)
            {
                ComponentService.load(
                        cmp
                        )
                        .then(
                                function ()
                                {
                                    $log.debug('ComponentDirective::parseComponent then', cmp, cmpIdx);
                                    // reset scope!!!
                                    $scope.subCmp = false;
                                    $scope.component = cmp;
                                    $scope.components = null;

                                    $scope.cmpIdx = cmpIdx.toString();

                                    $element.attr('data-cmpType', cmp.type);
                                    $element.addClass('np-cmp-sub');

                                    if (!!cmp.data)
                                    {
                                        // set known data values
                                        var attrId = cmp.data.id;
                                        if (!attrId)
                                        {
                                            attrId = cmp.type + ':' + cmpIdx.toString();
                                        }
                                        // id must start with letter (according to HTML4 spec)
                                        if (/^[^a-zA-Z]/.test(attrId))
                                        {
                                            attrId = 'np' + attrId;
                                        }
                                        // replace invalid id characters (according to HTML4 spec)
                                        attrId = attrId.replace(/[^\w\-.:]/g, '_');
                                        //$element.attr( 'id', attrId );
                                        if (!cmp.data.id)
                                        {
                                            cmp.data.id = attrId;
                                        }
                                        $element.attr('id', 'np_' + attrId);

                                        var attrClass = cmp.data['class'];
                                        if (angular.isString(attrClass))
                                        {
                                            attrClass = attrClass.replace(/[^\w\- .:]/g, '_');
                                            var classArraySpace = attrClass.split(' ');
                                            for (var ii in classArraySpace) {
                                                $element.addClass('np_' + classArraySpace[ii]);
                                            }
                                        }
                                        var attrPlugin = cmp.data.plugin;
                                        if (angular.isString(attrPlugin))
                                        {
                                            attrPlugin = attrPlugin.replace(/[^\w\-.:]/g, '_');
                                        }
                                    }
                                    if (!!cmp.components && cmp.components.length > 0)
                                    {
                                        $log.debug('ComponentDirective::parseComponent - HAS SUBS:', cmp);
                                        $scope.subCmp = true;
                                        $scope.components = cmp.components;
                                    }
                                    ComponentService.getTemplate(
                                            cmp
                                            )
                                            .then(
                                                    function (data)
                                                    {
                                                        $log.debug('ComponentDirective::parseComponent: template', data);

                                                        // modify template before compiling!?
                                                        var tmpTemplate = document.createElement('div');
                                                        tmpTemplate.innerHTML = data.data;

                                                        var ngWrapperEl, ngMainEl, ngSubEl;
                                                        ngWrapperEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-wrapper'));
                                                        ngMainEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-main'));
                                                        ngSubEl = angular.element(tmpTemplate.querySelectorAll('.np-cmp-sub'));
                                                        if (ngWrapperEl.length)
                                                        {
                                                            ngWrapperEl.attr('id', attrId);
                                                            ngWrapperEl.addClass(attrPlugin);

                                                            // pass all "data-*" attributes into element
                                                            angular.forEach(cmp.data, function (val, key) {
                                                                if (angular.isString(key) && key.indexOf('data-') === 0)
                                                                {
                                                                    ngWrapperEl.attr(key, val);
                                                                }
                                                            });
                                                        }
                                                        if (ngMainEl.length)
                                                        {
                                                            if (!ngWrapperEl.length) {
                                                                ngMainEl.attr('id', attrId);
                                                                ngMainEl.addClass(attrPlugin);

                                                                // pass all "data-*" attributes into element
                                                                angular.forEach(cmp.data, function (val, key) {
                                                                    if (angular.isString(key) && key.indexOf('data-') === 0)
                                                                    {
                                                                        ngMainEl.attr(key, val);
                                                                    }
                                                                });
                                                            }
                                                            ngMainEl.addClass(attrClass);
                                                        }

                                                        compileTemplate(tmpTemplate.innerHTML, $scope, $element);
                                                    }
                                            );

                                }
                        );
            }
        }
    };
    return new Directive();
}
