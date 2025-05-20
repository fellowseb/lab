import ResourceList, {
  type ResourceListProps,
} from "../components/ResourceList.tsx";
import ResourceFeed from "../components/ResourceFeed.tsx";

interface ArticleFeedProps {
  filteredTag?: string;
  count: number;
}

/**
 * Component rendering a feed of Articles.
 * Is basically a ResourceFeed using an ArticleList presentational component.
 * @param {Object} props Properties. See ResourceList.
 */
const ArticleFeed = (props: ArticleFeedProps) => (
  <ResourceFeed
    {...props}
    resourcesUrl="/generated-content/articles.json"
    title="Articles"
    ResourceFeedDisplayComp={ArticleList}
  />
);

type ArticleListProps = Omit<ResourceListProps, "defaultThumbnailClass">;

const ArticleList = (props: ArticleListProps) => (
  <ResourceList {...props} defaultThumbnailClass="fa-bookmark" />
);

export default ArticleFeed;
