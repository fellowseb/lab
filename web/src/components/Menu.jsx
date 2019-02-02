import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/es/compose';
import prop from 'ramda/es/prop';
import partial from 'ramda/es/partial';
import styled, { keyframes } from 'styled-components';

import domUtils from '../scripts/domutils';
import { media } from '../components/MediaQueries.jsx';
import { Ul } from '../components/BaseStyledComponents.jsx';

const MastHead = styled.header `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: sticky;
  top: 0;
  z-index: 99999999999;
  background: #333;
  border-bottom: 1px solid #c1b79a;
`

const MenuContainer = styled.div `
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Logo = styled.div `
  cursor: default;
  font-family: "alex_brushregular";
  font-size: 1.8em;
  ${media.medium `
      font-size: 2em;
  `}
  ${media.large `
      font-size: 2.2em;
  `}
  text-align: left;
  padding: 0 0.2em;
  color: #FEFEFE;
  display: inline-block; 
  margin-left: -1em;
`

const UmbrellaSVG = styled.svg `
  fill: #edc711;
  display: inline-block;  
  width: 1em;
  height: 1em;
  vertical-align: sub;
`

const Seb = styled.span `
  color: #edc712;
`

const MenuButton = styled.button `
  background: none;
  height: 3em;
  width: 3em;
  cursor: pointer;
  border: none;
  outline: none;
  margin-left: 0.5em;
  ${media.medium `
      visibility: hidden;
      width: 0;
      height: 0;
  `}
`

const MenuButtonSVG = styled.svg.attrs(props => ({
  visible: !!props.show ? 'visible' : 'hidden'
})) `
  fill: #c1b79a;
  visibility: ${props => props.visible};
  width: ${props => props.visible === 'visible' ? '100%' : '0'};
  height: ${props => props.visible === 'visible' ? '100%' : '0'};
  &:hover {
    fill: #5c5c5c;
    cursor: pointer;
  }
`

const slideFromLeft = keyframes `
  from {
    left: -100%;
  }
  to {
    left: 0;
  }
`

const Navigation = styled.nav.attrs(props => ({
  visible: !!props.open ? 'visible' : 'hidden',
  animationName: !!props.open ? slideFromLeft : ''
})) `
  z-index: 99999999999;
  position: fixed;
  top: 2.4em;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(51,51,51,0.95);
  visibility: hidden;
  padding-top: 5px;
  ${media.medium `
    float: right;
    position: unset;
    top: unset;
    bottom: unset;
    width: unset;
    visibility: visible;
    padding-top: 0;
  `}
  visibility: ${props => props.visible};
  animation-duration: 300ms;
  animation-name: ${props => props.animationName};
  animation-iteration-count: 1;
  animation-direction: normal;
`

const NavigationList = styled(Ul) `
  display: inline-flex;
  list-style: none;
  flex-direction: column;
  ${media.medium `
      flex-direction: row;
  `}
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
`

const NavigationListItem = styled.li `
  margin: 0;
  padding: 0;
`

const NavigationLink = styled.a.attrs(props => ({
  current: props.current || false
})) `
  text-decoration: none;
  margin: 0.25em;            
  padding: 0.25em 0.5em;
  color: ${props => props.current ? '#ddd' : '#c1b79a'};
  display: inline-block;
  width: 93%;
  box-sizing: border-box;            
  &:hover {
    text-decoration: underline;       
  }
`

const NavigationLinkGitHub = styled(NavigationLink) `
  background: none;
`

const NavigationLinkLinkedIn = NavigationLinkGitHub

const NavLinkSVG = styled.svg `
  fill: #edc711;
  width: 22px;
  height: 21px;
  &:hover {
    fill: #5c5c5c;
    cursor: pointer;
  }
`

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
    const changeMenuState = newMenuState => compose(
        partial(openMenu, [newMenuState]),
        domUtils.eventStopPropagation
    );
    const closeMenu = changeMenuState(false);
    const toggleMenu = changeMenuState(!menuIsOpen);
    const extractSection = compose(prop('section'), prop('dataset'));
    const onNavItemClick = compose(changeSection,
        extractSection,
        domUtils.eventCurrentTarget,
        domUtils.eventStopPropagation,
        domUtils.eventPreventDefault);
    const isCurrentSection = section => section === currentSection;
    return (
        <MastHead role="banner">
            <MenuButton onClick={toggleMenu}>
                <MenuButtonSVG show={!menuIsOpen}>
                    <use href="#menu" />
                </MenuButtonSVG>
                <MenuButtonSVG show={menuIsOpen}>
                    <use href="#menuclose" />
                </MenuButtonSVG>
            </MenuButton>
            <MenuContainer>
                <Logo>
                    <UmbrellaSVG><use href="#umbrella" /></UmbrellaSVG>fellow<Seb>seb</Seb>
                </Logo>
                <Navigation role="navigation" open={menuIsOpen}
                    onClick={closeMenu} onTouchMove={domUtils.eventPreventDefault}>
                    <NavigationList>
                        <NavigationListItemSection
                            label='About'
                            sectionAnchor='about'
                            isCurrent={isCurrentSection('about')}
                            onNavItemClick={onNavItemClick}
                            sectionNavLinkMounted={sectionNavLinkMounted} />
                        <NavigationListItemSection
                            label='Resources'
                            sectionAnchor='brainfuel'
                            isCurrent={isCurrentSection('brainfuel')}
                            onNavItemClick={onNavItemClick}
                            sectionNavLinkMounted={sectionNavLinkMounted} />
                        <NavigationListItemSection
                            label='Experiments'
                            sectionAnchor='labo'
                            isCurrent={isCurrentSection('labo')}
                            onNavItemClick={onNavItemClick}
                            sectionNavLinkMounted={sectionNavLinkMounted} />
                        <NavigationListItem>
                            <NavigationLinkGitHub
                                href="https://github.com/fellowseb"
                                target="_blank"
                                rel="noopener noreferrer">
                                <NavLinkSVG>
                                    <use href="#github" />
                                </NavLinkSVG>
                            </NavigationLinkGitHub>
                        </NavigationListItem>
                        <NavigationListItem>
                            <NavigationLinkLinkedIn href="https://www.linkedin.com/in/sebastienwauquier" target="_blank" rel="noopener noreferrer">
                                <NavLinkSVG>
                                    <use href="#linkedin" />
                                </NavLinkSVG>
                            </NavigationLinkLinkedIn>
                        </NavigationListItem>
                    </NavigationList>
                </Navigation>
            </MenuContainer>
        </MastHead>
    );
};

Menu.propTypes = {
    menuIsOpen: PropTypes.bool,
    openMenu: PropTypes.func,
    currentSection: PropTypes.string,
    changeSection: PropTypes.func,
    sectionNavLinkMounted: PropTypes.func
};

const NavigationListItemSection = ({ label = '[Missing label]',
    sectionAnchor = '',
    onNavItemClick = v => v,
    isCurrent = false,
    sectionNavLinkMounted = v => v }) => {
    const href = '#' + sectionAnchor;
    return (
        <NavigationListItem>
            <NavigationLink current={isCurrent} href={href} data-section={sectionAnchor}
              onClick={onNavItemClick} ref={partial(sectionNavLinkMounted, sectionAnchor)}>{label}</NavigationLink>
        </NavigationListItem>
    );
};

NavigationListItemSection.propTypes = {
    label: PropTypes.string,
    sectionAnchor: PropTypes.string,
    onNavItemClick: PropTypes.func,
    isCurrent: PropTypes.bool,
    sectionNavLinkMounted: PropTypes.func
};

module.exports = Menu;
