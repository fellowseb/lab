import React from 'react';
import ResourceItem from './ResourceItem';
import PropTypes from 'prop-types';

const ResourceList = ({ resources = [],
    hasNextPage = false,
    hasPrevPage = false,
    onPrevPage = f => f,
    onNextPage = f => f,
    defaultThumbnailClass = 'fa-bookmark' }) => {
    let prevPageClasses = ['articles-prevpage'];
    if (!hasPrevPage) prevPageClasses.push('hidden');
    let nextPageClasses = ['articles-nextpage'];
    if (!hasNextPage) nextPageClasses.push('hidden');
    const serializeClasses = (classList) =>
        classList.reduce((strg, className) => `${strg} ${className}`, '');
    return (
        <div className='resourcelist-container'>
            <a className={serializeClasses(prevPageClasses)} onClick={onPrevPage}>
                <svg className="icon-arrows">
                    <use href="#arrowup"/>
                </svg>
            </a>
            {
                renderItems(resources, defaultThumbnailClass)
            }
            <a className={serializeClasses(nextPageClasses)} onClick={onNextPage}>
                <svg className="icon-arrows">
                    <use href="#arrowdown"/>
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

const renderItems = (articles, defaultThumbnailClass) =>
    <ul className='articles-list'>
        {articles.map((article) => {
            const thumbnailUrl = article.thumbnail
                ? article.thumbnail.url
                : '';
            return <ResourceItem key={article.resourceId}
                title={article.title}
                url={article.url}
                tags={article.tags}
                authors={article.authors}
                thumbnailUrl={thumbnailUrl}
                defaultThumbnailClass={defaultThumbnailClass}/>;
        })}
    </ul>;

export default ResourceList;
