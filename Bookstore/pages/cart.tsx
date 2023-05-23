import Head from "next/head";
import Image from "next/image";
import React, { useRef } from "react";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { getLayout } from "../components/SiteLayout";
import { useRouter } from "next/router";
import empty_image from "../images/no_thumbnail_image.png";
import Heading from "../components/Heading1";
import {LoginToast} from "../components/LoginToast";
import {BuyRequestToast} from "../components/BuyRequestToast";
import {UniqueToast} from "../components/UniqueToast";

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showUniquePopup, setShowUniquePopup] = useState(false);


  useEffect(() => {

    const fetchData = async () => {
      try {
        if (JSON.parse(sessionStorage.getItem("user"))) {
          const jwt = JSON.parse(sessionStorage.getItem("user")).token;
          const response = await fetch(`/api/cart`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwt,
            },
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const data = await response.json();
          setCart(data);
        }

        console.log("cart", cart);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);


  const handleCheckoutRequest = async() => {
    if (JSON.parse(sessionStorage.getItem("user"))) {
      const jwt = JSON.parse(sessionStorage.getItem("user")).token;
      console.log(jwt);
      fetch("/api/user/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.log(response)
            if (response.statusText == "Internal Server Error"){
              setShowUniquePopup(true);
            }
            else{
              throw new Error(response.statusText);
            }
          }
          else{
            console.log("checkout successful");
            setCart([]);
          }
          
          //return response.json();
        })
        setShowPopup(true);
    }
    
    else{
      setShowLoginPopup(true);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const jwt = JSON.parse(sessionStorage.getItem("user")).token;
      const response = await fetch(`/api/cart?bookId=${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Remove the deleted book from the cart
      setCart(cart.filter((item) => item.book.id !== bookId));
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <Heading text="Cart" />
      {cart.length > 0 ? (
        <div>
          <div className="pt-4 grid items-left place-content-left grid-cols-1   gap-x-12 gap-y-20 max-w-7xl px-10">
            {cart.map((item) => {
              const book = item.book;
              return (
                <div key={book.id} className="items-left">
                  <div className="  flex  w-40 h-52 object-center object-cover  overflow-hidden  rounded   ">
                    {/* aspect-w-1 aspect-h-1 overflow-hidden xl:aspect-w-7 xl:aspech-8 bg-gray-100 group-hover:opacity-75 */}
                    <div className=" mx-auto flex justify-center items-center w-40 h-52 object-center object-cover  overflow-hidden  rounded   ">
                      {/* aspect-w-1 aspect-h-1 overflow-hidden xl:aspect-w-7 xl:aspech-8 bg-gray-100 group-hover:opacity-75 */}
                      <Image
                        className="mx-auto  " //w-min-32 w-max-56
                        src={book.imageLink ? book.imageLink : empty_image} //`https://${bookImage}`
                        alt={book.title}
                        height={250}
                        width={160}
                      />
                    </div>
                  </div>
                  <div>
                    <a href={`/books/${book.id}`} className="">
                      {book.title}
                    </a>
                  </div>
                  <div>Price: ${book.price}</div>
                  <button
                    className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                    style={{ marginTop: "1rem" }}
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          <div className="pb-10">
            <button
              className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
              style={{ marginTop: "1rem" }}
              onClick={handleCheckoutRequest}
            >
              Check Out
            </button>
            {showPopup  && (
              <BuyRequestToast show={true} >
              </BuyRequestToast>
            )}
            {showLoginPopup && (
              <LoginToast show={true} >
              </LoginToast>
            )}
            {showUniquePopup && (
              <UniqueToast show={true} >
              </UniqueToast>
            )}
          </div>
        </div>
      ) : (
        <div className = 'center'>

            <p>Your cart is empty</p>
        </div>
      )}
    </div>
  );
}

Cart.getLayout = getLayout;
