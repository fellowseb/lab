import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { A, P, Ul } from '../components/BaseStyledComponents.jsx';

const BookCarouselContainer = styled.div `
    background: #c1b79a;
    border: 1px solid #b0a78c;
    padding: 10px;
`

const BookCarouselList = styled(Ul) `
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    margin: 0;
    padding: 0;
`

/**
 * Presentational component rendering books in a carousel.
 * @param {object} props Properties.
 * @param {FellowsebLabResource[]} props.resources Book resources to display.
 * @param {string} props.apiUrl FellowsebLab api URL.
 */
const BookCarousel = ({ resources = [], apiUrl = "" }) =>
    <BookCarouselContainer>
        {renderBooks(resources, apiUrl)}
    </BookCarouselContainer>;

BookCarousel.propTypes = {
    resources: PropTypes.array,
    apiUrl: PropTypes.string
};

const renderBooks = (books, apiUrl) =>
  <BookCarouselList>
    {
      books.map(book => renderBook(book, apiUrl))
    }
  </BookCarouselList>;

const BookCarouselItemAuthors = styled(P) `
    font-size: 60%;
`

const BookCarouselItem = styled.li `
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
`

const BookCarouselItemOverlay = styled(A) `
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
`

const BookCarouselItemDesc = styled.div `
    height: 100%;
    display:none;
`

const BookCarouselItemTitle = styled(P) `
    font-size: 80%;
    text-decoration: underline;
    max-height: 6em;
    overflow: hidden;
`

const BookCarouselItemImg = styled.img `
  width: 100%;
  height: 100%;
`

const BookCarouselItemTags = styled(Ul) `
  font-size: 70%;
  display: flex;
  flex-direction: row;
  list-style: none;
  margin: 3px 0;
  padding: 0;
  flex-wrap: wrap;
`

const BookCarouselItemTag = styled.li `
  margin: 0 0.5em 0 0;
  padding: 0 4px 0 4px;
  color: #333333;
  background: #edc711;
`

const renderBook = (book, apiUrl) => {
    const authorsStr = book.authors && book.authors.length
        ? <BookCarouselItemAuthors>by {book.authors[0]}</BookCarouselItemAuthors>
        : null;
    const thumbnailURL = book.thumbnailHREF
        ? apiUrl + book.thumbnailHREF
        : '/images/nothumbnail';
    let refs = {
        contElem: null
    };
    return (
        <BookCarouselItem key={book.resourceId}>
            <BookCarouselItemOverlay href={book.url} target="_blank" rel="noopener"
                ref={elem => { refs.contElem = elem; }}>
                <BookCarouselItemDesc>
                    <BookCarouselItemTitle>{book.title}</BookCarouselItemTitle>
                    {authorsStr}
                    <BookCarouselItemTags>
                        {book.tags ? book.tags.map((tag, tagIndex) =>
                          <BookCarouselItemTag key={tagIndex}>{tag}</BookCarouselItemTag>) : null}
                    </BookCarouselItemTags>
                </BookCarouselItemDesc>
                <picture>
                    <source srcSet={thumbnailURL + '?type=.webp'} type='image/webp' />
                    <source srcSet={thumbnailURL + '?type=.jp2'} type='image/jp2' />
                    <BookCarouselItemImg src={thumbnailURL + '?type=.png'} />
                </picture>
            </BookCarouselItemOverlay>
        </BookCarouselItem>
    );
};

module.exports = BookCarousel;
