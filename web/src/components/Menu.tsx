import type { SyntheticEvent } from "react";
import compose from "ramda/es/compose";
import prop from "ramda/es/prop";
import partial from "ramda/es/partial";
import styled, { css, keyframes } from "styled-components";

import domUtils from "../scripts/domutils.ts";
import { media } from "../components/MediaQueries.tsx";
import { Ul } from "../components/BaseStyledComponents.tsx";
import type { AppSection } from "./types.ts";
import GitHubSvg from "/src/assets/images/svg/github.svg";
import LinkedInSvg from "/src/assets/images/svg/linkedin.svg";
import UmbrellaSVG from "/src/assets/images/svg/umbrella.svg";

const MastHead = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: sticky;
  top: 0;
  z-index: 99999999999;
  background: #333;
  border-bottom: 1px solid #c1b79a;
`;

const MenuContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.div`
  cursor: default;
  font-family: "alex_brushregular";
  font-size: 1.8em;
  ${media.medium`
      font-size: 2em;
  `}
  ${media.large`
      font-size: 2.2em;
  `}
  text-align: left;
  padding: 0 0.2em;
  color: #fefefe;
  display: inline-block;
  margin-left: -1em;
`;

const StyledUmbrellaSVG = styled(UmbrellaSVG)`
  fill: #edc711;
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: sub;
`;

const Seb = styled.span`
  color: #edc712;
`;

const MenuButton = styled.button`
  background: none;
  height: 3em;
  width: 3em;
  cursor: pointer;
  border: none;
  outline: none;
  margin-left: 0.5em;
  ${media.medium`
      visibility: hidden;
      width: 0;
      height: 0;
  `}
`;

const MenuButtonSVG = styled.svg.attrs<{
  $show: boolean;
}>((props) => ({
  visibility: props.$show ? "visible" : "hidden",
}))`
  fill: #c1b79a;
  width: ${(props) => (props.$show ? "100%" : "0")};
  height: ${(props) => (props.$show ? "100%" : "0")};
  &:hover {
    fill: #5c5c5c;
    cursor: pointer;
  }
`;

const slideFromLeft = keyframes`
  from {
    left: -100%;
  }
  to {
    left: 0;
  }
`;

const Navigation = styled.nav<{
  $open: boolean;
}>`
  z-index: 99999999999;
  position: fixed;
  top: 2.4em;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(51, 51, 51, 0.95);
  visibility: hidden;
  padding-top: 5px;
  ${media.medium`
    float: right;
    position: unset;
    top: unset;
    bottom: unset;
    width: unset;
    visibility: visible;
    padding-top: 0;
  `}
  visibility: ${(props) => (props.$open ? "visible" : "hidden")};
  animation-name: ${(props) => (props.$open ? slideFromLeft : "")};
  animation-duration: 300ms;
  animation-iteration-count: 1;
  animation-direction: normal;
`;

const NavigationList = styled(Ul)`
  display: inline-flex;
  list-style: none;
  flex-direction: column;
  ${media.medium`
      flex-direction: row;
  `}
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
`;

const NavigationListItem = styled.li`
  margin: 0;
  padding: 0;
`;

const NavigationLink = styled.a.attrs<{
  $current: boolean;
}>((props) => ({
  $current: props.$current || false,
}))`
  text-decoration: none;
  margin: 0.25em;
  padding: 0.25em 0.5em;
  color: ${(props) => (props.$current ? "#ddd" : "#c1b79a")};
  display: inline-block;
  width: 93%;
  box-sizing: border-box;
  &:hover {
    text-decoration: underline;
  }
`;

const NavigationLinkGitHub = styled(NavigationLink)`
  background: none;
`;

const NavigationLinkLinkedIn = NavigationLinkGitHub;

const NavLinkSVGCss = css`
  fill: #edc711;
  width: 22px;
  height: 21px;
  &:hover {
    fill: #5c5c5c;
    cursor: pointer;
  }
`;

const StyledGitHubSvg = styled(GitHubSvg)`
  ${NavLinkSVGCss}
`;

const StyledLinkedInSvg = styled(LinkedInSvg)`
  ${NavLinkSVGCss}
