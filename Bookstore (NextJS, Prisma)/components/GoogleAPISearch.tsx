import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import empty_image from "../images/no_thumbnail_image.png";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";

interface isbnData {
  type: string;
  identifier: string;
}
// localStorage allows users to save data as key-value pairs in the browser
// it does not clear data when the browser closes.
export default function GoogleAPISearch({ setBookISBN, setBookTitle }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [category, setCategory] = useState("");
  const [ISBN10, setISBN10] = useState<any>("");
  const [isChecked, setIsChecked] = useState(false);
  const checkboxesRef = useRef([]);
  const ref = useRef();

  //   useEffect(() => {
  //     function handleCheckbox(oneBookISBN) {
  //       setIsChecked(!isChecked);
  //       console.log("selected book isbn: ", oneBookISBN);
  //       setBookISBN(oneBookISBN);
  //     }
  //   }, []);
  useEffect(() => {
    let circularProgress = document.querySelectorAll("#myCheckBox");
    circularProgress.forEach((a) => {
      console.log("a: ", a);
    });
    console.log("useEffect: ", circularProgress);
    // checkboxesRef.current = document.querySelectorAll("#my-checkbox");
  }, []);

  function handleChange(event) {
    const query = event.target.value;
    setQuery(query);
  }

  function handleCategory(event) {
    console.log("category: ", event.target.value);
    if (event.target.value === "general") {
      setCategory("");
    } else {
      setCategory(event.target.value);
    }
  }

  function handleCheckbox(oneBookISBN, oneBookTitle, oneBookId) {
    console.log("selected book isbn: ", oneBookISBN);
    setBookISBN(oneBookISBN);
    setBookTitle(oneBookTitle);
    var myCheckbox = ref.current; //document.querySelector("#myCheckBox"); // ref.current; //document.getElementsByName("myCheckbox");
    console.log("ref: ", ref[0]);
    let circularProgress = document.querySelectorAll("input[name=myCheckBox]");

    console.log("myCheckbox: ", myCheckbox);
    console.log("d: ", circularProgress);

    Array.prototype.forEach.call(circularProgress, function (el) {
      if (el.id != oneBookId) {
        console.log("el: ", el.id);
        el.checked = false;
      }
    });
    setIsChecked(isChecked);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(query);
    // axios.defaults.withCredentials = true;
    // Search for author: https://www.googleapis.com/books/v1/volumes?q=inauthor:keyes
    // Search for title: https://www.googleapis.com/books/v1/volumes?q=intitler:keyes
    axios
      .get(
        "https://www.googleapis.com/books/v1/volumes?q=" +
          category +
          query +
          "&&maxResults=10",
        {
          // withCredentials: true,
          headers: {
            // "Access-Control-Allow-Origin": "*",
            // "Set-Cookie": "SameSite=None; Secure"
            // "Set-Cookie": "SameSite=Strict"
            // "Access-Control-Request-Method": "GET, HEAD, OPTIONS",
            // "Access-Control-Allow-Credentials": "true"
          },
          responseType: "json",
        }
      )
      .then((data) => {
        console.log(data.data.items);
        setResult(data.data.items);
      });
  }

  useEffect(() => {}, []);

  return (
    <div>
      <div className="page-title">Search and select the book to sell</div>
      <form onSubmit={handleSubmit}>
        <div className="">
          <select
            className="select-box h-10 px-2 border border-solid border-black bg-customLogoColor"
            id="cars"
            onChange={handleCategory}
          >
            <option value="general">General</option>
            <option value="intitle:">Title</option>
            <option value="isbn:">ISBN</option>
            <option value="inauthor:">Author</option>
          </select>
          <input
            type="text"
            className="form-control p-2 mt-10 h-10 border border-solid border-black"
            onChange={handleChange}
            placeholder="Search for Books"
          />

          <button
            className="px-2  h-10 pb-[5px] border border-solid border-black bg-white"
            type="submit"
          >
            <FaSearch className="top-3" color="black" title="search_button" />
          </button>
        </div>
      </form>
      {/* <img src={empty_image} alt="temp" /> */}
      {/* <img src="http://books.google.com/books/content?id=KgUJmQYEm9wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" alt="image"/> */}
      <div className="book-list">
        <div className="pt-10 grid  place-content-center grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-x-12 gap-y-20 max-w-7xl mx-auto px-10  ">
          {/* <div className="book-div"> */}
          {result
            ? result.map((book, index) => {
                console.log("key: ", index);
                return (
                  <div className="" key={index}>
                    <form className="flex items-center">
                      <input
                        type="checkbox"
                        id={book.id}
                        defaultChecked={isChecked}
                        name="myCheckBox"
                        //   id="myCheckBox"
                        ref={ref}
                        // w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600
                        className="text-blue-600 bg-gray-100 border-gray-300 flex h-5 w-5 my-2 items-center justify-center rounded radix-state-checked:bg-purple-600 radix-state-unchecked:bg-gray-100 dark:radix-state-unchecked:bg-gray-900 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                        onChange={() =>
                          handleCheckbox(
                            book.volumeInfo.industryIdentifiers[0].identifier,
                            book.volumeInfo.title,
                            book.id
                          )
                        }
                      />
                    </form>
                    <div className="bg-white w-fit  p-2 rounded-lg h-48 mb-2 hover:shadow-[0_5px_15px_-0px_rgba(0,0,0,0.15)]">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={
                          book.volumeInfo.previewLink === undefined
                            ? "#"
                            : book.volumeInfo.previewLink
                        }
                      >
                        <Image
                          src={
                            book.volumeInfo.imageLinks === undefined ||
                            book.volumeInfo.imageLinks === undefined
                              ? empty_image
                              : book.volumeInfo.imageLinks.thumbnail
                          }
                          alt={book.volumeInfo.title}
                          height={100}
                          width={110}
                        />
                      </a>
                    </div>
                    <div className="one-book-info-container">
                      <div className="one-book-title-container">
                        {/* <span className='text-capitalize fw-7'>Title: </span> */}
                        <span className="one-book-title-input font-semibold">
                          {book.volumeInfo.title === undefined
                            ? "N/A"
                            : book.volumeInfo.title.slice(0, 60)}
                          {book.volumeInfo.title &&
                          book.volumeInfo.title.length > 60
                            ? "..."
                            : ""}
                        </span>
                      </div>

                      <div className="one-book-author-container">
                        <span className="one-book-author-label">Author: </span>
                        <span className="one-book-author-input">
                          {book.volumeInfo.authors === undefined
                            ? "N/A"
                            : book.volumeInfo.authors.join(", ")}
                          {/* {book.volumeInfo.authors.join(", ").length > 120 ? ("...") : ("")} */}
                        </span>
                      </div>

                      <div className="one-book-pages-container">
                        <span className="one-book-pages-input">
                          {book.volumeInfo.industryIdentifiers === undefined ||
                          book.volumeInfo.industryIdentifiers[0] ===
                            undefined ||
                          book.volumeInfo.industryIdentifiers[0].identifier ===
                            undefined
                            ? "N/A"
                            : book.volumeInfo.industryIdentifiers
                                .sort((a, b) => {
                                  // isbn array is unordered, so sort the array first.
                                  if (a.identifier > b.identifier) {
                                    return -1;
                                  }
                                  return 0;
                                })
                                .map(
                                  (isbn: {
                                    type: string;
                                    identifier: string;
                                  }) => {
                                    if (isbn.type == "ISBN_13") {
                                      console.log("isbn13: ", isbn.identifier);
                                      return (
                                        <div key={isbn.identifier}>
                                          ISBN13: {isbn.identifier}
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div key={isbn.identifier}>
                                          ISBN10: {isbn.identifier}
                                        </div>
                                      );
                                    }
                                  }
                                )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            : "No entries found"}
        </div>
      </div>
    </div>
  );
}
