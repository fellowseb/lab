import React, { useCallback, useEffect, useState } from "react";
import partial from "ramda/es/partial";
import styled, { createGlobalStyle } from "styled-components";

import Menu from "../components/Menu.tsx";
import AboutPage from "../components/AboutPage.tsx";
// import ResourcesPage from "../components/ResourcesPage.tsx";
import LabPage from "../components/LabPage.tsx";
import { media } from "../components/MediaQueries.tsx";
import type { AppSection } from "./types.ts";
import Page from "./Page.tsx";

const GlobalStyles = createGlobalStyle`
  @font-face {
      font-family: 'alex_brushregular';
      src: url('/fonts/alexbrush-regular.woff2?#iefix') format('woff2'),
           url('/fonts/alexbrush-regular.woff') format('woff'),
           url('/fonts/alexbrush-regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
  }

  body {
    margin: 0
  }
`;

const PageAnchor = styled.a`
  position: relative;
  top: -2.4em;
  ${media.medium`
        top: -2.8em;
    `}
  ${media.large`
        top: -3em;
    `}
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledApp = styled.div`
  font-family: "Lato", arial, sans-serif;
  background: #dbd0b0;
  color: #333333;
  margin: 0;
  font-feature-settings: "kern" 1;
  font-kerning: normal;
  font-size: 18px;
  ${media.large`
        font-size: 21px;
    `}
`;

interface AppState {
  menuIsOpen: boolean;
  currentSection: AppSection;
  filteredTag?: string;
  sectionAnchors: Partial<Record<AppSection, HTMLElement>>;
  sectionLinks: Partial<Record<AppSection, HTMLElement>>;
}

interface SectionAnchorData {
  visiblePageHeight: number;
  anchor: HTMLElement;
  section: AppSection;
}

/**
 * Main component.
 * Is composed of a menu and three main sections:
 * About, Resources and Lab.
 * Keeps track of the current section.
 * State:
 * - menuIsOpen {bool}
 * - currentSection {string}
 * - filteredTag {string}
 */
const App = () => {
  const [state, setState] = useState<AppState>({
    menuIsOpen: false,
    currentSection: "about",
    sectionAnchors: {},
    sectionLinks: {},
  });
  const sectionAnchorMounted = useCallback(
    (section: AppSection, elem: HTMLElement | null) => {
      if (elem) {
        state.sectionAnchors[section] = elem;
      }
    },
    [state.sectionAnchors],
  );
  const sectionAnchorMountedAbout = partial(sectionAnchorMounted, ["about"]);
  const sectionAnchorMountedBrainfuel = partial(sectionAnchorMounted, [
    "brainfuel",
  ]);
  const sectionAnchorMountedLabo = partial(sectionAnchorMounted, ["labo"]);
  const sectionNavLinkMounted = useCallback(
    (section: AppSection, elem: HTMLElement | null) => {
      if (elem) {
        state.sectionLinks[section] = elem;
      }
    },
    [state.sectionLinks],
  );
  // const filterEntries = useCallback((tag: string) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     filteredTag: tag,
  //   }));
  // }, []);
  const openMenu = useCallback(
    (open: boolean) => {
      setState({
        ...state,
        menuIsOpen: !!open,
      });
    },
    [state, setState],
  );
  const changeSection = useCallback(
    (newSection: AppSection) => {
      const anchorData = state.sectionAnchors[newSection];
      if (!anchorData) {
        return;
      }
      setState({
        ...state,
        currentSection: newSection,
      });
      pushWindowState(newSection);
      scrollTo(anchorData);
      openMenu(false);
    },
    [state, openMenu],
  );

  useEffect(() => {
    const updateCurrentSection = () => {
      const sectionArr = Object.keys(state.sectionAnchors) as AppSection[];
      const sortedAnchorsData = sectionArr
        .map((section: AppSection, i: number) => {
          const anchorElem = state.sectionAnchors[section];
          if (!anchorElem) return undefined;
          const pageBottom =
            i + 1 < sectionArr.length
              ? (state.sectionAnchors[sectionArr[i + 1]]?.offsetTop ??
                document.documentElement.scrollHeight)
              : document.documentElement.scrollHeight;
          const visibleBottom = Math.min(
            pageBottom,
            window.pageYOffset + window.innerHeight,
          );
          const pageTop = anchorElem.offsetTop;
          const visibleTop = Math.max(pageTop, window.pageYOffset);
          return {
            visiblePageHeight: Math.max(0, visibleBottom - visibleTop),
            anchor: anchorElem,
            section: section,
          };
        })
        .filter((anchorData): anchorData is SectionAnchorData =>
          Boolean(anchorData),
        )
        .sort(
          (lhs: SectionAnchorData, rhs: SectionAnchorData) =>
            rhs.visiblePageHeight - lhs.visiblePageHeight,
        );
      const mostVisiblePage: SectionAnchorData = sortedAnchorsData[0];
      if (
        mostVisiblePage &&
        mostVisiblePage.section &&
        state.currentSection !== mostVisiblePage.section
      ) {
        setState({
          ...state,
          currentSection: mostVisiblePage.section,
        });
      }
    };
    const onWindowResize = () => openMenu(false);
    window.addEventListener("resize", onWindowResize);
    const onPopState = () => {
      const currentState = window.history.state;
      if (currentState.currentSection) {
        setState({
          ...state,
          currentSection: currentState.currentSection,
        });
      }
    };
    window.addEventListener("popstate", onPopState);
    const onScroll = () => updateCurrentSection();
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    if (window.pageYOffset === 0) {
      updateCurrentSection();
    }
  }, [state, openMenu]);
  const { menuIsOpen, currentSection } = state;
  return (
    <React.StrictMode>
      <StyledApp>
        <GlobalStyles />
        <Menu
          menuIsOpen={menuIsOpen}
          openMenu={openMenu}
          currentSection={currentSection}
          changeSection={changeSection}
          sectionNavLinkMounted={sectionNavLinkMounted}
        />
        <Main role="main">
          <PageAnchor id="labo" ref={sectionAnchorMountedLabo}></PageAnchor>
          <LabPage></LabPage>
          <PageAnchor
            id="brainfuel"
            ref={sectionAnchorMountedBrainfuel}
          ></PageAnchor>
          <Page id="page-brainfuel" title="Tech Watch">
            Back soon
          </Page>
          {
            // <ResourcesPage
            //   apiUrl={apiUrl}
            //   filterEntries={filterEntries}
            //   filteredTag={filteredTag}
            // />
          }
          <PageAnchor id="about" ref={sectionAnchorMountedAbout}></PageAnchor>
          <AboutPage></AboutPage>
        </Main>
      </StyledApp>
    </React.StrictMode>
  );
};

const pushWindowState = (section: AppSection) => {
  const urlShardPos = window.location.href.lastIndexOf("#");
  if (urlShardPos) {
    window.history.pushState(
      {
        currentSection: section,
      },
      document.title,
      window.location.href.substr(0, urlShardPos) + "#" + section,
    );
  } else {
    window.history.pushState(
      {
        currentMenuLink: section,
      },
      document.title,
      window.location.href + "#" + section,
    );
  }
};

const scrollTo = (elem: HTMLElement) => {
  window.scrollBy({
    top: elem.offsetTop - window.pageYOffset,
    left: 0,
    behavior: "smooth",
  });
};

export default App;
