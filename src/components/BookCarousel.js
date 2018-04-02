import React from 'react';
import PropTypes from 'prop-types';

const BookCarousel = ({resources = []}) =>
    <div className='bookcarousel-container'>
        {renderBooks(resources)}
    </div>;

BookCarousel.propTypes = {
    resources: PropTypes.array
};

const renderBooks = (books) =>
    <ul className='bookcarousel-list'>
        {
            books.map((book) =>
                <li key={book.resourceId}
                    className='bookcarousel-item'>book</li>)
        }
    </ul>;

module.exports = BookCarousel;
