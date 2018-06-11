'use strict';

import React from 'react';
import BookCarousel from '../components/BookCarousel';
import ResourceFeed from '../components/ResourceFeed';

/**
 * Component displaying Fellowseb's lab books in a carousel.
 * Is basically a ResourceFeed with a BookCarousel component for the presentation.
 * @param {object} props Properties. See ResourceFeed.
 */
const BookFeed = props =>
    <ResourceFeed
        {...props}
        apiEndpoint='/books'
        title='Books'
        ResourceFeedDisplayComp={BookCarousel} />;

module.exports = BookFeed;
