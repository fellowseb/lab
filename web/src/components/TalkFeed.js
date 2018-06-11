'use strict';

import React from 'react';
import ResourceList from '../components/ResourceList';
import ResourceFeed from '../components/ResourceFeed';

/**
 * Component displaying a feed of Talk resources.
 * Is basically a ResourceFeed using ResourceList as
 * a presentational component. 
 * @param {object} props Properties. See ResourceFeed.
 */
const TalkFeed = props =>
    <ResourceFeed
        {...props}
        apiEndpoint='/talks'
        title='Talks'
        ResourceFeedDisplayComp={TalkList} />;

const TalkList = props =>
    <ResourceList
        {...props}
        defaultThumbnailClass='fa-headphones' />;

module.exports = TalkFeed;
