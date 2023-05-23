import React from "react";
import styles from "../../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/SiteLayout";
import empty_image from "../../images/no_thumbnail_image.png";
import Image from "next/image";
import Popup from "../../components/Popup";
import LoginPopup from "../../components/LoginPopup";
import { LoginToast } from "../../components/LoginToast";
import { BuyRequestToast } from "../../components/BuyRequestToast";
import { UniqueToast } from "../../components/UniqueToast";
import { VerifyToast } from "../../components/VerifyToast";
import Moment from "react-moment";
import { Link } from "react-router-dom";

// import validator from "validator";
// import Cors from 'cors'

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

export default function SingleBook() {
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [course, setCourse] = useState(null);
  const { id } = router.query;
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showUniquePopup, setShowUniquePopup] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookSummary, setBookSummary] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [externalLink, setExternalLink] = useState("");

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleLoginClose = () => {
    setShowLoginPopup(false);
  };

  async function checkExternalLink(link: string): Promise<boolean> {
    try {
      const response = await fetch(link, {
        method: "HEAD",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (response.status >= 200 && response.status < 400) {
        // Status code is in the success range (200-399)
        console.log("amazon link exists");
        setExternalLink(link);
        return true;
      } else {
        // Status code is in the error range (400+)
        console.log("amazon link doesn't exists");
        setExternalLink(link);
        return false;
      }
    } catch (error) {
      // Error occurred while fetching link
      console.log(`Error checking link ${link}: ${error}`);

      return false;
    }
  }

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
            resJsonGoogle.items[0].volumeInfo.description
          ) {
            if (resJsonGoogle.items[0].volumeInfo.description != "") {
              // console.log(
              //   "summary: ",
              //   resJsonGoogle.items[0].volumeInfo.description
              // );
              console.log("fetchGoogle");
              setBookSummary(resJsonGoogle.items[0].volumeInfo.description);
              setExternalLink(
                resJsonGoogle.items[0].volumeInfo.canonicalVolumeLink
              );
            }
            // return resJsonGoogle.items[0].volumeInfo.description;
          } else {
            setBookSummary("N/A");
            // return "";
          }
        },

        () => {
          setBookSummary("N/A");
          setErrorMessage("fetchGoogleAPI error");
          console.log("fetchGoogleAPI error");
        }
      );
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!router.isReady) return;
      try {
        const response = await fetch(`/api/book/by-id?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log("id: ", id);
          throw new Error(response.statusText);
        }
        const data = await response.json();
        if (
          JSON.parse(sessionStorage.getItem("user")) &&
          JSON.parse(sessionStorage.getItem("user")).id == data.ownerId
        ) {
          setIsOwner(true);
        }
        if (data.isbn.length > 10) {
          convISBN13toISBN10(data.isbn);
        }
        fetchGoogleAPI(data);

        setBook(data);

        let possibleAmazonLink =
          "https://www.amazon.com/dp/" + convISBN13toISBN10(String(data?.isbn));
        // checkExternalLink(possibleAmazonLink);

        try {
          const courseResponse = await fetch(
            `/api/course/by-id?id=${data.courseId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!courseResponse.ok) {
            throw new Error(response.statusText);
          }
          const courseData = await courseResponse.json();
          setCourse(courseData.name);
        } catch (error) {
          console.error(error);
        }

        // try {
        //   const userResponse = await fetch(`/api/user?id=${data.ownerId}`, {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     credentials: "include",
        //   });

        //   if (!userResponse.ok) {
        //     throw new Error(response.statusText);
        //   }
        //   const userData = await userResponse.json();
        //   setBookOwner(userData.username);
        // } catch (error) {
        //   console.error(error);
        // }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    // if (book) {
    //   fetchGoogleAPI(book);
    // }
  }, [router.isReady, bookSummary]);

  function convISBN13toISBN10(str: string) {
    var s: string;
    var c: string | number;
    var checkDigit = 0;
    var result = "";
    str = str.replace(/-/g, "");
    s = str.substring(3, str.length);

    for (let i = 10; i > 1; i--) {
      c = s.charAt(10 - i);
      checkDigit += (Number(s.charAt(10 - i)) - 0) * i;
      result += c;
    }
    checkDigit = (11 - (checkDigit % 11)) % 11;
    result += checkDigit == 10 ? "X" : checkDigit + "";
    console.log("isbn10: ", result);
    return result;
  }

  const handleAddToCart = async () => {
    if (JSON.parse(sessionStorage.getItem("user"))) {
      const jwt = JSON.parse(sessionStorage.getItem("user")).token;

      console.log(jwt);
      console.log(book?.id);
      fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify({ bookId: book?.id }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.statusText != "Internal Server Error") {
              throw new Error(response.statusText);
            }
          }
          return response.json();
        })
        .then((data) => {
          console.log("Book added to cart", data);
          router.push("/cart");
        });
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleSendBuyRequest = () => {
    if (JSON.parse(sessionStorage.getItem("user"))) {
      const jwt = JSON.parse(sessionStorage.getItem("user")).token;
      console.log(jwt);
      console.log(book?.id);
      fetch("/api/book/buy-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify({ bookId: book?.id }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.statusText == "Internal Server Error") {
              setShowUniquePopup(true);
            } else if (response.statusText == "Forbidden") {
              setShowVerifyPopup(true)
            } else {
              throw new Error(response.statusText);
            }
            return;
          }
        })
        .then((data) => {
          console.log("Buy request sent", data);
        });
      setShowPopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };
  const handleNotification = () => {
    router.push("/account/notifications");
  };

  return (
    <div className="bg-white h-fit py-5 pl-5 sticky top-0 flex flex-col rounded-lg shadow md:flex-row md:w-fit md:pl-3 grid-cols-2  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      {/* <div className="p-10 pt-10 mt-[350px] my-2 mb-10 h-min-screen rounded-lg grid  place-content-center grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-x-12 gap-y-20 max-w-7xl mx-auto px-10"> */}
      {/* 28 32 36  49 44 48 52 56 64 72 */}
      <Image
        className="md:w-64 md:h-96  md:rounded-none sm:w-44 sm:ml-10 sm:mb-5 min-[320px]:m-10 " //w-min-32 w-max-56
        src={book?.imageLink || empty_image}
        alt={book?.title || "Book title"}
        height={230}
        width={150}
        priority={true}
      />
      <div className="flex flex-col justify-between px-10 md:pt-9 leading-normal">
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
          {book?.title || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Posted:</span>{" "}
          {<Moment fromNow>{book?.dateCreated}</Moment>}
        </div>
        <div>
          <span className="font-semibold">ISBN: </span>
          {book?.isbn}
        </div>
        <div>
          <span className="font-semibold">Course: </span>
          {course}
        </div>
        <div>
          <span className="font-semibold">Price: </span> ${book?.price}
        </div>
        <div>
          <span className="font-semibold"> External link: </span>
          <a className="underline" href={externalLink}>
            More
          </a>
        </div>
        {/* <div>Sold by: {bookOwner} </div> */}
        <div>
          <span className="font-semibold"> Status: </span>
          {book?.sold ? (
            <p className="bg-gray-500/75 inline-block rounded-md px-[3px]">
              Sold
            </p>
          ) : (
            <p className="bg-green-500/75 inline-block rounded-md px-[3px]">
              Available
            </p>
          )}
        </div>
        <div>
          <span className="font-semibold"> Description: </span>
          {bookSummary && bookSummary.length > 400
            ? bookSummary.substring(0, 400) + "..."
            : ""}
        </div>
        {!isOwner && (
          <div className="flex">
            <button
              className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
              style={{ marginTop: "1rem" }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
              style={{ marginTop: "1rem", marginLeft: "1rem" }}
              onClick={handleSendBuyRequest}
            >
              Send Buy Request
            </button>
            {showPopup && <BuyRequestToast show={true}></BuyRequestToast>}
            {showLoginPopup && <LoginToast show={true}></LoginToast>}
            {showUniquePopup && <UniqueToast show={true}></UniqueToast>}
            {showVerifyPopup && <VerifyToast show={true}></VerifyToast>}
          </div>
        )}
        {isOwner && (
          <div>
            <p style={{ marginTop: "1rem" }}>You Posted this Book</p>

            <button
              className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
              style={{ marginTop: "1rem" }}
              onClick={handleNotification}
            >
              Check Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
