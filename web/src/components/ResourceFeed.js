import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';

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
        if (this.props.apiUrl != nextProps.apiUrl ||
            this.props.apiEndpoint != nextProps.apiEndpoint ||
            this.props.filteredTag != nextProps.filteredTag ||
            this.props.count != nextProps.count) {
            updateComponentState(this, nextProps, this.state.offset);
        }

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
        const { title, ResourceFeedDisplayComp, apiUrl } = this.props;

        const extractOffset = href => {
            let regexResults = /offset=([0-9]+)/.exec(href);
            return regexResults ? regexResults[1] : 0;
        };

        const onPrevPage = e => {
            e.preventDefault();
            updateComponentState(this, this.props, extractOffset(prev));
        };

        const onNextPage = e => {
            e.preventDefault();
            updateComponentState(this, this.props, extractOffset(next));
        };

        return (
            <div className='articles-container'>
                <ResourceFeedHeader title={title} totalCount={totalCount} filteredCount={filteredCount} />
                <div>
                    <ResourceFeedDisplayComp
                        resources={resources}
                        hasNextPage={!!next}
                        hasPrevPage={!!prev}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage}
                        error={error}
                        loading={loading}
                        apiUrl={apiUrl} />
                </div>
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

const updateComponentState = async (component, { filteredTag, count, apiUrl, apiEndpoint }, offset) => {
    component.setState({ ...component.state, loading: true });
    try {
        let resources = await retrieveResources(apiUrl, apiEndpoint, filteredTag, count, offset)
        component.resources = resources.resources;
        component.setState({
            ...component.state,
            loading: false,
            error: null,
            totalCount: resources.totalCount,
            filteredCount: resources.filteredCount,
            next: resources.next,
            prev: resources.prev,
            offset
        });
    } catch (err) {
        console.error(err);
        component.setState({
            ...component.state,
            loading: false,
            error: err
        });
    }
};

/**
 * Fetch Pocket data
 */
const retrieveResources = async (apiUrl, apiEndpoint, filteredTag, count, offset) => {
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

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    });
    let json = await response.json();
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`${json.error ? json.error : response.statusText}`);
    }
    return json;
};

export default ResourceFeed;