`;

interface MenuProps {
  menuIsOpen: boolean;
  openMenu: (isOpen: boolean) => void;
  currentSection: string;
  changeSection: (newSection: AppSection) => void;
  sectionNavLinkMounted: (
    section: AppSection,
    elem: HTMLElement | null,
  ) => void;
}

const APP_SECTIONS: AppSection[] = ["about", "brainfuel", "labo"];

/**
 * Presentational component displaying the top menu.
 * Becomes a closable overlay when viewing mobile version.
 * @param {object} props Properties.
 */
const Menu = ({
  menuIsOpen = false,
  openMenu = () => {},
  currentSection = "about",
  changeSection = (newSection: AppSection) => newSection,
  sectionNavLinkMounted = () => {},
}: MenuProps) => {
  const changeMenuState = (newMenuState: boolean) =>
    compose(partial(openMenu, [newMenuState]), domUtils.eventStopPropagation);
  const closeMenu = changeMenuState(false);
  const toggleMenu = changeMenuState(!menuIsOpen);
  const checkSection = (maybeSection: unknown): AppSection => {
    if (typeof maybeSection !== "string") {
      throw new Error("Invalid app section type: " + typeof maybeSection);
    }
    if (!APP_SECTIONS.includes(maybeSection as AppSection)) {
      throw new Error("Invalid app section: " + maybeSection);
    }
    return maybeSection as AppSection;
  };
  const extractSection = (data: { section?: string }): unknown =>
    prop("section")(data);
  const extractDataSet = (
    obj: EventTarget & HTMLElement,
  ): { section?: string } => prop("dataset")(obj);
  const onNavItemClick = compose(
    changeSection,
    checkSection,
    extractSection,
    extractDataSet,
    domUtils.eventCurrentTarget,
    domUtils.eventStopPropagation,
    domUtils.eventPreventDefault,
  );
  const isCurrentSection = (section: AppSection) => section === currentSection;
  return (
    <MastHead role="banner">
      <MenuButton onClick={toggleMenu}>
        <MenuButtonSVG $show={!menuIsOpen}>
          <use href="#menu" />
        </MenuButtonSVG>
        <MenuButtonSVG $show={menuIsOpen}>
          <use href="#menuclose" />
        </MenuButtonSVG>
      </MenuButton>
      <MenuContainer>
        <Logo>
          <StyledUmbrellaSVG />
          fellow<Seb>seb</Seb>
        </Logo>
        <Navigation
          role="navigation"
          $open={menuIsOpen}
          onClick={closeMenu}
          onTouchMove={domUtils.eventPreventDefault}
        >
          <NavigationList>
            <NavigationListItemSection
              label="About"
              sectionAnchor="about"
              isCurrent={isCurrentSection("about")}
              onNavItemClick={onNavItemClick}
              sectionNavLinkMounted={sectionNavLinkMounted}
            />
            <NavigationListItemSection
              label="Resources"
              sectionAnchor="brainfuel"
              isCurrent={isCurrentSection("brainfuel")}
              onNavItemClick={onNavItemClick}
              sectionNavLinkMounted={sectionNavLinkMounted}
            />
            <NavigationListItemSection
              label="Experiments"
              sectionAnchor="labo"
              isCurrent={isCurrentSection("labo")}
              onNavItemClick={onNavItemClick}
              sectionNavLinkMounted={sectionNavLinkMounted}
            />
            <NavigationListItem>
              <NavigationLinkGitHub
                $current={false}
                href="https://github.com/fellowseb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledGitHubSvg />
              </NavigationLinkGitHub>
            </NavigationListItem>
            <NavigationListItem>
              <NavigationLinkLinkedIn
                $current={false}
                href="https://www.linkedin.com/in/swauquier"
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledLinkedInSvg />
              </NavigationLinkLinkedIn>
            </NavigationListItem>
          </NavigationList>
        </Navigation>
      </MenuContainer>
    </MastHead>
  );
};

interface NavigationListItemSectionProps {
  label: string;
  sectionAnchor: AppSection;
  onNavItemClick: (target: SyntheticEvent<HTMLElement>) => void;
  isCurrent: boolean;
  sectionNavLinkMounted: (
    section: AppSection,
    elem: HTMLElement | null,
  ) => void;
}

const NavigationListItemSection = ({
  label = "[Missing label]",
  sectionAnchor = "about",
  onNavItemClick,
  isCurrent = false,
  sectionNavLinkMounted = () => {},
}: NavigationListItemSectionProps) => {
  const href = "#" + sectionAnchor;
  return (
    <NavigationListItem>
      <NavigationLink
        $current={isCurrent}
        href={href}
        data-section={sectionAnchor}
        onClick={onNavItemClick}
        ref={partial(sectionNavLinkMounted, [sectionAnchor])}
      >
        {label}
      </NavigationLink>
    </NavigationListItem>
  );
};

export default Menu;
