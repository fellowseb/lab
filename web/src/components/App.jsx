import React from 'react';
import Menu from '../components/Menu.jsx';
import PropTypes from 'prop-types';
import partial from 'ramda/es/partial';
import styled, { createGlobalStyle } from 'styled-components';
import AboutPage from '../components/AboutPage.jsx';
import ResourcesPage from '../components/ResourcesPage.jsx';
import LabPage from '../components/LabPage.jsx';
import { media } from '../components/MediaQueries.jsx';

const GlobalStyles = createGlobalStyle `
  @font-face {
      font-family: 'alex_brushregular';
      src: url('../fonts/alexbrush-regular.woff2?#iefix') format('woff2'),
           url('../fonts/alexbrush-regular.woff') format('woff'),
           url('../fonts/alexbrush-regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
  }

  #svg-sprites-symbols {
      display: none;
  }

  body {
    margin: 0
  }
`

const PageAnchor = styled.a `
    position: relative;
    top: -2.4em;
    ${media.medium `
        top: -2.8em;
    `}
    ${media.large `
        top: -3em;
    `}
`

const Main = styled.main`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`

const StyledApp = styled.div `
    font-family: "Lato", arial, sans-serif;
    background: #dbd0b0;
    color: #333333;
    margin: 0;
    font-feature-settings: "kern" 1;
    font-kerning: normal;
    font-size: 18px;
    ${media.large `
        font-size: 21px;
    `}
`

/**
 * Main component.
 * Is composed of a menu and three main sections:
 * About, Resources and Lab.
 * Keeps track of the current section.
 * State:
 * - menuIsOpen {bool}
 * - currentSection {string}
 * - filteredTag {string}
 * @extends React.PureComponent
 */
class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            currentSection: 'about',
            filteredTag: null,
        };
        this.sectionAnchors = {};
        this.sectionLinks = {};
        //
        // Private callbacks
        //
        this.sectionAnchorMounted = (section, elem) => {
            this.sectionAnchors[section] = elem;
        };
        this.sectionAnchorMountedAbout = partial(this.sectionAnchorMounted, ['about']);
        this.sectionAnchorMountedBrainfuel = partial(this.sectionAnchorMounted, ['brainfuel']);
        this.sectionAnchorMountedLabo = partial(this.sectionAnchorMounted, ['labo']);
        this.sectionNavLinkMounted = (section, elem) => {
            this.sectionLinks[section] = elem;
        };
        this.filterEntries = tag => {
            this.setState({
                filteredTag: tag
            });
        };
        this.openMenu = open => {
            this.setState({
                menuIsOpen: !!open
            });
        };
        this.changeSection = newSection => {
            this.setState({
                currentSection: newSection
            });
            pushWindowState(newSection);
            scrollTo(this.sectionAnchors[newSection]);
        };
    }
    componentDidMount() {
        const onWindowResize = () => this.openMenu(false);
        window.addEventListener('resize', onWindowResize);
        const onPopState = () => {
            var currentState = window.history.state;
            if (currentState.currentSection) {
                this.setState({
                    currentSection: currentState.currentSection
                });
            }
        };
        window.addEventListener('popstate', onPopState);
        const onScroll = event => this.updateCurrentSection();
        window.addEventListener('scroll', onScroll, {
            passive: true
        });
        if (window.pageYOffset === 0) {
            this.updateCurrentSection();
        }
    }
    updateCurrentSection() {
        var { sectionAnchors } = this;
        var mostVisiblePage = Array.prototype.map.call(
            Object.keys(sectionAnchors),
            function mapToPageVisibleHeight(section, i, sectionArr) {
                var anchorElem = sectionAnchors[section];
                var pageBottom = i + 1 < sectionArr.length
                    ? sectionAnchors[sectionArr[i + 1]].offsetTop
                    : document.documentElement.scrollHeight;
                var visibleBottom = Math.min(pageBottom, window.pageYOffset + window.innerHeight);
                var pageTop = anchorElem.offsetTop;
                var visibleTop = Math.max(pageTop, window.pageYOffset);
                return {
                    visiblePageHeight: Math.max(0, visibleBottom - visibleTop),
                    anchor: anchorElem,
                    section: section
                };
            }).sort(function sortPageVisibleHeight(lhs, rhs) {
            return rhs.visiblePageHeight - lhs.visiblePageHeight;
        })[0];
        if (mostVisiblePage && mostVisiblePage.section && this.state.currentSection !== mostVisiblePage.section) {
            this.setState({
                currentSection: mostVisiblePage.section
            });
        }
    }
    render() {
        const { openMenu,
            sectionNavLinkMounted,
            sectionAnchorMountedAbout,
            sectionAnchorMountedBrainfuel,
            sectionAnchorMountedLabo,
            changeSection,
            filterEntries } = this;
        const { menuIsOpen, currentSection, filteredTag } = this.state;
        const { apiUrl } = this.props;
        return (
            <React.StrictMode>
                <StyledApp>
                  <GlobalStyles />
                    <Menu
                        menuIsOpen={menuIsOpen}
                        openMenu={openMenu}
                        currentSection={currentSection}
                        changeSection={changeSection}
                        sectionNavLinkMounted={sectionNavLinkMounted} />
                    <Main role="main">
                        <PageAnchor name="about" ref={sectionAnchorMountedAbout}></PageAnchor>
                        <AboutPage></AboutPage>
                        <PageAnchor name="brainfuel" ref={sectionAnchorMountedBrainfuel}></PageAnchor>
                        <ResourcesPage apiUrl={apiUrl} filterEntries={filterEntries} filteredTag={filteredTag} />
                        <PageAnchor name="labo" ref={sectionAnchorMountedLabo}></PageAnchor>
                        <LabPage></LabPage>
                    </Main>
                </StyledApp>
            </React.StrictMode>
        );
    }
}

App.propTypes = {
    apiUrl: PropTypes.string.isRequired,
    win: PropTypes.object.isRequired
};

App.defaultProps = {
    apiUrl: null,
    win: null
};

const pushWindowState = section => {
    var urlShardPos = window.location.href.lastIndexOf('#');
    if (urlShardPos) {
        window.history.pushState({
            currentSection: section
        },
        document.title,
        window.location.href.substr(0, urlShardPos) + '#' + section);
    } else {
        window.history.pushState({
            currentMenuLink: section
        },
        document.title,
        window.location.href + '#' + section);
    }
};

const scrollTo = elem => {
    window.scrollBy({
        top: elem.offsetTop - window.pageYOffset,
        left: 0,
        behavior: 'smooth'
    });
};

module.exports = App;
