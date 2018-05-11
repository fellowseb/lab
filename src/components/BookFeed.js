'use strict';

import React from 'react';
import BookCarousel from '../components/BookCarousel';
import ResourceFeed from '../components/ResourceFeed';

const BookFeed = props =>
    <ResourceFeed
        {...props}
        apiEndpoint='/books'
        title='Books'
        ResourceFeedDisplayComp={BookCarousel} />;

module.exports = BookFeed;
