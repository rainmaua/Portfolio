
// import { useState } from 'react'
// import { RiEditLine, RiDeleteBin2Line } from 'react-icons/ri'
import empty_image from '../images/no_thumbnail_image.png';
import React, { useEffect } from 'react';


// book_isbn13, book_title, book_author, book_image, book_description
const BookSearched = ({ book }) => {
    useEffect(() => {
        // console.log(book)
    }, [])





    return (
        // book_id, book_title, book_author, book_preview_link, book_image_link, book_thumbnail_link, book_page_count 

        // <div className="writing-section" key={book_isbn13}>
        //     <span className="book-title">{book_title}</span>
        //     <span className="book-author"> by {book_author}</span>
        //     <br />
        //     <img src={book_image === undefined ? (empty_image) : (book_image)} alt={book_title} />
        //     <div className="book-description">
        //         {book_description}
        //     </div>


        // </div>
        <div className="one-book-container">
            <div className='one-book-image-container'>
                <a target="_blank" rel="noreferrer" href={book.volumeInfo.previewLink === undefined ? ("#") : (book.volumeInfo.previewLink)}>
                    <img src={book.volumeInfo.imageLinks === undefined || book.volumeInfo.imageLinks === undefined ? (empty_image) : ("https" + book.volumeInfo.imageLinks.thumbnail.substr(4))} alt={book.volumeInfo.title} />
                </a>
            </div>
            <div className='one-book-info-container'>
                <div className='one-book-title-container'>
                    {/* <span className='text-capitalize fw-7'>Title: </span> */}
                    <span className="one-book-title-input">
                        {book.volumeInfo.title === undefined ? ("N/A") : (book.volumeInfo.title.slice(0, 60))}
                        {book.volumeInfo.title && book.volumeInfo.title.length > 60 ? ("...") : ("")}
                    </span>
                </div>

                <div className='one-book-author-container'>
                    <span className='one-book-author-label'>Author: </span>
                    <span className="one-book-author-input">
                        {book.volumeInfo.authors === undefined ? ("N/A") : (book.volumeInfo.authors.join(", "))}
                        {/* {book.volumeInfo.authors.join(", ").length > 120 ? ("...") : ("")} */}
                    </span>
                </div>

                <div className='one-book-pages-container'>
                    <span className='one-book-pages-label'>Pages: </span>
                    <span className='one-book-pages-input'>{book.volumeInfo.pageCount === undefined ? ("N/A") : (book.volumeInfo.pageCount)}</span>
                </div>
                <div className='one-book-description-container'>
                    <span className='one-book-description-input'>
                        {book.volumeInfo.description === undefined ? ("N/A") : (book.volumeInfo.description.slice(0, 300))}
                        {book.volumeInfo.description && book.volumeInfo.description.length > 300 ? ("...") : ("")}
                    </span>

                </div>
            </div>



            {/* </div> */}

            {/* </div> */}

        </div>


    );


}

export default BookSearched;