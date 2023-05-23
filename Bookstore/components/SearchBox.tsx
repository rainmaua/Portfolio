import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  // const [apiKey, setKey] = useState("AIzaSyCtUBDKxkq5eTNk_M3myXAY_9nTqDU_uZ0")

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

  function handleSubmit(event) {
    event.preventDefault();
    console.log(query);
    // axios.defaults.withCredentials = true;
    // Search for author: https://www.googleapis.com/books/v1/volumes?q=inauthor:keyes
    // Search for title: https://www.googleapis.com/books/v1/volumes?q=intitler:keyes
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="search-bar-section">
          <select className="select-box" id="cars" onChange={handleCategory}>
            <option value="general">General</option>
            <option value="intitle:">Title</option>
            <option value="inauthor:">Author</option>
          </select>

          <input
            type="text"
            placeholder="Search for Books"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <button type="submit">
            <FaSearch size={"1.3em"} color="white" title="search_button" />
          </button>
        </div>
      </form>
    </div>
  );
}
