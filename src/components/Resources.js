import PropTypes from 'prop-types';
import ResourceFeed from './ResourceFeed';
import ResourceFilters from './ResourceFilters';
import React from 'react';
import ResourceList from './ResourceList';
import BookCarousel from './BookCarousel';

/**
 * Component displaying all resources used in fellowseb's lab.
 *
 * @extends React.Component
 */
class Resources extends React.Component {
    constructor(props) {
        super(props);
        this.apiUrl = FELLOWSEBLAB_API_URL;
        this.state = {
            filteredTag: props.filteredTag
        };
        this.filterEntries = this.filterEntries.bind(this);
    }
    filterEntries(tag) {
        this.setState({
            ...this.state,
            filteredTag: tag
        });
    }
    componentWillMount() {
    }
    render() {
        const { filteredTag } = this.state;
        const { filterEntries, apiUrl } = this;
        const ArticleList = props =>
            <ResourceList {...props} defaultThumbnailClass='fa-bookmark' />;
        const TalkList = props =>
            <ResourceList {...props} defaultThumbnailClass='fa-headphones' />;
        return (
            <div className='resources-container'>
                <div className='resources-filters-container'>
                    <ResourceFilters onChangeFilter={filterEntries}/>
                </div>
                <div className='resources-articles-container'>
                    <ResourceFeed
                        filteredTag={filteredTag}
                        apiUrl={apiUrl}
                        apiEndpoint='/articles'
                        count={3}
                        title='Articles'
                        ResourceFeedDisplayComp={ArticleList}/>
                </div>
                <div className='resources-talks-container'>
                    <ResourceFeed
                        filteredTag={filteredTag}
                        apiUrl={apiUrl}
                        apiEndpoint='/talks'
                        count={3}
                        title='Talks'
                        ResourceFeedDisplayComp={TalkList}/>
                </div>
                <div className='resources-books-container'>
                    <ResourceFeed
                        filteredTag={filteredTag}
                        apiUrl={apiUrl}
                        apiEndpoint='/books'
                        count={30}
                        title='Books'
                        ResourceFeedDisplayComp={BookCarousel}/>
                </div>
            </div>
        );
    }
}

Resources.propTypes = {
    filteredTag: PropTypes.string
};

Resources.defaultProps = {
    filteredTag: null
};

export default Resources;
