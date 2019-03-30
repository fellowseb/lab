import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { media } from '../components/MediaQueries.jsx';
import Page from '../components/Page.jsx';
import ResourceFilters from '../components/ResourceFilters.jsx';
import ArticleFeed from '../components/ArticleFeed.jsx';
import TalkFeed from '../components/TalkFeed.jsx';
import BookFeed from '../components/BookFeed.jsx';

const ResourcesContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  max-width: 1400px;
`;

const ResourcesFiltersContainer = styled.div`
  background: #c1b79a;
  flex: 2 1 100%;
  height: 1.5em;
  margin-bottom: 1em;
  color: #333;
  padding: 2px 10px;
  vertical-align: bottom;
  border-radius: 10px;
`;

const ResourcesArticlesContainer = styled.div`
  margin: 0;
  ${media.medium`
      margin-right: 4px;
  `}
  flex: 1 1 40%;
`;

const ResourcesTalksContainer = styled.div`
  margin: 0;
  ${media.medium`
      margin-left: 4px;
  `}
  flex: 1 1 40%;

`;

const ResourcesBooksContainer = styled.div`
  flex: 1 1 100%;
`;

const ResourcesPage = ({ apiUrl, filterEntries, filteredTag }) => {
    return (
        <Page>
            <ResourcesContainer>
                <ResourcesFiltersContainer>
                    <ResourceFilters
                        onChangeFilter={filterEntries}
                        apiUrl={apiUrl}
                        filteredTag={filteredTag} />
                </ResourcesFiltersContainer>
                <ResourcesArticlesContainer>
                    <ArticleFeed
                        filteredTag={filteredTag}
                        apiUrl={apiUrl}
                        count={3} />
                </ResourcesArticlesContainer>
                <ResourcesTalksContainer>
                    <TalkFeed
                        filteredTag={filteredTag}
                        apiUrl={apiUrl}
                        count={3} />
                </ResourcesTalksContainer>
                <ResourcesBooksContainer>
                    <BookFeed
                        filteredTag={filteredTag}
                        apiUrl={apiUrl}
                        count={30} />
                </ResourcesBooksContainer>
            </ResourcesContainer>
        </Page>
    );
};

ResourcesPage.propTypes = {
    apiUrl: PropTypes.string,
    filterEntries: PropTypes.func,
    filteredTag: PropTypes.string
};

export default ResourcesPage;
