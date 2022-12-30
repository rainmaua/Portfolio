import React from 'react'; 
// import banner_image from '../images/book_illustration.png';




const Banner = () => {
    return(
        <header>
            <div className="banner">
                <h1>Book Recommendations</h1>
                {/* <img className="banner-image" src={banner_image} alt="banner image"/> */}
                <p>"If you don’t like to read, you haven’t found the right book." – J.K. Rowling</p>
            </div>
        </header>
    )
}

export default Banner