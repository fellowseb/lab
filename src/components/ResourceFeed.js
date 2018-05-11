import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import ErrorDisplay from './ErrorDisplay';
import Loader from './Loader';

/**
 * React component listing articles from a Pocket account.
 * Possibility to filter the articles based on the tags.
 *
 * @extends React.Component
 */
class ResourceFeed extends React.Component {
    constructor(props) {
        super(props);
        this.resources = [];
        this.state = {
            error: null,
            loading: false,
            totalCount: 0,
            filteredCount: 0,
            offset: null
        };
    }
    componentWillReceiveProps(nextProps) {
        //const { offset } = this.state;
        //updateComponentState(this, nextProps, offset);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.error !== this.state.error ||
            nextState.loading !== this.state.loading ||
            nextState.totalCount !== this.state.totalCount ||
            nextState.filteredCount !== this.state.filteredCount ||
            nextState.offset !== this.state.offset ||
            nextProps.apiUrl !== this.props.apiUrl ||
            nextProps.apiEndpoint !== this.props.apiEndpoint ||
            nextProps.filteredTag !== this.props.filteredTag ||
            nextProps.count !== this.props.count ||
            nextProps.title !== this.props.title;
    }
    componentDidMount() {
        const { offset } = this.state;
        updateComponentState(this, this.props, offset);
    }
    render() {
        const { resources } = this;
        const { error,
            loading,
            totalCount,
            filteredCount,
            next,
            prev } = this.state;
        const { title, ResourceFeedDisplayComp } = this.props;

        const extractOffset = href => 0;

        const onPrevPage = e => {
            e.preventDefault();
            updateComponentState(this, this.props, extractOffset(prev));
        };

        const onNextPage = e => {
            e.preventDefault();
            updateComponentState(this, this.props, extractOffset(next));
        };

        const findChild = (children, child) =>
            React.Children
                .toArray(children)
                .filter(c => c.type === child)[0];

        const ResourceFeedContentSelect = ({ error = null, loading = false, children }) =>
            loading
                ? findChild(children, Loader)
                : (
                    error
                        ? findChild(children, ErrorDisplay)
                        : findChild(children, ResourceFeedDisplayComp)
                );
        return (
            <div className='articles-container'>
                <ResourceFeedHeader title={title} totalCount={totalCount} filteredCount={filteredCount} />
                <ResourceFeedContentSelect error={error} loading={loading}>
                    <Loader />
                    <ErrorDisplay error={error} />
                    <ResourceFeedDisplayComp
                        resources={resources}
                        hasNextPage={!!next}
                        hasPrevPage={!!prev}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage} />
                </ResourceFeedContentSelect>
            </div>
        );
    }
}

ResourceFeed.propTypes = {
    apiUrl: PropTypes.string.isRequired,
    apiEndpoint: PropTypes.string.isRequired,
    filteredTag: PropTypes.string,
    count: PropTypes.number,
    title: PropTypes.string.isRequired,
    ResourceFeedDisplayComp: PropTypes.func
};

ResourceFeed.defaultProps = {
    apiUrl: '',
    apiEndpoint: '',
    filteredTag: '',
    count: 5,
    title: 'Resources'
};

const ResourceFeedHeader = ({ title = 'Resources',
    totalCount = 0,
    filteredCount = 0 }) => {
    const totalStr = totalCount === filteredCount
        ? ` (${totalCount})`
        : ` (${filteredCount} of ${totalCount})`;
    return <p className='articles-title'>{title}<span className='articles-title-count'>{totalStr}</span></p>;
};

ResourceFeedHeader.propTypes = {
    title: PropTypes.string,
    totalCount: PropTypes.number,
    filteredCount: PropTypes.number
};

// Helper functions

const updateComponentState = (component, { filteredTag, count, apiUrl, apiEndpoint }, offset) => {
    component.setState({ loading: true });
    retrieveResources(apiUrl, apiEndpoint, filteredTag, count, offset)
        .then(resources => {
            component.resources = resources.resources;
            component.setState({
                loading: false,
                error: null,
                totalCount: resources.totalCount,
                filteredCount: resources.filteredCount,
                next: resources.next,
                prev: resources.prev,
                offset: offset
            });
        })
        .catch(error => {
            component.setState({
                loading: false,
                error: error
            });
        });
};

/**
 * Fetch Pocket data
 */
const retrieveResources = (apiUrl, apiEndpoint, filteredTag, count, offset) => {
    let url = apiUrl.substr(0);
    const paramString = json => Object.keys(json)
        .reduce((paramstr, key) =>
            (json[key]
                ? paramstr.concat(key, '=', json[key], '&')
                : paramstr),
        '')
        .slice(0, -1);
    const params = {
        'tag': filteredTag,
        'count': count
    };
    if (offset) {
        params['offset'] = offset;
    }
    url += apiEndpoint + '?' + paramString(params);

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    }).then(response => {
        return response.json();
    });
};

export default ResourceFeed;
