import React, { useEffect, useState } from 'react'
import { redirect } from "react-router-dom";
import jwt from 'jsonwebtoken'
import axios from 'axios';

import BookRecommended from './book-recommended.component'



// localStorage allows users to save data as key-value pairs in the browser
// it does not clear data when the browser closes. 
const MainPage = () => {
	// const [quote, setQuote] = useState('')
	// const [tempQuote, setTempQuote] = useState('')
	const [error, setError] = useState(null);
	const [result, setResult] = useState([]);
	// const [apiKey, setKey] = useState("AIzaSyCtUBDKxkq5eTNk_M3myXAY_9nTqDU_uZ0")
	// const [booksUnder200, setBooksUnder200] = useState([])
	// const [keyAray, setKeyArray] = useState([])
	const nytApiKey= "qAjQ0BuqOG45v3nWbro4YDSpjhoY0vaK"
	const [isInitialLoading, setIsInitialLoading] = useState(true)
	const schedule = require('node-schedule')
	// async function fillQuote() {
	// 	const req = await fetch('http://localhost:5000/backend/main', {
	// 		headers: {
	// 			'x-access-token': localStorage.getItem('jwtToken'),
	// 		},

	// 	})

	// 	const data = await req.json()
	// 	console.log("fetch Quote data: ", data)
	// 	if (data.status === 'ok') {
	// 		setQuote(data.quote)
	// 	}
	// 	else {
	// 		alert(data.error)
	// 	}
	// }

	// async function updateQuote(event) {
	// 	event.preventDefault()

	// 	const req = await fetch('http://localhost:5000/backend/main', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'x-access-token': localStorage.getItem('jwtToken'),
	// 		},
	// 		body: JSON.stringify({
	// 			quote: tempQuote,
	// 		}),
	// 	})

	// 	const data = await req.json()
	// 	console.log("update quote data: ", data)
	// 	if (data.status === 'ok') {
	// 		setQuote(tempQuote)
	// 		setTempQuote('')
	// 	} else {
	// 		alert(data.error)
	// 	}
	// }

	
	

	async function fetchBestsellers() {
		try {
			// let date = new Date()
			// let count = 0
			// var resultArray = []
			// let formatedDate = moment(date.setDate(date.getDate() - (8 * count))).format('YYYY-MM-DD');
			// console.log("date: ", formatedDate)
			const res = await axios.get("https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key="+nytApiKey)
			
			 res.data.results.books.map((book) => {
					// console.log(book)
					var ISBN_13 = book.primary_isbn13
					// setKeyArray(keyAray => [...keyAray, ISBN_13])
									
					
					axios.get("https://www.googleapis.com/books/v1/volumes?q="+ISBN_13+"&maxResults=1")
							.then(data => {
								// console.log(data.data.items[0].volumeInfo.pageCount)
								if (data.data.items[0].volumeInfo === undefined || data.data.items[0].volumeInfo.pageCount === undefined) {
									book["pageCount"] = "N/A"
								}
								else {
									book["pageCount"] = String(data.data.items[0].volumeInfo.pageCount)
								}
							})
					
					return res.data.results.books
	
				})
			
			localStorage.setItem('todayBookRec', JSON.stringify(res.data.results.books))
			setResult(res.data.results.books);
			setError(null)
		}
		catch (err) {
			setError(err)
			console.log("fetchBestsellers error: ", err)
		}

	}
	useEffect(() => {
		const token = localStorage.getItem('jwtToken')
		// console.log("token: ", token)
		if (token) {
			const user = jwt.decode(token)
			// console.log(user)
			// if somethings goes wrong with user, redirect to login page. 
			if (!user) {
				localStorage.removeItem('jwtToken')
				return redirect("/login")
			}
			
		}
		
			async function displayStoredBookRec() {
				if (localStorage.getItem('todayBookRec') === undefined){
					fetchBestsellers()
				}
				else {
					let currentTodayRec = JSON.parse(localStorage.getItem('todayBookRec'))
				
					setResult(currentTodayRec);
				}
				
			}
			
			displayStoredBookRec()
			if (isInitialLoading) {
				fetchBestsellers()
				setIsInitialLoading(false)
			}
			// the book rec section gets updated every day based on NY Times best seller

			schedule.scheduleJob('0 0 * * *', () => {
				let date = new Date() 
				console.log(date)
				fetchBestsellers();
			});
	  
			// const timer1 = setTimeout(() => {

				
			// }, 2000);
			// const timer2 = setTimeout(() => {

			// 	temp();
			// }, 2000);

			// console.log("result: ", result)
		
	},[isInitialLoading, schedule])

	return (
		<div>
		   
  
			<span className="page-title" id="page_title">Today's Top Picks</span>
			<p id="intro_paragraph">
				If you were wondering what book should you read next, we've got you covered.
				This is a list of New York Time bestsellers that are great for
				people who want to explore new novels.
			</p>
  
			<div>{error}</div>

			
			<section className='today-book-section'>
				<div className='today-book-grid'>
					{result ? (result.map((book_recommended) => {
					   
						return (
							// book_isbn13, book_title, book_author, book_image, book_description
							<div className="book-rec-section" key={book_recommended.primary_isbn13}>
  
								<BookRecommended
									book={book_recommended}
  
								/>
							</div>
						)
  
					})) : ("No Entries Found")}
				</div>
			</section>
  
  
		</div>
	)



}


export default MainPage