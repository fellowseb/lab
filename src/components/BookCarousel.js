import React from 'react';
import PropTypes from 'prop-types';

const BookCarousel = ({ resources = [] }) =>
    <div className='bookcarousel-container'>
        {renderBooks(resources)}
    </div>;

BookCarousel.propTypes = {
    resources: PropTypes.array
};

const renderBooks = (books) => {
    const apiUrl = FELLOWSEBLAB_API_URL;
    return <ul className='bookcarousel-list'>
        {
            books.map((book) => {
                const authorsStr = book.authors && book.authors.length
                    ? <p className='bookcarousel-item-authors'>by {book.authors[0]}</p>
                    : null;
                const thumbnailURL = book.thumbnailHREF
                    ? apiUrl + book.thumbnailHREF
                    : '/images/nothumbnail';
                const thumbnailURLPNG = thumbnailURL + '?type=.png';
                const thumbnailURLWebP = thumbnailURL + '?type=.webp';
                const thumbnailURLJP2 = thumbnailURL + '?type=.jp2';
                let contElem = null;
                const onMouseLeaveItem = event => {
                    var descElem = contElem.querySelector('.bookcarousel-item-desc');
                    descElem.classList.add('nodisplay');
                    var thumbnailElem = contElem.querySelector('.bookcarousel-item-thumbnail');
                    thumbnailElem.classList.remove('nodisplay');
                    event.stopPropagation();
                };
                const onMouseEnterItem = event => {
                    var descElem = contElem.querySelector('.bookcarousel-item-desc');
                    descElem.classList.remove('nodisplay');
                    var thumbnailElem = contElem.querySelector('.bookcarousel-item-thumbnail');
                    thumbnailElem.classList.add('nodisplay');
                    event.stopPropagation();
                };
                return <li key={book.resourceId}
                    className='bookcarousel-item'>
                    <a className='bookcarousel-item-overlay' href={book.url} target="_blank" rel="noopener" onMouseLeave={onMouseLeaveItem} ref={elem => { contElem = elem; }}>
                        <div className='bookcarousel-item-desc nodisplay'>
                            <p className='bookcarousel-item-title'>{book.title}</p>
                            {authorsStr}
                            <ul className="article-tags">
                                {book.tags.map((tag, tagIndex) => <li key={tagIndex}>{tag}</li>)}
                            </ul>
                        </div>
                        <picture className='bookcarousel-item-thumbnail' onMouseEnter={onMouseEnterItem}>
                            <source srcSet={thumbnailURLWebP} type='image/webp'/>
                            <source srcSet={thumbnailURLJP2} type='image/jp2'/>
                            <img src={thumbnailURLPNG} />
                        </picture>
                    </a>
                </li>;
            })
        }
    </ul>;
};

module.exports = BookCarousel;
