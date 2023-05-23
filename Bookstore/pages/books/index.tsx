import Layout from "../../components/SiteLayout";
import styles from "../../styles/Home.module.css";
import React, { useState } from "react";
import Link from "next/link";
import Head from "../../components/Head";
import Heading1 from "../../components/Heading1";
import ProductItem from "../../components/ProductItem";
import banner_image from "../../images/library.jpg";
import Image from "next/image";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await fetch(
      "/api/book/by-title?title=" +
        JSON.stringify({ title })
          .split(":")[1]
          .replace('"', "")
          .replace('"}', ""),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(response.statusText);
      throw new Error(response.statusText);
    } else {
      const data = await response.json();
      console.log("searched data: ", data);
      setBooks(data);
      setMessage("We couldn't find a match.");
    }
  };

  return (
    <>
      <div className="absolute top-[60px] py-44 left-0 w-full bg-neutral-50 px-6 py-20 text-center text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
        <Image
          className="opacity-40"
          src={banner_image}
          layout="fill"
          objectFit="cover"
          alt="Banner Image"
          priority={true}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="mb-6 text-4xl font-bold">Search Books</h1>
          <form className=" " onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter a Book Title"
              value={title}
              className="rounded p-1 border border-black"
              onChange={(event) => setTitle(event.target.value)}
            />
            <button
              className="p-1 border border-black rounded bg-customLogoColor"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="p-10 pt-10 mt-[350px] my-2 mb-10 h-min-screen rounded-lg grid  place-content-center grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-x-12 gap-y-20 max-w-7xl mx-auto px-10">
        {books && books.length != 0
          ? books.map((book) => (
              <div key={book.id}>
                <ProductItem item={book} />
              </div>
            ))
          : message}
      </div>
    </>
  );
}
