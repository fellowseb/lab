'use strict';

//
// Event handlers.
//

/**
 * Hide navigation menu, reset menu button.
 */
function closeMenu() {
    var $menuNav = document.getElementById('menu-nav');
    if ($menuNav) {
        var $menuBtn = document.getElementById('menu-button');
        if ($menuNav.classList.contains('open')) {
            $menuNav.classList.remove('open');
            if ($menuBtn) {
                $menuBtn.classList.remove('menu-button-open');
            }
        }
    }
}

/**
 * Toggle navigation menu visibility and menu button.
 */
function toggleMenu() {
    var $menuNav = document.getElementById('menu-nav');
    if ($menuNav) {
        var $menuBtn = document.getElementById('menu-button');
        if ($menuNav.classList.contains('open')) {
            $menuNav.classList.remove('open');
            if ($menuBtn) {
                $menuBtn.classList.remove('menu-button-open');
            }
        } else {
            $menuNav.classList.add('open');
            if ($menuBtn) {
                $menuBtn.classList.add('menu-button-open');
            }
        }
    }
}

/**
 * Handler called when the window is resized.
 */
function onWindowResize() {
    closeMenu();
}

/**
 * Handler called when a click on menu-button happens.
 *
 * @param {Event} event Click event
 */
function onMenuBtnClick(event) {
    toggleMenu();
    event.stopPropagation();
}

/**
 * Handler called when a click on a nav item happens.
 *
 * @param {Event} event Click event
 */
function onNavItemClick(event) {
    closeMenu();
    event.stopPropagation();
}

/**
 * Handler called when a click on the nav background happens.
 *
 * @param {Event} event Click event
 */
function onNavBgdClick(event) {
    closeMenu();
    event.stopPropagation();
}

/**
 * Handler called when a TouchEvent on the nav background happens.
 *
 * @param {TouchEvent} event TouchEvent event
 */
function onNavBgdTouchMove(event) {
    event.preventDefault();
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
    // Listen to menu button click
    var $menubtn = document.getElementById('menu-button');
    if ($menubtn) {
        $menubtn.addEventListener('click', onMenuBtnClick);
    }
    window.addEventListener('resize', onWindowResize);
    // Listen to nav items links click
    var $menunav = document.getElementById('menu-nav');
    if ($menunav) {
        $menunav.addEventListener('click', onNavBgdClick);
        $menunav.addEventListener('touchmove', onNavBgdTouchMove, false);
        var $menunavlinks = $menunav.querySelectorAll('.menu-nav-link');
        Array.prototype.forEach.call($menunavlinks, function($menunavlink, i) {
            $menunavlink.addEventListener('click', onNavItemClick);
        });
    }
});
