import React from 'react';
import PropTypes from 'prop-types';

const ResourceItem = ({ title = '[untitled article]', url = '', tags = [], thumbnailUrl = '', authors = [], defaultThumbnailClass = 'fa-bookmark' }) => {
    const defaultThumbnailClasses = 'fas fa-4x ' + defaultThumbnailClass;
    const authorsStr = authors.length ? authors[0] : '';
    return (<li className='article-item clear'>
        <picture className={defaultThumbnailClasses}></picture>
        <a className="article-title" href={url} target="_blank" rel="noopener">{title}</a>
        <div className="article-urlandauthors"><a className="article-url" href={url} target="_blank" rel="noopener">{domainFromURL(url)}</a>{authorsStr ? <span className="article-authors"> by {authors}</span> : null }</div>
        <ul className="article-tags">
            {tags.map((tag, tagIndex) => <li key={tagIndex}>{tag}</li>)}
        </ul>
    </li>);
};

const urlRegexp = /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

ResourceItem.propTypes = {
    title: PropTypes.string.isRequired,
    url: (props, propName) => (typeof props[propName] !== 'string'
        ? new Error('An article url must be a string')
        : urlRegexp.test(props[propName]) === false
            ? new Error('url is not a valid URL')
            : null
    ),
    tags: PropTypes.array,
    thumbnailUrl: PropTypes.string,
    defaultThumbnailClass: PropTypes.string,
    authors: PropTypes.array
};

function domainFromURL(url) {
    let result;
    let match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im);
    if (match) {
        result = match[1];
        match = result.match(/^[^.]+\.(.+\..+)$/);
        if (match) {
            result = match[1];
        }
    }
    return result;
}

export default ResourceItem;
