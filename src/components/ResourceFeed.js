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
    componentWillReceiveProps(nextProps) {
        updateComponentState(this, nextProps);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    componentWillMount() {
        updateComponentState(this, this.props);
    }
    render() {
        const { resources,
            error,
            loading,
            totalCount,
            filteredCount,
            next,
            prev } = this.state;
        const { title, ResourceFeedDisplayComp } = this.props;

        const onPrevPage = e => {
            e.preventDefault();
            updateComponentState(this, this.props, prev);
        };

        const onNextPage = e => {
            e.preventDefault();
            updateComponentState(this, this.props, next);
        };

        const findChild = (children, child) =>
            React.Children
                .toArray(children)
                .filter(c => c.type === child)[0];

        const ResourceFeedContentSelect = ({error = null, loading = false, children}) =>
            loading
                ? findChild(children, Loader)
                : (
                    error
                        ? findChild(children, ErrorDisplay)
                        : findChild(children, ResourceFeedDisplayComp)
                );
        return (
            <div className='articles-container'>
                <ResourceFeedHeader title={title} totalCount={totalCount} filteredCount={filteredCount}/>
                <ResourceFeedContentSelect error={error} loading={loading}>
                    <Loader />
                    <ErrorDisplay error={error}/>
                    <ResourceFeedDisplayComp
                        resources={resources}
                        hasNextPage={!!next}
                        hasPrevPage={!!prev}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage}/>
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

const ResourceFeedHeader = ({title = 'Resources',
    totalCount = 0,
    filteredCount = 0}) => {
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

const updateComponentState = (component, {filteredTag, count, apiUrl, apiEndpoint}, link) => {
    component.setState({ loading: true });
    retrieveResources(apiUrl, apiEndpoint, filteredTag, count, link)
        .then(resources => {
            component.setState({
                ...component.state,
                loading: false,
                error: null,
                resources: resources.resources,
                totalCount: resources.totalCount,
                filteredCount: resources.filteredCount,
                next: resources.next,
                prev: resources.prev
            });
        })
        .catch(error => {
            component.setState({
                ...component.state,
                loading: false,
                error: error,
                resources: [],
                totalCount: 0,
                filteredCount: 0,
                next: '',
                prev: ''
            });
        });
};

/**
 * Fetch Pocket data
 */
const retrieveResources = (apiUrl, apiEndpoint, filteredTag, count, link) => {
    let url = apiUrl.substr(0);
    if (link) {
        url += link;
    } else {
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
        url += apiEndpoint + '?' + paramString(params);
    }

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
