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
  apiUrl: string;
}

interface ResourceFeedProps {
  apiUrl: string;
  apiEndpoint: string;
  filteredTag?: string;
  count: number;
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
  apiUrl = "",
  apiEndpoint = "",
  filteredTag = "",
  count = 5,
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
    offset,
  } = state;

  const updateComponentState = useCallback(
    (offset: number | null) => {
      const refresh = async () => {
        setState((prevState) => ({ ...prevState, loading: true }));
        try {
          const result = await retrieveResources(
            apiUrl,
            apiEndpoint,
            filteredTag,
            count,
            offset,
          );
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
    },
    [apiEndpoint, apiUrl, filteredTag, count],
  );
  const extractOffset = (href: string | null): number | null => {
    if (!href) {
      return null;
    }
    const regexResults = /offset=([0-9]+)/.exec(href);
    return regexResults ? Number.parseInt(regexResults[1], 10) : 0;
  };
  const onPrevPage = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      updateComponentState(extractOffset(prev));
    },
    [prev, updateComponentState],
  );
  const onNextPage = useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      updateComponentState(extractOffset(next));
    },
    [next, updateComponentState],
  );

  useEffect(() => {
    updateComponentState(offset);
  }, [updateComponentState, offset]);

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
        apiUrl={apiUrl}
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

/**
 * Fetch Pocket data
 */
const retrieveResources = async (
  apiUrl: string,
  apiEndpoint: string,
  filteredTag: string,
  count: number,
  offset: number | null,
) => {
  let url = apiUrl.substr(0);
  const paramString = (json: { [key: string]: string | number | null }) =>
    Object.keys(json)
      .reduce(
        (paramstr, key) =>
          json[key]
            ? paramstr.concat(key, "=", String(json[key]), "&")
            : paramstr,
        "",
      )
      .slice(0, -1);
  const params = {
    tag: filteredTag,
    count: count,
    offset: offset ?? null,
  };
  url += apiEndpoint + "?" + paramString(params);

  const response = await fetch(url, {
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
  return json;
};

export default ResourceFeed;
