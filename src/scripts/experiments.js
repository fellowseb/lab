'use strict';

function onExperimentHeaderClick(event) {
    var headerElem = event.currentTarget;
    var isCollapsed = headerElem.classList.contains('experiment-header-collapsed');
    var containerElem = headerElem.parentElement;
    var bodyElem = containerElem.getElementsByClassName('experiment-body')[0];
    var classToAddSuffix = isCollapsed
        ? '-uncollapsed'
        : '-collapsed';
    var classToRemoveSuffix = isCollapsed
        ? '-collapsed'
        : '-uncollapsed';
    bodyElem.classList.add('experiment-body' + classToAddSuffix);
    bodyElem.classList.remove('experiment-body' + classToRemoveSuffix);
    headerElem.classList.add('experiment-header' + classToAddSuffix);
    headerElem.classList.remove('experiment-header' + classToRemoveSuffix);
}

/**
 * IIFE fired when DOM content is fully loaded.
 *
 * @param {Function} fn Handler to execute when DOM is ready.
 */
(function ready(fn) {
    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
})(function onDOMReady() {
    // Listen to clicks on experiment headers
    var experimentHeaders = document.getElementsByClassName('experiment-header');
    Array.prototype.forEach.call(experimentHeaders, function addExperimentHeaderListener(headerElem, i) {
        headerElem.addEventListener('click', onExperimentHeaderClick);
    });
});
