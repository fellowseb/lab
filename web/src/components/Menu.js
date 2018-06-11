import React from 'react';
import domUtils from '../scripts/domutils';
import PropTypes from 'prop-types';
import * as R from 'ramda';

/**
 * Presentational component displaying the top menu.
 * Becomes a closable overlay when viewing mobile version.
 * @param {object} props Properties.
 */
const Menu = ({ menuIsOpen = false,
    openMenu = v => v,
    currentSection = '',
    changeSection = v => v,
    sectionNavLinkMounted = v => v }) => {
    const menuBtnClasses = menuIsOpen
        ? 'menu-button menu-button-open'
        : 'menu-button';
    const menuNavClasses = menuIsOpen ? 'open' : null;
    const changeMenuState = newMenuState => R.compose(
        R.partial(openMenu, [newMenuState]),
        domUtils.eventStopPropagation
    );
    const closeMenu = changeMenuState(false);
    const toggleMenu = changeMenuState(!menuIsOpen);
    const extractSection = R.compose(R.prop('section'), R.prop('dataset'));
    const onNavItemClick = R.compose(changeSection,
        extractSection,
        domUtils.eventCurrentTarget,
        domUtils.eventStopPropagation,
        domUtils.eventPreventDefault);
    const isCurrentSection = section => section === currentSection;
    return (
        <header className="masthead" role="banner">
            <button id="menu-button" className={menuBtnClasses} onClick={toggleMenu}>
                <svg id="menu-button-svg-open" className="icon-menubtn">
                    <use href="#menu" />
                </svg>
                <svg id="menu-button-svg-close" className="icon-menubtn">
                    <use href="#menuclose" />
                </svg>
            </button>
            <div className="menu-container">
                <div className="logo">
                    <svg id="logo-umbrella" className="icon-logo">
                        <use href="#umbrella" />
                    </svg>fellow<span className="seb">seb</span>
                </div>
                <nav id="menu-nav" role="navigation" className={menuNavClasses}
                    onClick={closeMenu} onTouchMove={domUtils.eventPreventDefault}>
                    <ul>
                        <NavLink
                            label='About'
                            sectionAnchor='about'
                            isCurrent={isCurrentSection('about')}
                            onNavItemClick={onNavItemClick}
                            sectionNavLinkMounted={sectionNavLinkMounted} />
                        <NavLink
                            label='Resources'
                            sectionAnchor='brainfuel'
                            isCurrent={isCurrentSection('brainfuel')}
                            onNavItemClick={onNavItemClick}
                            sectionNavLinkMounted={sectionNavLinkMounted} />
                        <NavLink
                            label='Experiments'
                            sectionAnchor='labo'
                            isCurrent={isCurrentSection('labo')}
                            onNavItemClick={onNavItemClick}
                            sectionNavLinkMounted={sectionNavLinkMounted} />
                        <li>
                            <a href="https://github.com/fellowseb" target="_blank" rel="noopener noreferrer"
                                className="menu-nav-link menu-nav-link-github">
                                <svg className="icon-links">
                                    <use href="#github" />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.linkedin.com/in/sebastienwauquier" target="_blank"
                                rel="noopener noreferrer" className="menu-nav-link menu-nav-link-linkedin">
                                <svg className="icon-links">
                                    <use href="#linkedin" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

Menu.propTypes = {
    menuIsOpen: PropTypes.bool,
    openMenu: PropTypes.func,
    currentSection: PropTypes.string,
    changeSection: PropTypes.func,
    sectionNavLinkMounted: PropTypes.func
};

const NavLink = ({ label = '[Missing label]',
    sectionAnchor = '',
    onNavItemClick = v => v,
    isCurrent = false,
    sectionNavLinkMounted = v => v }) => {
    const classes = 'menu-nav-link'.concat(isCurrent ? ' menu-nav-link-current' : '');
    const href = '#' + sectionAnchor;
    return (
        <li>
            <a href={href} data-section={sectionAnchor} className={classes}
                onClick={onNavItemClick} ref={R.partial(sectionNavLinkMounted, sectionAnchor)}>{label}</a>
        </li>
    );
};

NavLink.propTypes = {
    label: PropTypes.string,
    sectionAnchor: PropTypes.string,
    onNavItemClick: PropTypes.func,
    isCurrent: PropTypes.bool,
    sectionNavLinkMounted: PropTypes.func
};

module.exports = Menu;
