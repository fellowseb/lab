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

function setCurrentNav(menuLinkID) {
    var $menunav = document.getElementById('menu-nav');
    var $menunavitem = $menunav.querySelector('a[id=' + menuLinkID + ']');
    var $menunavlinks = $menunav.querySelectorAll('.menu-nav-link');
    Array.prototype.forEach.call($menunavlinks, function removeActiveClass($menunavlink, i) {
        $menunavlink.classList.remove('menu-nav-link-current');
    });
    $menunavitem.classList.add('menu-nav-link-current');
}

/**
 * Handler called when a click on a nav item happens.
 *
 * @param {Event} event Click event
 */
function onNavItemClick(event) {
    closeMenu();
    if (window.scrollBy && event.target.tagName.toUpperCase() === 'A') {
        var hashPos = event.target.href.indexOf('#');
        if (hashPos >= 0) {
            event.preventDefault();
            var anchorID = event.target.href.substr(
                event.target.href.indexOf('#') + 1);
            var urlShardPos = window.location.href.lastIndexOf('#');
            if (urlShardPos) {
                window.history.pushState({
                    currentMenuLink: event.target.id
                },
                document.title,
                window.location.href.substr(0, urlShardPos) + '#' + anchorID);
            } else {
                window.history.pushState({
                    currentMenuLink: event.target.id
                },
                document.title,
                window.location.href + '#' + anchorID);
            }
            setCurrentNav(event.target.id);
            event.target.classList.add('menu-nav-link-current');
            var anchorElem = document.querySelectorAll('a[name=' + anchorID + ']')[0];
            window.scrollBy({
                top: anchorElem.offsetTop - window.pageYOffset,
                left: 0,
                behavior: 'smooth'
            });
        }
    }
    event.stopPropagation();
}

/**
 * Handler called when history changes
 */
function onPopState() {
    var currentState = window.history.state;
    if (currentState.currentMenuLink) {
        setCurrentNav(currentState.currentMenuLink);
    }
}

function findMenuNavLink(anchorName) {
    var menuNavLinks = document.querySelectorAll('a.menu-nav-link');
    return Array.prototype.find.call(menuNavLinks, function findNavElem($menuNavLink) {
        return $menuNavLink.href.substr($menuNavLink.href.lastIndexOf('#') + 1) === anchorName;
    });
}

function updateCurrentNav() {
    var $anchors = document.querySelectorAll('a.anchor');
    var mostVisiblePage = Array.prototype.map.call(
        $anchors,
        function mapToPageVisibleHeight($anchor, i, arr) {
            var pageBottom = i + 1 < arr.length
                ? arr[i + 1].offsetTop
                : document.documentElement.scrollHeight;
            var visibleBottom = Math.min(pageBottom, window.pageYOffset + window.innerHeight);
            var pageTop = $anchor.offsetTop;
            var visibleTop = Math.max(pageTop, window.pageYOffset);
            return {
                visiblePageHeight: visibleBottom - visibleTop,
                anchor: $anchor
            };
        }).sort(function sortPageVisibleHeight(lhs, rhs) {
        return lhs.visiblePageHeight < rhs.visiblePageHeight;
    })[0];
    if (mostVisiblePage && mostVisiblePage.anchor) {
        var menuNavElem = findMenuNavLink(mostVisiblePage.anchor.name);
        if (menuNavElem) {
            setCurrentNav(menuNavElem.id);
        }
    }
}

/**
 * Handler called when user scrolls
 */
function onScroll() {
    updateCurrentNav();
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
        Array.prototype.forEach.call($menunavlinks, function addListenerMenuLink($menunavlink, i) {
            $menunavlink.addEventListener('click', onNavItemClick);
        });
    }
    window.addEventListener('popstate', onPopState);
    window.addEventListener('scroll', onScroll);
    if (window.pageYOffset === 0) {
        updateCurrentNav();
    }
});
