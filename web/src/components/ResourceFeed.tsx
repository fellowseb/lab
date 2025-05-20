import {
  useCallback,
  useEffect,
  useState,
  type ComponentType,
  type SyntheticEvent,
} from "react";
import styled from "styled-components";

import { P } from "../components/BaseStyledComponents.tsx";
import type { ResourceModel } from "./types.ts";

const ArticlesContainer = styled.div`
  min-width: 300px;
  display: flex;
  flex-direction: column;
`;

const ArticlesTitle = styled(P)`
  margin: 0;
  width: 100%;
`;

const ArticlesTitleCount = styled.span`
  font-size: 80%;
`;

interface ResourceFeedDIsplayCompProps {
  resources: ResourceModel[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: (event: SyntheticEvent) => void;
  onPrevPage: (event: SyntheticEvent) => void;
  error: unknown | null;
  loading: boolean;
}

interface ResourceFeedProps {
  resourcesUrl: string;
  filteredTag?: string;
  ResourceFeedDisplayComp: ComponentType<ResourceFeedDIsplayCompProps>;
  title: string;
}

interface ResourceFeedState {
  resources: ResourceModel[];
  error: unknown | null;
  loading: boolean;
  totalCount: number;
  filteredCount: number;
  offset: number | null;
  next: string | null;
  prev: string | null;
}

/**
 * React component listing articles from a Pocket account.
 * Possibility to filter the articles based on the tags.
 * @extends React.PureComponent
 */
const ResourceFeed = ({
  resourcesUrl,
  // filteredTag = "",
  title = "Resources",
  ResourceFeedDisplayComp,
}: ResourceFeedProps) => {
  const [state, setState] = useState<ResourceFeedState>({
    resources: [],
    error: null,
    loading: false,
    totalCount: 0,
    filteredCount: 0,
    offset: null,
    next: null,
    prev: null,
  });
  const {
    error,
    loading,
    totalCount,
    filteredCount,
    next,
    prev,
    resources,
    // offset,
  } = state;

  const updateComponentState = useCallback(() => {
    const refresh = async () => {
      setState((prevState) => ({ ...prevState, loading: true }));
      try {
        const result = await retrieveResources(resourcesUrl);
        setState((prevState) => ({
          resources: result.resources,
          loading: false,
          error: null,
          totalCount: result.totalCount,
          filteredCount: result.filteredCount,
          next: result.next,
          prev: result.prev,
          offset: prevState.offset,
        }));
      } catch (err) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: err,
        }));
      }
    };
    refresh();
  }, [resourcesUrl]);
  // const extractOffset = (href: string | null): number | null => {
  //   if (!href) {
  //     return null;
  //   }
  //   const regexResults = /offset=([0-9]+)/.exec(href);
  //   return regexResults ? Number.parseInt(regexResults[1], 10) : 0;
  // };
  const onPrevPage = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      updateComponentState();
    },
    [updateComponentState],
  );
  const onNextPage = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      updateComponentState();
    },
    [updateComponentState],
  );

  useEffect(() => {
    updateComponentState();
  }, [updateComponentState]);

  return (
    <ArticlesContainer>
      <ResourceFeedHeader
        title={title}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />
      <ResourceFeedDisplayComp
        resources={resources}
        hasNextPage={!!next}
        hasPrevPage={!!prev}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        error={error}
        loading={loading}
      />
    </ArticlesContainer>
  );
};

interface ResourceFeedHeaderProps {
  title: string;
  totalCount: number;
  filteredCount: number;
}

const ResourceFeedHeader = ({
  title = "Resources",
  totalCount = 0,
  filteredCount = 0,
}: ResourceFeedHeaderProps) => {
  const totalStr =
    totalCount === filteredCount
      ? ` (${totalCount})`
      : ` (${filteredCount} of ${totalCount})`;
  return (
    <ArticlesTitle>
      {title}
      <ArticlesTitleCount>{totalStr}</ArticlesTitleCount>
    </ArticlesTitle>
  );
};

// Helper functions

const sortResourceByDate = (lhs: ResourceModel, rhs: ResourceModel) => {
  return Date.parse(lhs.date) < Date.parse(rhs.date) ? -1 : 1;
};

const retrieveResources = async (resourcesUrl: string) => {
  const response = await fetch(resourcesUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  const json = await response.json();
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`${json.error ? json.error : response.statusText}`);
  }
  return {
    resources: json.sort(sortResourceByDate).reverse(),
    totalCount: json.length,
    filteredCount: json.length,
    next: null,
    prev: null,
  };
};

export default ResourceFeed;
