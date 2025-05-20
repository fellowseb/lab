import ResourceList, { type ResourceListProps } from "./ResourceList.tsx";
import ResourceFeed from "./ResourceFeed.tsx";

interface TalkFeedProps {
  filteredTag?: string;
  count: number;
}

/**
 * Component displaying a feed of Talk resources.
 * Is basically a ResourceFeed using ResourceList as
 * a presentational component.
 */
const TalkFeed = (props: TalkFeedProps) => (
  <ResourceFeed
    {...props}
    resourcesUrl="/generated-content/talks.json"
    title="Talks"
    ResourceFeedDisplayComp={TalkList}
  />
);

type TalkListProps = Omit<ResourceListProps, "defaultThumbnailClass">;

const TalkList = (props: TalkListProps) => (
  <ResourceList {...props} defaultThumbnailClass="fa-headphones" />
);

export default TalkFeed;
