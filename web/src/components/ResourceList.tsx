import { type ReactNode, type SyntheticEvent } from "react";
import styled from "styled-components";

import ErrorDisplay from "./ErrorDisplay.tsx";
import { A, Ul } from "../components/BaseStyledComponents.tsx";
import Loader from "../components/Loader.tsx";
import ResourceItem from "../components/ResourceItem.tsx";
import type { ResourceModel } from "./types.ts";

const ResourceListContainer = styled.div`
  position: relative;
`;

const PageLink = styled(A)`
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const PrevPageLink = styled(PageLink)<{
  $show: boolean;
}>`
  position: absolute;
  top: -20px;
  left: calc(50% - 35px);
  visibility: ${(props) => (props.$show ? "visible" : "hidden")};
`;

const NextPageLink = styled(PageLink)<{
  $show: boolean;
}>`
  visibility: ${(props) => (props.$show ? "visible" : "hidden")};
`;

const ArrowSVG = styled.svg`
  height: 20px;
  width: 70px;
  &:hover {
    fill: #333;
  }
`;

const LoaderParent = styled.div`
  position: relative;
`;

export interface ResourceListProps {
  resources: ResourceModel[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPrevPage: (event: SyntheticEvent) => void;
  onNextPage: (event: SyntheticEvent) => void;
  defaultThumbnailClass: string;
  error: unknown | null;
  loading: boolean;
}

/**
 * State-less component displaying a list of resources in a column.
 */
const ResourceList = ({
  resources = [],
  hasNextPage = false,
  hasPrevPage = false,
  onPrevPage,
  onNextPage,
  defaultThumbnailClass = "fa-bookmark",
  error = null,
  loading = false,
}: ResourceListProps) => {
  return (
    <ResourceListContainer>
      <PrevPageLink $show={hasPrevPage && !loading} onClick={onPrevPage}>
        <ArrowSVG>
          <use href="#arrowup" />
        </ArrowSVG>
      </PrevPageLink>
      <LoaderParent>
        <ResourceFeedContentSelect
          error={error}
          loading={loading}
          Loader={<Loader />}
          Error={<ErrorDisplay error={error} />}
        />
        <ResourceListItems
          resources={resources}
          defaultThumbnailClass={defaultThumbnailClass}
        />
      </LoaderParent>
      <NextPageLink $show={hasNextPage && !loading} onClick={onNextPage}>
        <ArrowSVG>
          <use href="#arrowdown" />
        </ArrowSVG>
      </NextPageLink>
    </ResourceListContainer>
  );
};

const ArticlesList = styled(Ul)`
  border-top: 1px solid #c1b79a;
  border-bottom: 1px solid #c1b79a;
  list-style: none;
  margin: 0;
  padding: 0;
  background: #c1b79a;
  border: 1px solid #aba288;
  display: flex;
  flex-direction: column;
`;

interface ResourceListItemsProps {
  resources: ResourceModel[];
  defaultThumbnailClass: string;
}

const ResourceListItems = ({
  resources = [],
  defaultThumbnailClass = "",
}: ResourceListItemsProps) => (
  <ArticlesList>
    {resources.map((resource) => {
      const thumbnailUrl = resource.thumbnail ? resource.thumbnail.url : "";
      return (
        <ResourceItem
          key={resource.resourceId}
          title={resource.title}
          url={resource.url}
          tags={resource.tags}
          authors={resource.authors}
          thumbnailUrl={thumbnailUrl}
          defaultThumbnailClass={defaultThumbnailClass}
        />
      );
    })}
  </ArticlesList>
);

interface ResourceFeedContentSelectProps {
  error: unknown | null;
  loading: boolean;
  Loader: ReactNode;
  Error: ReactNode;
}

const ResourceFeedContentSelect = (props: ResourceFeedContentSelectProps) =>
  props.loading ? props.Loader : props.error ? props.Error : null;

export default ResourceList;
