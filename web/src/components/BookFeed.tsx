import BookCarousel from "../components/BookCarousel.tsx";
import ResourceFeed from "../components/ResourceFeed.tsx";

interface BookFeedProps {
  apiUrl: string;
  filteredTag?: string;
  count: number;
}

/**
 * Component displaying Fellowseb's lab books in a carousel.
 * Is basically a ResourceFeed with a BookCarousel component for the presentation.
 */
const BookFeed = (props: BookFeedProps) => (
  <ResourceFeed
    {...props}
    apiEndpoint="/books"
    title="Books"
    ResourceFeedDisplayComp={BookCarousel}
  />
);

export default BookFeed;
