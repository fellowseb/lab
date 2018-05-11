'use strict';

import React from 'react';
import ResourceList from '../components/ResourceList';
import ResourceFeed from '../components/ResourceFeed';

const TalkList = props =>
    <ResourceList
        {...props}
        defaultThumbnailClass='fa-headphones' />;

const TalkFeed = props =>
    <ResourceFeed
        {...props}
        apiEndpoint='/talks'
        title='Talks'
        ResourceFeedDisplayComp={TalkList} />;

module.exports = TalkFeed;
