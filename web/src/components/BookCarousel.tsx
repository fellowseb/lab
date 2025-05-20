import { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import { A, P, Ul } from "../components/BaseStyledComponents.tsx";
import type { ResourceListProps } from "./ResourceList.tsx";
import type { ResourceModel } from "./types.ts";

const BookCarouselContainer = styled.div`
  background: #c1b79a;
  border: 1px solid #b0a78c;
  padding: 10px;
`;

const BookCarouselList = styled(Ul)`
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0;
  padding: 0;
  align-items: flex-start;
  contain: inline-size;
  scrollbar-color: #5d5a52 #c1b79a;
`;

type BookCarouselProps = Omit<ResourceListProps, "defaultThumbnailClass">;

/**
 * Presentational component rendering books in a carousel.
 */
const BookCarousel = ({ resources = [] }: BookCarouselProps) => (
  <BookCarouselContainer>
    <BookCarouselList>
      {resources.map((book) => (
        <BookCarouselItem book={book} key={book.resourceId} />
      ))}
    </BookCarouselList>
  </BookCarouselContainer>
);

const BookCarouselItemAuthors = styled(P)`
  font-size: 60%;
`;

const StyledBookCarouselItem = styled.li`
  list-style: none;
  display: block;
  height: 180px;
  background: #333333;
  color: #ddd;
  padding: 4px;
  flex: 0 0 140px;
  margin-right: 2px;
  margin-left: 2px;
  max-width: 140px;
  overflow: hidden;
`;

const BookCarouselItemOverlay = styled(A)`
  text-decoration: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const BookCarouselItemDesc = styled.div<{
  $show: boolean;
}>`
  height: 100%;
  display: ${(props) => (props.$show ? "block" : "none")};
`;

const BookCarouselItemTitle = styled(P)`
  font-size: 80%;
  text-decoration: underline;
  max-height: 6em;
  overflow: hidden;
`;

const BookCarouselItemImg = styled.img<{
  $show: boolean;
}>`
  width: 100%;
  height: 100%;
  display: ${(props) => (props.$show ? "block" : "none")};
`;

const BookCarouselItemTags = styled(Ul)`
  font-size: 70%;
  display: flex;
  flex-direction: row;
  list-style: none;
  margin: 3px 0;
  padding: 0;
  flex-wrap: wrap;
`;

const BookCarouselItemTag = styled.li`
  margin: 0 0.5em 0 0;
  padding: 0 4px 0 4px;
  color: #333333;
  background: #edc711;
`;

interface BookCarouselItemState {
  hovered: boolean;
}

interface BookCarouselItemProps {
  book: ResourceModel;
}

const BookCarouselItem = (props: BookCarouselItemProps) => {
  const [state, setState] = useState<BookCarouselItemState>({
    hovered: false,
  });
  const onMouseEnter = useCallback(() => {
    setState({ hovered: true });
  }, []);
  const onMouseLeave = useCallback(() => {
    setState({ hovered: false });
  }, []);
  const { book } = props;
  const { hovered } = state;
  const authorsStr =
    book.authors && book.authors.length ? (
      <BookCarouselItemAuthors>by {book.authors[0]}</BookCarouselItemAuthors>
    ) : null;
  const thumbnailURL = book.thumbnailHREF ?? "/images/nothumbnail";
  const containerRef = useRef(null);
  return (
    <StyledBookCarouselItem>
      <BookCarouselItemOverlay
        href={book.url}
        target="_blank"
        rel="noopener"
        ref={containerRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <BookCarouselItemDesc $show={hovered}>
          <BookCarouselItemTitle>{book.title}</BookCarouselItemTitle>
          {authorsStr}
          <BookCarouselItemTags>
            {book.tags
              ? book.tags.map((tag, tagIndex) => (
                  <BookCarouselItemTag key={tagIndex}>
                    {tag}
                  </BookCarouselItemTag>
                ))
              : null}
          </BookCarouselItemTags>
        </BookCarouselItemDesc>
        <picture>
          <BookCarouselItemImg src={thumbnailURL} $show={!hovered} />
        </picture>
      </BookCarouselItemOverlay>
    </StyledBookCarouselItem>
  );
};

export default BookCarousel;
