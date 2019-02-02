import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import styled from 'styled-components';

import { P } from '../components/BaseStyledComponents.jsx';

const ArticlesContainer = styled.div `
  min-width: 300px;
  display: flex;
  flex-direction: column;
`

const ArticlesTitle = styled(P) `
  margin: 0;
  width: 100%;
`

const ArticlesTitleCount = styled.span `
  font-size: 80%;
`

/**
 * React component listing articles from a Pocket account.
 * Possibility to filter the articles based on the tags.
 * @extends React.PureComponent
 */
class ResourceFeed extends React.PureComponent {
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
        this.onPrevPage = this.onPrevPage.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
        this.extractOffset = this.extractOffset.bind(this);
    }
    componentDidMount() {
        const { offset } = this.state;
        updateComponentState(this, this.props, offset);
    }
    componentDidUpdate(prevProps) {
      const { filteredTag, apiUrl, apiEndpoint } = this.props; 
      if (apiUrl !== prevProps.apiUrl ||
          apiEndpoint !== prevProps.apiEndpoint ||
          filteredTag !== prevProps.filteredTag) {
          updateComponentState(this, this.props, 0);
      }
    }
    render() {
        const { resources,
            onNextPage,
            onPrevPage } = this;
        const { error,
            loading,
            totalCount,
            filteredCount,
            next,
            prev } = this.state;
        const { title, ResourceFeedDisplayComp, apiUrl } = this.props;

        return (
            <ArticlesContainer>
              <ResourceFeedHeader title={title} totalCount={totalCount} filteredCount={filteredCount} />
                    <ResourceFeedDisplayComp
                        resources={resources}
                        hasNextPage={!!next}
                        hasPrevPage={!!prev}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage}
                        error={error}
                        loading={loading}
                        apiUrl={apiUrl} />
            </ArticlesContainer>
        );
    }
    /**
     * @private
     */
    extractOffset(href) {
        let regexResults = /offset=([0-9]+)/.exec(href);
        return regexResults ? regexResults[1] : 0;
    }
    /**
     * @private
     */
    onPrevPage(event) {
        let { prev } = this.state;
        event.preventDefault();
        updateComponentState(this, this.props, this.extractOffset(prev));
    }
    /**
     * @private
     */
    onNextPage(event) {
        let { next } = this.state;
        event.preventDefault();
        updateComponentState(this, this.props, this.extractOffset(next));
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
    return <ArticlesTitle>{title}<ArticlesTitleCount>{totalStr}</ArticlesTitleCount></ArticlesTitle>;
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
