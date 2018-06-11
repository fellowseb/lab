'use strict';

import React from 'react';
import ResourceList from '../components/ResourceList';
import ResourceFeed from '../components/ResourceFeed';

/**
 * Component rendering a feed of Articles.
 * Is basically a ResourceFeed using an ArticleList presentational component.
 * @param {Object} props Properties. See ResourceList.
 */
const ArticleFeed = props =>
    <ResourceFeed
        {...props}
        apiEndpoint='/articles'
        title='Articles'
        ResourceFeedDisplayComp={ArticleList} />;

const ArticleList = props =>
    <ResourceList
        {...props}
        defaultThumbnailClass='fa-bookmark' />;

module.exports = ArticleFeed;
