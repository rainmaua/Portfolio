import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

import empty_image from "../images/no_thumbnail_image.png";
import ProductList from "../components/ProductList";
import Layout from "../components/SiteLayout";
import ProductItem from "../components/ProductItem";
import { toUnicode } from "punycode";
import { useRouter } from "next/router";
import { getLayout } from "../components/SiteLayout";
import Heading1 from "../components/Heading1";
import Dropdown from "../components/Dropdown";

interface Data {
  id: string;
  isbn: string;
  ownerId: string;
  courseId: string;
  title: string;
  price: number;
  sold: boolean;
  dateCreated: string;
  dateUpdated: string;
  imageLink: string;
}

export default function Home() {
  const router = useRouter();
  const [result, setResult] = useState([]);
  const [bookImage, setBookImage] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // hard coding
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const schedule = require("node-schedule");
  const [sortMethod, setSortMethod] = useState("Just In");
  const [clickedLoginBtn, setClickedLoginBtn] = useState<string>("");
  const a = "";
  function fetchGoogleAPI(item: Data) {
    return fetch(
      "https://www.googleapis.com/books/v1/volumes?q=isbn:" +
        item.isbn +
        "&maxResults=1",
      {
        method: "GET",
        // To solve 429 error, wait 30 seconds if you requested googleAPI too many times.
        // headers: { "Retry-After": "30" },
      }
    )
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .then(
        (resJsonGoogle) => {
          // console.log("googleAPI data: ", resJsonGoogle);
          if (
            resJsonGoogle &&
            resJsonGoogle.items &&
            resJsonGoogle.items[0].volumeInfo &&
            resJsonGoogle.items[0].volumeInfo.imageLinks &&
            resJsonGoogle.items[0].volumeInfo.imageLinks.thumbnail
          ) {
            return resJsonGoogle.items[0].volumeInfo.imageLinks.thumbnail;
            // JSON.stringify(resJsonGoogle, (key, value) =>
            //   key === "imageLink"
            //     ? resJsonGoogle.items[0].volumeInfo.imageLinks.thumbnail
            //     : value
            // );
          } else {
            return "";
            // JSON.stringify(resJsonGoogle, (key, value) =>
            //   key === "imageLink" ? "" : value
            // );
          }
          // console.log("item: ", JSON.stringify(item));
          // return JSON.stringify(item);
        },
        // .then(
        //   (data) => {
        //     console.log("googleAPI data: ", JSON.stringify(data));
        //     return JSON.stringify(data);
        //   },
        () => {
          setErrorMessage("fetchGoogleAPI error");
          console.log("fetchGoogleAPI error");
        }
      );
  }

  async function fetchAllBooks() {
    return await fetch("/api/book/all", {
      method: "GET",
      headers: { "Content-Type": "application/json", credentials: "include" },
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .then((resJson) => {
        // get imageLink from googleAPI and update jsonfile:
        // resJson.map(async (item: Data) => {
        //   const imageLinkJson = await fetchGoogleAPI(item);
        //   // console.log("itemLinkInside: ", imageLinkJson);
        //   item.imageLink = imageLinkJson;
        //   const resItem = item;
        //   // console.log("resItem: ", JSON.stringify(resItem));
        //   return resItem;
        // });
        // .then((resJson) => {
        //   return resJson;
        // });

        // console.log("Book data: ", resJson);
        // sort by added date
        if (sortMethod == "Just In") {
          resJson.sort((a, b) => {
            // to make order A, B => return -1;    to make order B, A => return 1;
            if (a.dateCreated > b.dateCreated) {
              return -1;
            }
            return 0;
          });
        } else if (sortMethod == "Price Low to High") {
          resJson.sort((a, b) => {
            // to make order A, B => return -1;    to make order B, A => return 1;
            if (a.price < b.price) {
              return -1;
            }
            return 0;
          });
        } else if (sortMethod == "Price High to Low") {
          resJson.sort((a, b) => {
            // to make order A, B => return -1;    to make order B, A => return 1;
            if (a.price > b.price) {
              return -1;
            }
            return 0;
          });
        }

        return resJson;
      })
      .then(
        (data) => {
          // console.log("final fetchAllBooks result: ", data);
          // console.log(
          //   "final fetchAllBooks result: stringify: ",
          //   JSON.stringify(data)
          // );
          setIsInitialLoading(false);
          setResult(data);
          localStorage.setItem("mainPageBooks", JSON.stringify(data));
          return data;
        },
        () => {
          setErrorMessage("fetchAllBooks error");
          console.log("fetchAllBooks error");
        }
      );
  }

  useEffect(() => {
    setClickedLoginBtn(
      typeof window !== "undefined"
        ? sessionStorage.getItem("clickedLoginBtn")
        : null
    );
    if (clickedLoginBtn == "true") {
      sessionStorage.setItem("clickedLoginBtn", "false");
      router.reload();
    }

    // displayStoredBooks();
    if (isInitialLoading) {
      fetchAllBooks();
      // console.log("useEffect: ", result);
    }
    fetchAllBooks();
    async function displayStoredBooks() {
      if (localStorage.getItem("mainPageBooks") === undefined) {
        fetchAllBooks();
      } else {
        let currentBooks = JSON.parse(localStorage.getItem("mainPageBooks"));

        setResult(currentBooks);
      }
    }
  }, [isInitialLoading, sortMethod]);
  return !isInitialLoading ? (
    <div>
      <Heading1 text="Just Arrived" />
      {/* Pin to top right corner */}
      <div className="relative h-full w-full ...">
        <div className="absolute top-0 right-0 h-16 w-16 ...">
          <Dropdown sortMethod={sortMethod} setSortMethod={setSortMethod} />
        </div>
      </div>

      <div className="pt-10 grid  place-content-center grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-x-12 gap-y-20 max-w-7xl mx-auto px-10 ">
        {/*mx-[max(20vw,12px)] */}
        {/* <div className={styles.book_list}> */}

        {result
          ? result.map((item: Data) => {
              // console.log("product result: ", result);
              // console.log("productitem: ", JSON.stringify(item));
              // console.log("productitem title: ", item.title);

              // console.log("productitem thumbnail: ", item.thumbnail);

              return (
                <div key={item.id}>
                  <ProductItem item={item} />
                </div>
              );
            })
          : "No entries found"}
        {/* </div> */}
      </div>
    </div>
  ) : (
    <div>Is loading...</div>
  );
}
Home.getLayout = getLayout;

// resJson.map(async (item: Data) => {
//   function getUpdatedItem() {
//     return fetchGoogleAPI(item).then(function (imageLinkJson) {
//       // console.log("itemLinkInside: ", imageLinkJson);
//       item.imageLink = imageLinkJson;
//       return item;
//     });
//   }

//   updatedItem = await getUpdatedItem();

//   // console.log("itemLink: ", JSON.stringify(updatedItem));
//   return updatedItem;
// });
