import Head from "next/head";
import Image from "next/image";
import React from "react";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { getLayout } from "../components/SiteLayout";
import { useRouter } from "next/router";
import ProductList from "../components/ProductList";
import empty_image from "../images/no_thumbnail_image.png";
import Heading from "../components/Heading1";
export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

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
  const handleCheckoutRequest = () => {
    router.push("/checkout");
  };
  return (
    <div>
      <Heading text="Cart" />
      {ProductList.length > 0 ? (
        <div>
          <div className="pt-4 grid items-left place-content-left grid-cols-1   gap-x-12 gap-y-20 max-w-7xl px-10">
            {ProductList.map((item) => {
              const book = item.book;
              return (
                <div key={item.id} className="items-left">
                  <div className="  flex  w-40 h-52 object-center object-cover  overflow-hidden  rounded   ">
                    {/* aspect-w-1 aspect-h-1 overflow-hidden xl:aspect-w-7 xl:aspech-8 bg-gray-100 group-hover:opacity-75 */}
                    <div className=" mx-auto flex justify-center items-center w-40 h-52 object-center object-cover  overflow-hidden  rounded   ">
                      {/* aspect-w-1 aspect-h-1 overflow-hidden xl:aspect-w-7 xl:aspech-8 bg-gray-100 group-hover:opacity-75 */}
                      <Image
                        className="mx-auto  " //w-min-32 w-max-56
                        src={item.imageLink ? item.imageLink : empty_image} //`https://${bookImage}`
                        alt={item.title}
                        height={250}
                        width={160}
                      />
                    </div>
                  </div>
                  <div>
                    <a href={`/books/${item.id}`} className="">
                      {item.title}
                    </a>
                  </div>
                  <div>Price: ${item.price}</div>
                </div>
              );
            })}
            <div className="pb-10">
              <button
                className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                style={{ marginTop: "1rem" }}
                onClick={handleCheckoutRequest}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          <p>Your cart is empty</p>
        </div>
      )}
    </div>
  );
}

Cart.getLayout = getLayout;
