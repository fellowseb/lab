import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import ErrorDisplay from './ErrorDisplay.jsx';
import { A, Ul } from '../components/BaseStyledComponents.jsx';
import Loader from '../components/Loader.jsx';
import ResourceItem from '../components/ResourceItem.jsx';

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

const PrevPageLink = styled(PageLink)`
  position: absolute;
  top: -20px;
  left: calc(50% - 35px);
  visibility: ${props => props.show ? 'visible' : 'hidden'};
`;

const NextPageLink = styled(PageLink)`
  visibility: ${props => props.show ? 'visible' : 'hidden'};
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

/**
 * State-less component displaying a list of resources in a column.
 * @param {object} props Properties.
 * @param {FellowsebLabResource[]} [props.resources=[]] Resources to display.
 * @param {bool} [props.hasNextPage=false] A next page is available.
 * @param {bool} [props.hasPrevPage=false] A previous page is available.
 * @param {Function} [props.onPrevPage] Callback called when previous page button is hit.
 * @param {Function} [props.onNextPage] Callback called when next page button is hit.
 * @param {string} [props.defaultThumbnailClass='fa-bookmark'] CSS thumbnail class.
 * @param {Error} [props.error=null] An error to display. Will appear in front of existing resources.
 * @param {bool} [props.loading=false] Set if the data is currently loading.
 */
const ResourceList = ({ resources = [],
    hasNextPage = false,
    hasPrevPage = false,
    onPrevPage = f => f,
    onNextPage = f => f,
    defaultThumbnailClass = 'fa-bookmark',
    error = null,
    loading = false }) => {
    return (
        <ResourceListContainer>
            <PrevPageLink show={hasPrevPage && !loading} onClick={onPrevPage}>
                <ArrowSVG>
                    <use href="#arrowup" />
                </ArrowSVG>
            </PrevPageLink>
            <LoaderParent>
                <ResourceFeedContentSelect error={error} loading={loading}>
                    <Loader />
                    <ErrorDisplay error={error} />
                </ResourceFeedContentSelect>
                <ResourceListItems resources={resources} defaultThumbnailClass={defaultThumbnailClass} />
            </LoaderParent>
            <NextPageLink show={hasNextPage && !loading} onClick={onNextPage}>
                <ArrowSVG>
                    <use href="#arrowdown" />
                </ArrowSVG>
            </NextPageLink>
        </ResourceListContainer>
    );
};

ResourceList.propTypes = {
    resources: PropTypes.array,
    hasNextPage: PropTypes.bool,
    hasPrevPage: PropTypes.bool,
    onPrevPage: PropTypes.func,
    onNextPage: PropTypes.func,
    defaultThumbnailClass: PropTypes.string,
    error: PropTypes.object,
    loading: PropTypes.bool
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

const ResourceListItems = ({ resources = [], defaultThumbnailClass = '' }) =>
    <ArticlesList>
        {resources.map((resource) => {
            const thumbnailUrl = resource.thumbnail
                ? resource.thumbnail.url
                : '';
            return <ResourceItem key={resource.resourceId}
                title={resource.title}
                url={resource.url}
                tags={resource.tags}
                authors={resource.authors}
                thumbnailUrl={thumbnailUrl}
                defaultThumbnailClass={defaultThumbnailClass} />;
        })}
    </ArticlesList>;

ResourceListItems.propTypes = {
    resources: PropTypes.array,
    defaultThumbnailClass: PropTypes.string
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
                : null
        );

export default ResourceList;
