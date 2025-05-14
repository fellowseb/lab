"use strict";

import React from "react";
import ResourceList from "../components/ResourceList.jsx";
import ResourceFeed from "../components/ResourceFeed.jsx";

/**
 * Component rendering a feed of Articles.
 * Is basically a ResourceFeed using an ArticleList presentational component.
 * @param {Object} props Properties. See ResourceList.
 */
const ArticleFeed = (props) => (
  <ResourceFeed
    {...props}
    apiEndpoint="/articles"
    title="Articles"
    ResourceFeedDisplayComp={ArticleList}
  />
);

const ArticleList = (props) => (
  <ResourceList {...props} defaultThumbnailClass="fa-bookmark" />
);

export default ArticleFeed;
