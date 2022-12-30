import React, { useEffect, useState } from 'react'
import axios from 'axios';
import "./book-searched.component";

import BookSearched from './book-searched.component';
import {FaSearch} from "react-icons/fa";

// localStorage allows users to save data as key-value pairs in the browser
// it does not clear data when the browser closes. 
const Search = () => {
	const [query, setQuery] = useState("");
	const [result, setResult] = useState([]);
	const [category, setCategory] = useState("");

	// const [apiKey, setKey] = useState("AIzaSyCtUBDKxkq5eTNk_M3myXAY_9nTqDU_uZ0")

	function handleChange(event) {
		const query = event.target.value;
		setQuery(query)

	}

	function handleCategory(event) {
		console.log("category: ", event.target.value)
		if (event.target.value === "general") {
			setCategory("")
		}
		else {
			setCategory(event.target.value)
		}


	}

	function handleSubmit(event) {
		event.preventDefault();
		console.log(query);
		// axios.defaults.withCredentials = true;
		// Search for author: https://www.googleapis.com/books/v1/volumes?q=inauthor:keyes
		// Search for title: https://www.googleapis.com/books/v1/volumes?q=intitler:keyes
		axios.get("https://www.googleapis.com/books/v1/volumes?q=" + category + query + "&&maxResults=10", {
			// withCredentials: true,
			headers: {
				// "Access-Control-Allow-Origin": "*",
				// "Set-Cookie": "SameSite=None; Secure"
				// "Set-Cookie": "SameSite=Strict"
				// "Access-Control-Request-Method": "GET, HEAD, OPTIONS",
				// "Access-Control-Allow-Credentials": "true"
			},
			responseType: "json",
		})
			.then(data => {
				console.log(data.data.items)
				setResult(data.data.items);

			})
	}

	useEffect(() => {
	}, [])


	return (
		<div>
			<div className='page-title'>Book Search</div>
			<form onSubmit={handleSubmit}>
				<div className="search-bar-section">
						<select className="select-box" id="cars" onChange={handleCategory}>
							<option value="general">General</option>
							<option value="intitle:">Title</option>
							<option value="inauthor:">Author</option>
						</select>
						<input type="text"
							className="form-control mt-10"
							onChange={handleChange}
							placeholder='Search for Books'

						/>

					
					<button className="search-btn" classtype="submit" ><FaSearch size={"1.3em"} color="white" title="search_button" /></button>
				</div>

			</form>
			{/* <img src={empty_image} alt="temp" /> */}
			{/* <img src="http://books.google.com/books/content?id=KgUJmQYEm9wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" alt="image"/> */}
			<div className='book-list'>
				<div className="book-section">
					{/* <div className="book-div"> */}
					{result  ? (result.map((book_searched) => {
						return (


							<div className="book-grid" key={book_searched.id}>
								<BookSearched
									book={book_searched}
								/>

							</div>

						)

					})) : ("No entries found")}

				</div>
			</div>
			

		</div>
	)



}

export default Search 
