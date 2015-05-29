'use strict';
/*
 * console:
 * angular.element(document.body).injector().get('ManifestService')
 */
/** @ngInject */
function ManifestService($log, APIService, $rootScope/*, $timeout, $http, $q, $state,*/) {
    $log.debug('\nManifestService::Init\n');
    var Service = function () {
        var ROOT = this;
        var manifestInitialized = false;
        var data;
        var overrides;
        var componentIdx;
        var pageComponentIdx;
        ////////////////////////////////////////////////////////////////////////
        // if these are not defined by the route the manifest components will 
        // teach this service what the values should be
        ////////////////////////////////////////////////////////////////////////
        var lang;
        var pageId;
        var link;
        function getData() {
            return data;
        }
        function setData(d) {
            data = d;
        }
        function getOverrides() {
            return overrides;
        }
        function setOverrides(data) {
            overrides = data;
        }
        function getComponentIdx() {
            return componentIdx;
        }
        function setComponentIdx(cmpIdx) {
            componentIdx = cmpIdx;
        }
        ////////////////////////////////////////////////////////////////////////
        // Determines manifest idx of next component when recursing the manifest
        // first looks for sub-component
        // next looks for sibling
        // then it backs up to the parent and looks for sibling until it finds
        // one or gets back to the root
        ////////////////////////////////////////////////////////////////////////
        function getNextComponent() {
            var idx = getComponentIdx();
            var cmp = null;
            if (!idx) {
                idx = [0];
                cmp = ROOT.getComponent(idx);
            } else {
                ////////////////////////////////////////////////////////////////////////
                // get current Component and find next
                ////////////////////////////////////////////////////////////////////////
                cmp = ROOT.getComponent(idx);
                if (!!cmp.components && cmp.components.length > 0) {
                    // sub-components exist - go deeper
                    idx.push(0);
                    cmp = ROOT.getComponent(idx);
                } else {
                    // no children - try to find next sibling
                    var lastIdx = idx.pop();
                    idx.push(++lastIdx);
                    cmp = ROOT.getComponent(idx);
                    if (!cmp) {
                        // no sibling - find closest ancestor's sibling
                        var backup = true;
                        while (!cmp && backup) {
                            if (idx.length > 1) {
                                // try parent's sibling
                                idx.pop();
                                lastIdx = idx.pop();
                                idx.push(++lastIdx);
                                cmp = ROOT.getComponent(idx);
                            } else {
                                // back to root - done
                                backup = false;
                                idx = null;
                            }
                        }
                    }
                }
            }
            setComponentIdx(idx);
            if (!idx) {
                return null;
            }
            return cmp;
        }
        function deserializeIdx(idx) {
            if (angular.isArray(idx)) {
                // return a clone of the array (not the original)
                return idx.slice(0);
            }
            if (typeof (idx) === 'string') {
                // convert string rep of array to integer array
                idx = idx.replace(/[\[\]]/g, '');
                var arr = idx.split(',');
                // force array values to integer
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = +arr[i] || 0;  // default to 0 if NaN!?
                }
                return arr;
            }
            return [0];
        }
        function extendDeep(dst) {
            angular.forEach(
                    arguments,
                    function (obj) {
                        if (obj !== dst) {
                            angular.forEach(
                                    obj,
                                    function (value, key) {
                                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                                            extendDeep(dst[key], value);
                                        } else {
                                            dst[key] = value;
                                        }
                                    }
                            );
                        }
                    }
            );
            return dst;
        }
        ////////////////////////////////////////////////////////////////////////
        // Initializes the component for the manifest
        ////////////////////////////////////////////////////////////////////////
        function initializeComponent(cmp) {
            if (!cmp) {
                return;
            }
            if (!manifestInitialized) {
                ////////////////////////////////////////////////////////////////////////
                // first pass, check overrides and modify this component
                ////////////////////////////////////////////////////////////////////////
                var builderId = (cmp.data || {}).builderId;
                var newData = getOverrides()[ builderId ];
                if (!!builderId && !!newData) {
                    // TBD - improve data sanitization
                    if (angular.isString(newData)) {
                        newData = newData.replace(/\n/g, ' ');
                    }
                    // found override for this component!
                    $log.debug('ManifestService::initializeComponent: override builderId:', builderId, newData);
                    if (typeof (newData) === 'string') {
                        switch (newData) {
                            case 'delete':
                                // get current component's idx
                                var cmpIdx = getComponentIdx();
                                // get the idx for this component in context of its parent
                                var childIdx = cmpIdx.pop();
                                // get the parent component
                                var parentCmp = ROOT.getComponent(cmpIdx);
                                // and delete parent's sub component with index: childIdx
                                var thisChild = parentCmp.components.splice(childIdx, 1);
                                // parser's current idx is deleted component's parent
                                // if deleted component had a older sibling:
                                if (childIdx > 0) {
                                    // repoint to deleted component's older sibling
                                    cmpIdx.push(childIdx - 1);
                                    setComponentIdx(cmpIdx);
                                }
                                break;
                            default:
                                try {
                                    newData = angular.fromJson(newData);
                                } catch (e) {
                                    $log.debug('ManifestService::initializeComponent: override: did not know what to do with builderId:', builderId, newData, e);
                                }
                                break;
                        }
                    }
                    if (typeof (newData) === 'object') {
                        $log.debug('ManifestService::initializeComponent: override: extend:', cmp.data, newData);
                        extendDeep(cmp.data, newData);
                    }
                }
            }
            // will we ever re-index after manifest initialization!?
            // index component
            cmp.idx = getComponentIdx().slice(0);
            $log.debug('ManifestService::initializeComponent: initialized:', cmp.idx, cmp);
        }
        ////////////////////////////////////////////////////////////////////////
        // Gets the component from the manifest specified by the idx array if 
        // no idx is specified, use the service's idx
        ////////////////////////////////////////////////////////////////////////
        this.getComponent = function (idx) {
            var cmp;
            if (!idx) {
                // idx not specified, get next using services idx
                $log.debug('ManifestService::getComponent: getNextComponent');
                cmp = getNextComponent();
                // initialize the component
                initializeComponent(cmp);
            } else {
                idx = deserializeIdx(idx);
                setComponentIdx(idx);
                $log.debug('ManifestService::getComponent: find component:', idx);
                // traverse idx array to retrieve this particular cmp
                cmp = getData()[ idx[0] ];
                if (!!cmp) {
                    for (var j in idx) {
                        if (j > 0) {
                            var components = cmp.components;
                            if (!!components) {
                                cmp = components[ idx[j] ];
                                if (!cmp) {
                                    // child idx out of range
                                    return null;
                                }
                            } else {
                                // no children
                                return null;
                            }
                        }
                    }
                } else {
                    // root index out of range
                    return null;
                }
                $log.debug('ManifestService::getComponent: found:', idx, cmp);
            }
            return cmp;
        };
        /*
         * Searches for the first occurance of the specified component
         * @param {string} cmpType Component type to search for
         * @param {(string|int[])=} context Context in which to do the search
         * @returns {Component}
         */
        this.getFirst = function (cmpType, context) {
            if (!context) {
                context = [0];
            } else {
                context = deserializeIdx(context);
            }
            $log.debug('ManifestService::getFirst', cmpType, context);
            var cmp = ROOT.getComponent(context);
            while (!!cmp && cmp.type !== cmpType) {
                cmp = getNextComponent();
                // don't search out of context - exclude siblings & parents
                if (!!getComponentIdx() && (getComponentIdx().length < context.length || getComponentIdx()[ context.length - 1 ] !== context[ context.length - 1 ])) {
                    return null;
                }
            }
            return cmp;
        };
        /*
         * Searches for the first occurance of the specified component
         * @param {string} cmpType Component type to search for
         * @param {(string|int[])=} context Context in which to do the search
         * @returns {Component}
         */
        this.getNextIdx = function (cmpType, context) {
            if (!context) {
                context = [0];
            } else {
                context = deserializeIdx(context);
            }
            $log.debug('ManifestService::getFirst', cmpType, context);
            var cmp = ROOT.getComponent(context);
            while (!!cmp && cmp.type !== cmpType) {
                cmp = getNextComponent();
                // don't search out of context - exclude siblings & parents
                if (!!getComponentIdx() && (getComponentIdx().length < context.length || getComponentIdx()[ context.length - 1 ] !== context[ context.length - 1 ])) {
                    return null;
                }
            }
            return cmp;
        };
        /*
         * Searches for all occurances of the specified component
         * @param {string} cmpType Component type to search for
         * @param {(string|int[])=} context Context in which to do the search
         * @returns {Component[]}
         */
        this.getAll = function (cmpType, context) {
            $log.debug('ManifestService::getAll:initialContext', context);
            if (!context) {
                context = [0];
            } else {
                context = deserializeIdx(context);
            }
            var cmps = [];
            $log.debug('ManifestService::getAll', cmpType, context);
            var cmp = ROOT.getComponent(context);
            while (!!cmp) {
                $log.debug('ManifestService::getAll:match?', cmp.type, cmpType);
                if (cmp.type === cmpType) {
                    cmps.push(cmp);
                    $log.debug('ManifestService::getAll:match!', cmps);
                }
                cmp = getNextComponent();
                $log.debug('ManifestService::getAll:in context?', context, getComponentIdx());
                // don't search out of context - exclude siblings & parents
                if (!!getComponentIdx() &&
                        (getComponentIdx().length < context.length ||
                                getComponentIdx()[ context.length - 1 ] !== context[ context.length - 1 ])) {
                    return cmps;
                }
            }
            return cmps;
        };
        this.getLang = function () {
            return ROOT.lang;
        };
        this.setLang = function (lang) {
            ROOT.lang = lang;
        };
        this.getPageId = function () {
            return ROOT.pageId;
        };
        this.setPageId = function (pageId, componentIdx) {
            $log.debug('ManifestService, setPageId', pageId);
            // reset component index for reparsing new page
            if (ROOT.pageId === pageId) {
                return;
            }
            setComponentIdx(null);
            ROOT.pageComponentIdx = componentIdx;
            ROOT.pageId = pageId;
            $rootScope.$broadcast('npPageIdChanged', pageId);
        };
        /*
         * Gets the ID for the page after the page reference that's passed as a param
         * @param {string} cmpType Component type to search for
         */
        this.getNextPageId = function () {
            var nextPage,
                    nextPageComponentIdx,
                    i,
                    pageParentComponent,
                    pageParentComponentIdx,
                    thisPageId = ROOT.getPageId();
            $log.debug('ManifestService::getNextPageId', ROOT);
            if (!thisPageId) {
                $log.warn('ManifestService::getNextPageId | thisPage is not valid');
                return;
            }
            pageParentComponentIdx = ROOT.pageComponentIdx.slice(0); // copy the array stack here so we can mangle it
            // We need to start looking for the component after current page component
            i = parseInt(pageParentComponentIdx.pop(), 10); // pop this child off the array so we can have the parent
            i++; // let's always start with the index after ours
            //$log.debug('ManifestService::getNextPageId | for pageId, componentIdx', thisPageId, componentIdx);
            pageParentComponent = ROOT.getComponent(pageParentComponentIdx);
            for (/* initialized above*/; i < pageParentComponent.components.length; i++) {
                var component = pageParentComponent.components[i];
                $log.debug('ManifestService::getNextPageId | -- Evaluating component', component);
                if (component.type === 'npPage') {
                    //$log.debug('ManifestService::getNextPageId | --> found npPage');
                    if (component.data.id === thisPageId) {
                        //$log.debug('ManifestService::getNextPageId | --> ignoring thisPage');
                        continue;
                    }
                    nextPage = component.data.id;
                    nextPageComponentIdx = component.idx;
                    $log.debug('ManifestService::getNextPageId | --> found nextPage, nextPageComponentIdx', nextPage, nextPageComponentIdx);
                    break;
                }
            }
            return nextPage;
        };
        this.getNextPageIdx = function () {
            var thisPageId = ROOT.getPageId();
            var nextPage,
                    nextPageComponentIdx,
                    i,
                    pageParentComponent,
                    pageParentComponentIdx;
            ////////////////////////////////////////////////////////////////////////
            // copy the array stack here so we can mangle it
            ////////////////////////////////////////////////////////////////////////
            pageParentComponentIdx = ROOT.pageComponentIdx.slice(0);
            if (!thisPageId) {
                $log.warn('ManifestService::getNextPageIdx | thisPage is not valid');
                return;
            }
            // We need to start looking for the component after current page component
            i = parseInt(pageParentComponentIdx.pop(), 10); // pop this child off the array so we can have the parent
            i++; // let's always start with the index after ours
            //$log.debug('ManifestService::getNextPageIdx | for pageId, componentIdx', thisPageId, componentIdx);
            pageParentComponent = ROOT.getComponent(pageParentComponentIdx);
            for (/* initialized above*/; i < pageParentComponent.components.length; i++) {
                var component = pageParentComponent.components[i];
                $log.debug('ManifestService::getNextPageIdx | -- Evaluating component', component);
                if (component.type === 'npPage') {
                    //$log.debug('ManifestService::getNextPageIdx | --> found npPage');
                    if (component.data.id === thisPageId) {
                        //$log.debug('ManifestService::getNextPageIdx | --> ignoring thisPage');
                        continue;
                    }
                    nextPage = component.data.id;
                    nextPageComponentIdx = component.idx;
                    $log.debug('ManifestService::getNextPageIdx | --> found nextPage, nextPageComponentIdx', nextPage, nextPageComponentIdx);
                    break;
                }
            }
            return nextPageComponentIdx;
        };
        function goToFirstPage() {
            //$log.debug('ManifestService::goToFirstPage | begin');
            var firstPage = ROOT.getFirst('npPage');
            //$log.debug('ManifestService::goToFirstPage | found page', firstPage);
            ROOT.setPageId(firstPage.data.id, firstPage.idx);
        }
        ROOT.goToFirstPage = goToFirstPage;
        ROOT.goToNextPage = function (currentPageIDX) {
            var nextPage,
                    thisPageId = ROOT.getPageId(),
                    nextPageComponentIdx,
                    i,
                    pageParentComponent,
                    pageParentComponentIdx;
            ////////////////////////////////////////////////////////////////////////
            // if it is a string convert the string to an init filled array stack, 
            // if it's already an array pass as is so we can mangle it.
            ////////////////////////////////////////////////////////////////////////
            if (typeof currentPageIDX === 'string') {
                var currentPageIDXresult = currentPageIDX.substring(1, currentPageIDX.length - 1);
                ROOT.pageComponentIdx = currentPageIDXresult.split(',');
                var mapResult = ROOT.pageComponentIdx.map(function (x) {
                    return parseInt(x, 10);
                });
                pageParentComponentIdx = mapResult.slice(0);
            } else if (typeof currentPageIDX === 'array') {
                pageParentComponentIdx = currentPageIDX;
            }
//            console.log(
//                    '\n::::::::::::::::::::::::::::::::::::::goToNextPage:::::::::::::::::::::::::::::::::::::::::::::::::',
//                    '\n::ROOT.pageComponentIdx::', ROOT.pageComponentIdx,
//                    '\n::ROOT.pageComponentIdx::', ROOT.pageComponentIdx.length,
//                    '\n::typeof currentPageIDX::', typeof currentPageIDX,
//                    '\n::mapResult::', mapResult,
//                    '\n::pageParentComponentIdx::', pageParentComponentIdx,
//                    '\n::parseInt(pageParentComponentIdx.pop(), 10)::', parseInt(pageParentComponentIdx.pop(), 10),
//                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                    );
            if (!thisPageId) {
                $log.warn('ManifestService::goToNextPage | thisPage is not valid');
                return;
            }
            ////////////////////////////////////////////////////////////////////////
            // We need to start looking for the component after current page component
            // pop this child off the array so we can have the parent
            ////////////////////////////////////////////////////////////////////////
            i = parseInt(pageParentComponentIdx.pop(), 10);
            ////////////////////////////////////////////////////////////////////////
            // let's always start with the index after ours
            ////////////////////////////////////////////////////////////////////////
            i++;
            //$log.debug('ManifestService::goToNextPage | for pageId, componentIdx', thisPageId, componentIdx);
            pageParentComponent = ROOT.getComponent(pageParentComponentIdx);
            for (/* initialized above*/; i < pageParentComponent.components.length; i++) {
                var component = pageParentComponent.components[i];
                $log.debug('ManifestService::goToNextPage | -- Evaluating component', component);
                if (component.type === 'npPage') {
                    $log.debug('ManifestService::goToNextPage | --> found npPage');
                    if (component.data.id === thisPageId) {
                        $log.debug('ManifestService::goToNextPage | --> ignoring thisPage');
                        continue;
                    }
                    nextPage = component.data.id;
                    nextPageComponentIdx = component.idx;
//                    console.log(
//                            '\n::::::::::::::::::::::::::::::::::::::goToNextPage======npPage:::::::::::::::::::::::::::::::::::::::::::::::::',
//                            '\n::i::', i,
//                            '\n::component::', component,
//                            '\n::component.data::', component['data'],
//                            '\n::component.data.id::', component.data.id,
//                            '\n::component.data.last::', component.data.last,
//                            '\n::nextPage::', nextPage,
//                            '\n::nextPageComponentIdx::', nextPageComponentIdx,
//                            '\n::!!nextPageComponentIdx::', !!nextPageComponentIdx,
//                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                            );
                    $log.debug('ManifestService::goToNextPage | --> found nextPage, nextPageComponentIdx', nextPage, nextPageComponentIdx);
                    break;
                }
            }
            if (!!nextPageComponentIdx) {
                $log.debug('ManifestService::goToNextPage | sending client to nextPage', nextPage);
                ROOT.setPageId(nextPage, nextPageComponentIdx);
                return true;
            }
            $log.debug('ManifestService::goToNextPage | no valid next page found, returning false');
            return false;
        };
        ROOT.goToPreviousPage = function (currentPageIDX) {
            var previousPage,
                    thisPageId = ROOT.getPageId(),
                    previousPageComponentIdx,
                    i,
                    pageParentComponent,
                    pageParentComponentIdx;
            ////////////////////////////////////////////////////////////////////////
            // If it is a string convert the string to an init filled array stack, 
            // if it's already an array pass as is so we can mangle it. 
            ////////////////////////////////////////////////////////////////////////
            if (typeof currentPageIDX === 'string') {
                var currentPageIDXresult = currentPageIDX.substring(1, currentPageIDX.length - 1);
                ROOT.pageComponentIdx = currentPageIDXresult.split(',');
                var mapResult = ROOT.pageComponentIdx.map(function (x) {
                    return parseInt(x, 10);
                });
                pageParentComponentIdx = mapResult.slice(0);
            } else if (typeof currentPageIDX === 'array') {
                pageParentComponentIdx = currentPageIDX;
            }
            console.log(
                    '\n::::::::::::::::::::::::::::::::::::::goToPreviousPage:::::::::::::::::::::::::::::::::::::::::::::::::',
                    '\n::ROOT.pageComponentIdx::', ROOT.pageComponentIdx,
                    '\n::ROOT.pageComponentIdx::', ROOT.pageComponentIdx.length,
                    '\n::typeof currentPageIDX::', typeof currentPageIDX,
                    '\n::mapResult::', mapResult,
                    '\n::pageParentComponentIdx::', pageParentComponentIdx,
                    '\n::parseInt(pageParentComponentIdx.pop(), 10)::', parseInt(pageParentComponentIdx.pop(), 10),
                    '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
                    );
            if (!thisPageId) {
                $log.warn('ManifestService::goToPreviousPage | thisPage is not valid');
                return;
            }
            ////////////////////////////////////////////////////////////////////////
            // We need to start looking for the component after current page component
            // pop this child off the array so we can have the parent
            ////////////////////////////////////////////////////////////////////////
            i = parseInt(pageParentComponentIdx.pop(), 10);
            ////////////////////////////////////////////////////////////////////////
            // let's always start with the index after ours
            ////////////////////////////////////////////////////////////////////////
            i++;
            //$log.debug('ManifestService::goToPreviousPage | for pageId, componentIdx', thisPageId, componentIdx);
            pageParentComponent = ROOT.getComponent(pageParentComponentIdx);
            for (/* initialized above*/; i < pageParentComponent.components.length; i++) {
                var component = pageParentComponent.components[i];
                $log.debug('ManifestService::goToPreviousPage | -- Evaluating component', component);
                if (component.type === 'npPage') {
                    $log.debug('ManifestService::goToPreviousPage | --> found npPage');
                    if (component.data.id === thisPageId) {
                        $log.debug('ManifestService::goToPreviousPage | --> ignoring thisPage');
                        continue;
                    }
                    previousPage = component.data.id;
                    previousPageComponentIdx = component.idx;
//                    console.log(
//                            '\n::::::::::::::::::::::::::::::::::::::goToPreviousPage======npPage:::::::::::::::::::::::::::::::::::::::::::::::::',
//                            '\n::i::', i,
//                            '\n::component::', component,
//                            '\n::component.data::', component['data'],
//                            '\n::component.data.id::', component.data.id,
//                            '\n::component.data.last::', component.data.last,
//                            '\n::previousPage::', previousPage,
//                            '\n::previousPageComponentIdx::', previousPageComponentIdx,
//                            '\n::!!previousPageComponentIdx::', !!previousPageComponentIdx,
//                            '\n::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::'
//                            );
                    $log.debug('ManifestService::goToPreviousPage | --> found previousPage, previousPageComponentIdx', previousPage, previousPageComponentIdx);
                    break;
                }
            }
            if (!!previousPageComponentIdx) {
                $log.debug('ManifestService::goToPreviousPage | sending client to previousPage', previousPage);
                ROOT.setPageId(previousPage, previousPageComponentIdx);
                return true;
            }
            $log.debug('ManifestService::goToPreviousPage | no valid next page found, returning false');
            return false;
        };
        this.initialize = function (data, overrides) {
            $log.debug('ManifestService::initialize:', data, overrides);
            setData(data);
            setOverrides(overrides[0]);
            manifestInitialized = false;
            // index all components
            setComponentIdx(null);
            var cmp = ROOT.getComponent();
            $log.debug('ManifestService::initialize:initialParse', cmp);
            while (!!cmp) {
                cmp = ROOT.getComponent();
            }
            manifestInitialized = true;
            $log.debug('ManifestService::initialize:manifest data:', getData());
        };
    };
    return new Service();
}