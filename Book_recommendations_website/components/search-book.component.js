import React, { useEffect, useState } from 'react'
import axios from 'axios';
import empty_image from '../images/no_thumbnail_image.png';

// localStorage allows users to save data as key-value pairs in the browser
// it does not clear data when the browser closes. 
const Search = () => {
	const [book, setBook] = useState("");
	const [result, setResult] = useState([]);
	const [apiKey, setKey] = useState("AIzaSyCtUBDKxkq5eTNk_M3myXAY_9nTqDU_uZ0")
	
	function handleChange(event) {
		const book = event.target.value;
		setBook(book)
		
	}

	function handleSubmit(event) {
		event.preventDefault();
		console.log(book);  
		axios.get("https://www.googleapis.com/books/v1/volumes?q="+book+"&&maxResults=10")
		.then(data=> {
			console.log(data.data.items)
			setResult(data.data.items);

		})
	}
	
	
    useEffect(() => {
    }, [])


	return (
		<div>
			<h1>Book Search</h1>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<div className="form-group">
						<input type="text"
							className="form-control mt-10"
							onChange={handleChange}
							placeholder='Search for Books'

						/>
					</div>
					<button type="submit" 
						className="btn btn-danger">Search</button>	
				</div>

			</form>
			{/* <img src={empty_image} alt="temp" /> */}
			{/* <img src="http://books.google.com/books/content?id=KgUJmQYEm9wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" alt="image"/> */}
			{result.map( (book) => {
				// console.log(book)
				return (

					<div key={book.id}>
						{/* ("https"+book.volumeInfo.imageLinks.thumbnail.substr(4)) */}
						<a target="_blank" href={book.volumeInfo.previewLink}>
						<img src={book.volumeInfo.imageLinks === undefined || book.volumeInfo.imageLinks === undefined? (empty_image) : ("https"+book.volumeInfo.imageLinks.thumbnail.substr(4)) } alt={book.id}/>
						</a>
					</div>
					
					
				)
				
			})}
		</div>
	)

	

}

export default Search