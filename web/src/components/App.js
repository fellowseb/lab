import React from 'react';
import ArticleFeed from '../components/ArticleFeed';
import TalkFeed from '../components/TalkFeed';
import ResourceFilters from '../components/ResourceFilters';
import BookFeed from '../components/BookFeed';
import Experiments from '../components/Experiments';
import Menu from '../components/Menu';
import PropTypes from 'prop-types';
import * as R from 'ramda';

/**
 * Main component.
 * Is composed of a menu and three main sections:
 * About, Resources and Lab.
 * Keeps track of the current section.
 * State:
 * - menuIsOpen {bool}
 * - currentSection {string}
 * - filteredTag {string}
 * @extends React.Component
 */
class App extends React.Component {
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
        this.sectionAnchorMountedAbout = R.partial(this.sectionAnchorMounted, ['about']);
        this.sectionAnchorMountedBrainfuel = R.partial(this.sectionAnchorMounted, ['brainfuel']);
        this.sectionAnchorMountedLabo = R.partial(this.sectionAnchorMounted, ['labo']);
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
                    visiblePageHeight: visibleBottom - visibleTop,
                    anchor: anchorElem,
                    section: section
                };
            }).sort(function sortPageVisibleHeight(lhs, rhs) {
            return lhs.visiblePageHeight < rhs.visiblePageHeight;
        })[0];
        if (mostVisiblePage && mostVisiblePage.section && this.state.currentSection !== mostVisiblePage.section) {
            this.setState({
                currentSection: mostVisiblePage.section
            });
        }
    }
    renderAboutSection() {
        return (
            <section className="page page-purpose">
                <div className="purpose-container">
                    <div className="purpose-container-who">
                        <header>
                            <p className="purpose-title">Who am I ?</p>
                        </header>
                        <figure>
                            <svg className="icon-purpose">
                                <use href="#code" />
                            </svg>
                        </figure>
                        <p className="purpose-desc">My name is <strong>S&eacute;bastien Wauquier</strong>.<br />
                            I&apos;m a Software Engineer. In the past years I&apos;ve dealt with real-time 3D apps on desktop (in C++) or in the browser (JavaScript).</p>
                    </div>
                    <div className="purpose-container-what">
                        <header>
                            <p className="purpose-title">What is this ?</p>
                        </header>
                        <figure>
                            <svg className="icon-purpose">
                                <use href="#lab" />
                            </svg>
                        </figure>
                        <p className="purpose-desc">This is my <strong>virtual laboratory</strong>.<br />I intend to experiment cool tech stuff and maybe later extend it to art and life in general.</p>
                    </div>
                    <div className="purpose-container-why">
                        <header>
                            <p className="purpose-title">What&apos;s the point ?</p>
                        </header>
                        <figure>
                            <svg className="icon-purpose">
                                <use href="#books" />
                            </svg>
                        </figure>
                        <p className="purpose-desc">I believe one should always <strong>keep on learning</strong>.<br />There are so many things to discover, to read, to share!</p>
                    </div>
                </div>
            </section>
        );
    }
    renderResourcesSection() {
        const { filteredTag } = this.state;
        const { filterEntries } = this;
        const { apiUrl } = this.props;
        return (
            <section id="page-brainfuel" className="page page-brainfuel">
                <div className='resources-container'>
                    <div className='resources-filters-container'>
                        <ResourceFilters
                            onChangeFilter={filterEntries}
                            apiUrl={apiUrl} />
                    </div>
                    <div className='resources-articles-container'>
                        <ArticleFeed
                            filteredTag={filteredTag}
                            apiUrl={apiUrl}
                            count={3} />
                    </div>
                    <div className='resources-talks-container'>
                        <TalkFeed
                            filteredTag={filteredTag}
                            apiUrl={apiUrl}
                            count={3} />
                    </div>
                    <div className='resources-books-container'>
                        <BookFeed
                            filteredTag={filteredTag}
                            apiUrl={apiUrl}
                            count={30} />
                    </div>
                </div>
            </section>
        );
    }
    renderLabSection() {
        return (
            <section id="page-experiments" className="page page-experiments">
                <Experiments />
            </section>
        );
    }
    render() {
        const { openMenu,
            sectionNavLinkMounted,
            sectionAnchorMountedAbout,
            sectionAnchorMountedBrainfuel,
            sectionAnchorMountedLabo,
            changeSection } = this;
        const { menuIsOpen, currentSection } = this.state;
        return (
            <React.StrictMode>
                <div id="app">
                    <Menu
                        menuIsOpen={menuIsOpen}
                        openMenu={openMenu}
                        currentSection={currentSection}
                        changeSection={changeSection}
                        sectionNavLinkMounted={sectionNavLinkMounted} />
                    <main className="main-container" role="main">
                        <a name="about" className="anchor" ref={sectionAnchorMountedAbout}></a>
                        {this.renderAboutSection()}
                        <a name="brainfuel" className="anchor" ref={sectionAnchorMountedBrainfuel}></a>
                        {this.renderResourcesSection()}
                        <a name="labo" className="anchor" ref={sectionAnchorMountedLabo}></a>
                        {this.renderLabSection()}
                    </main>
                </div>
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
