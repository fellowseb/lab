import React from 'react';
import ResourceItem from './ResourceItem';
import PropTypes from 'prop-types';
import Loader from './Loader';
import ErrorDisplay from './ErrorDisplay';

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
    let prevPageClasses = ['articles-prevpage'];
    if (!hasPrevPage || loading) prevPageClasses.push('hidden');
    let nextPageClasses = ['articles-nextpage'];
    if (!hasNextPage || loading) nextPageClasses.push('hidden');
    const serializeClasses = (classList) =>
        classList.reduce((strg, className) => `${strg} ${className}`, '');
    return (
        <div className='resourcelist-container'>
            <a className={serializeClasses(prevPageClasses)} onClick={onPrevPage}>
                <svg className="icon-arrows">
                    <use href="#arrowup" />
                </svg>
            </a>
            <div className='loader-parent'>
                <ResourceFeedContentSelect error={error} loading={loading}>
                    <Loader />
                    <ErrorDisplay error={error} />
                </ResourceFeedContentSelect>
                <ResourceListItems resources={resources} defaultThumbnailClass={defaultThumbnailClass} />
            </div>
            <a className={serializeClasses(nextPageClasses)} onClick={onNextPage}>
                <svg className="icon-arrows">
                    <use href="#arrowdown" />
                </svg>
            </a>
        </div>
    );
};

ResourceList.propTypes = {
    resources: PropTypes.array,
    hasNextPage: PropTypes.bool,
    hasPrevPage: PropTypes.bool,
    onPrevPage: PropTypes.func,
    onNextPage: PropTypes.func,
    defaultThumbnailClass: PropTypes.string
};

const ResourceListItems = ({ resources = [], defaultThumbnailClass = '' }) =>
    <ul className='articles-list'>
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
    </ul>;

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
