import BookCarousel from "../components/BookCarousel.tsx";
import ResourceFeed from "../components/ResourceFeed.tsx";

interface BookFeedProps {
  filteredTag?: string;
}

/**
 * Component displaying Fellowseb's lab books in a carousel.
 * Is basically a ResourceFeed with a BookCarousel component for the presentation.
 */
const BookFeed = (props: BookFeedProps) => (
  <ResourceFeed
    {...props}
    resourcesUrl="/content/books.json"
    title="Books"
    ResourceFeedDisplayComp={BookCarousel}
  />
);

export default BookFeed;
