
// import { useState } from 'react'
// import { RiEditLine, RiDeleteBin2Line } from 'react-icons/ri'
import empty_image from '../images/no_thumbnail_image.png';


// book_isbn13, book_title, book_author, book_image, book_description
const BookRecommended = ({ book }) => {



    return (
        // book_isbn13, book_title, book_author, book_image, book_description

        <div className="one-book-rec-section">
            <span className="book-title">{book.title}</span>
            <span className="book-author"> by {book.author}</span>

            <img src={book.book_image === undefined ? (empty_image) : (book.book_image)} alt={book.title} />
            <div className="book-description">
                {book.description}
            </div>
        </div>


    );


}

export default BookRecommended;
