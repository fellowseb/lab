'use strict';

import React from 'react';
import ResourceList from '../components/ResourceList';
import ResourceFeed from '../components/ResourceFeed';

const ArticleList = props =>
    <ResourceList
        {...props}
        defaultThumbnailClass='fa-bookmark' />;

const ArticleFeed = props =>
    <ResourceFeed
        {...props}
        apiEndpoint='/articles'
        title='Articles'
        ResourceFeedDisplayComp={ArticleList} />;

module.exports = ArticleFeed;
