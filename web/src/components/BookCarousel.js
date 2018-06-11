import React from 'react';
import PropTypes from 'prop-types';

/**
 * Presentational component rendering books in a carousel.
 * @param {object} props Properties.
 * @param {FellowsebLabResource[]} props.resources Book resources to display.
 * @param {string} props.apiUrl FellowsebLab api URL.
 */
const BookCarousel = ({ resources = [], apiUrl = "" }) =>
    <div className='bookcarousel-container'>
        {renderBooks(resources, apiUrl)}
    </div>;

BookCarousel.propTypes = {
    resources: PropTypes.array,
    apiUrl: PropTypes.string
};

const renderBooks = (books, apiUrl) => {
    return <ul className='bookcarousel-list'>
        {
            books.map(book => renderBook(book, apiUrl))
        }
    </ul>;
};

const renderBook = (book, apiUrl) => {
    const authorsStr = book.authors && book.authors.length
        ? <p className='bookcarousel-item-authors'>by {book.authors[0]}</p>
        : null;
    const thumbnailURL = book.thumbnailHREF
        ? apiUrl + book.thumbnailHREF
        : '/images/nothumbnail';
    let refs = {
        contElem: null
    };
    return (
        <li key={book.resourceId}
            className='bookcarousel-item'>
            <a className='bookcarousel-item-overlay' href={book.url} target="_blank" rel="noopener"
                onMouseLeave={onMouseLeaveItem.bind(null, refs)} ref={elem => { refs.contElem = elem; }}>
                <div className='bookcarousel-item-desc nodisplay'>
                    <p className='bookcarousel-item-title'>{book.title}</p>
                    {authorsStr}
                    <ul className="article-tags">
                        {book.tags ? book.tags.map((tag, tagIndex) => <li key={tagIndex}>{tag}</li>) : null}
                    </ul>
                </div>
                <picture className='bookcarousel-item-thumbnail' onMouseEnter={onMouseEnterItem.bind(null, refs)}>
                    <source srcSet={thumbnailURL + '?type=.webp'} type='image/webp' />
                    <source srcSet={thumbnailURL + '?type=.jp2'} type='image/jp2' />
                    <img src={thumbnailURL + '?type=.png'} />
                </picture>
            </a>
        </li>
    );
};

const onMouseLeaveItem = ({ contElem }, event) => {
    var descElem = contElem.querySelector('.bookcarousel-item-desc');
    descElem.classList.add('nodisplay');
    var thumbnailElem = contElem.querySelector('.bookcarousel-item-thumbnail');
    thumbnailElem.classList.remove('nodisplay');
    event.stopPropagation();
};

const onMouseEnterItem = ({ contElem }, event) => {
    var descElem = contElem.querySelector('.bookcarousel-item-desc');
    descElem.classList.remove('nodisplay');
    var thumbnailElem = contElem.querySelector('.bookcarousel-item-thumbnail');
    thumbnailElem.classList.add('nodisplay');
    event.stopPropagation();
};

module.exports = BookCarousel;
