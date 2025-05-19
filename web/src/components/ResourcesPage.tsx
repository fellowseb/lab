import styled from "styled-components";

import { media } from "../components/MediaQueries.tsx";
import Page from "../components/Page.tsx";
import ResourceFilters from "../components/ResourceFilters.tsx";
import ArticleFeed from "../components/ArticleFeed.tsx";
import TalkFeed from "../components/TalkFeed.tsx";
import BookFeed from "../components/BookFeed.tsx";

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

interface ResourcesPageProps {
  apiUrl: string;
  filterEntries: (tag: string) => void;
  filteredTag?: string;
}

const ResourcesPage = ({
  apiUrl,
  filterEntries,
  filteredTag,
}: ResourcesPageProps) => {
  return (
    <Page title="Tech Watch" id="brainfuel-page">
      <ResourcesContainer>
        <ResourcesFiltersContainer>
          <ResourceFilters
            onChangeFilter={filterEntries}
            apiUrl={apiUrl}
            filteredTag={filteredTag}
          />
        </ResourcesFiltersContainer>
        <ResourcesArticlesContainer>
          <ArticleFeed filteredTag={filteredTag} apiUrl={apiUrl} count={3} />
        </ResourcesArticlesContainer>
        <ResourcesTalksContainer>
          <TalkFeed filteredTag={filteredTag} apiUrl={apiUrl} count={3} />
        </ResourcesTalksContainer>
        <ResourcesBooksContainer>
          <BookFeed filteredTag={filteredTag} apiUrl={apiUrl} count={30} />
        </ResourcesBooksContainer>
      </ResourcesContainer>
    </Page>
  );
};

export default ResourcesPage;
