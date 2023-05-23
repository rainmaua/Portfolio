import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logout from "./Logout";
import Heading1 from "./Heading1";
import { useNavigate } from "react-router-dom";

import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineShoppingCart,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineCaretDown,
  AiOutlineCaretUp,
} from "react-icons/ai";
import {
  RiArrowDropDownLine,
  RiArrowDropUpLine,
  RiNotification2Line,
} from "react-icons/ri";
// import { BsGrid } from "react-icons/bs";

// Reference: https://www.youtube.com/watch?v=HVyct9EUNP8
export default function Navbar() {
  const [nav, setNav] = useState(false);
  const [color, setColor] = useState("white");
  const [textColor, setTextColor] = useState("black");
  const [isOpen, setIsOpen] = useState(false);
  const dropdown = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(sessionStorage.getItem("loggedin"));
    } else {
      return "";
    }
  });
  const [hasLoaded, setHasLoaded] = useState(false); // to run Navbar after useEffect runs.

  const router = useRouter();
  const {
    query: { isLoggedInFromLogin },
  } = router;
  const props = {
    isLoggedInFromLogin,
  };

  const handleNav = () => {
    console.log("handleNav clicked");
    setNav(!nav);
  };

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsLoggedIn(
      typeof window !== "undefined" ? sessionStorage.getItem("loggedin") : null
    );
    // console.log("isLoggedIn(in useEffect): ", isLoggedIn);

    setHasLoaded(true);
    //   const changeColor = () => {
    //     if (window.scrollY >= 1) {
    //       setColor("white");
    //       setTextColor("black");
    //     } else {
    //       setColor("transparent");
    //       setTextColor("black");
    //     }
    //   };
    //   window.addEventListener("scroll", changeColor);
  }, [isLoggedIn]);

  // console.log("isLoggedIn: ", isLoggedIn);
  if (typeof window !== "undefined") {
    let a = window.sessionStorage.getItem("isLoggedIn");
    console.log("sesseionStorage: ", a);
  }

  function logOut() {
    console.log("clicked logout");
    sessionStorage.removeItem("loggedin");
    sessionStorage.removeItem("user");
    localStorage.removeItem("loggedin");
    localStorage.removeItem("user");
    setIsLoggedIn("false");

    router.push("/");
    router.replace(router.asPath);
    router.reload();
  }

  return hasLoaded ? (
    <div
      style={{ backgroundColor: `${color}` }}
      className="fixed left-0 top-0 w-full z-10 ease-in duration-300 shadow-sm"
    >
      <div className="max-w[1240px] flex justify-between px-4 py-0 ">
        <div className="p-4">
          <Link href="/" onClick={handleNav}>
            <h1 className="font-bold text-1xl text-customLogoColor">
              W U B O O K S
            </h1>
          </Link>
        </div>

        {/* flex if screen-width>640px(i.e. sm size) */}
        <ul style={{ color: `${textColor}` }} className="hidden sm:flex">
          <li className="p-4 ">
            <Link href="/" className="flex">
              {/* <BsGrid size={20} /> */}
              <div className="hover:text-gray-500">Home</div>
            </Link>
          </li>
          <li className="p-4">
            <Link href="/books" className="hover:text-gray-500">
              Book Search
            </Link>
          </li>
          <li className="p-4">
            <Link href="/about" className="hover:text-gray-500">
              About
            </Link>
          </li>
          {/* Dropdown menu */}
          <li className="p-4 group relative dropdown">
            <div className="flex hover:text-gray-500">
              <div>Account</div>
              {/* {isOpen ? ( */}
              <RiArrowDropDownLine size={30} className="h-8 m-[-3%] " />
              {/* ) : (
                <RiArrowDropUpLine size={30} className="h-8 m-[-2%]" />
              )} */}
            </div>
            <div
              className={
                // isOpen ?
                "absolute hidden text-gray-700 p-2 rounded group-hover:block bg-white border border-solid border-gray-300"
                // : "hidden"
              }
            >
              {isLoggedIn == "true" ? (
                /* Logged in: - My Sales - Log out - notificaiton */
                <div>
                  <div className="text-1xl hover:text-gray-500 ">
                    <Link href="/sell">Sell Book</Link>
                  </div>
                  <div className="text-1xl hover:text-gray-500 ">
                    <Link href="/account/profile">My Profile</Link>
                  </div>
                  <div className="text-1xl hover:text-gray-500 ">
                    <Link href="/account/mybooks">My Books</Link>
                  </div>
                  <div className="text-1xl hover:text-gray-500 ">
                    <Link href="/account/verify">Verification</Link>
                  </div>
                  <div className="text-1xl hover:text-gray-500 ">
                    <Link href="/account/transactions">Transactions</Link>
                  </div>
                  <div className="text-1xl hover:text-gray-500 ">
                    {/* <Logout isLoggedIn={isLoggedIn} /> */}
                    <div onClick={logOut}>Log out </div>
                  </div>
                </div>
              ) : (
                /*Logged out: - Login - Register*/
                <div>
                  <div className="text-1xl hover:text-gray-500 py-1">
                    <Link href="/account/login">Login</Link>
                  </div>
                  <div className="text-1xl hover:text-gray-500 py-1">
                    <Link href="/account/register">Register</Link>
                  </div>
                </div>
              )}
            </div>
          </li>
          {/*---------- */}
          <li className="p-4 pt-4 flex hover:text-gray-500">
            <Link
              href={
                isLoggedIn == "true"
                  ? "/account/notifications"
                  : "/account/login"
              }
              className="flex"
            >
              <AiOutlineMail
                size={20}
                className="my-0.5"
                title="Notification"
              />
              {/* <RiNotification2Line size={20} /> */}
              <div></div>
            </Link>
          </li>
          <li className="p-4 pt-4 flex hover:text-gray-500">
            <Link
              href={isLoggedIn == "true" ? "/cart" : "/account/login"}
              className="flex"
            >
              <AiOutlineShoppingCart size={20} className="my-0.5" />
            </Link>
          </li>
        </ul>
        {/* Mobile Button */}
        <div onClick={handleNav} className="block sm:hidden z-10 py-4 my-0.5">
          {/*anything above sm(640px width) is hidden: 'sm:hidden' */}
          {nav ? (
            <AiOutlineClose size={20} style={{ color: `${textColor}` }} />
          ) : (
            <AiOutlineMenu size={20} style={{ color: `${textColor}` }} />
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={
            nav
              ? " mt-12 absolute top-0 left-0 right-0 bottom-0 flex text-left ease-in duration-0 bg-white min-h-fit sm:hidden"
              : "absolute top-0 left-[-100%] right-0 bottom-0 flex items-left w-full text-left ease-in duration-0 bg-white min-h-fit sm:hidden s"
          }
        >
          <ul onClick={handleNav}>
            <li className="px-8 py-2 text-1xl hover:text-gray-500">
              <Link href="/">Home</Link>
            </li>
            <li className="px-8 py-2 text-1xl hover:text-gray-500">
              <Link href="/books">Books</Link>
            </li>
            <li className="px-8 py-2 text-1xl hover:text-gray-500">
              <Link href="/about">About</Link>
            </li>
            <li className="px-8 py-2 text-1xl hover:text-gray-500">
              <Link
                href={
                  isLoggedIn == "true"
                    ? "/account/notifications"
                    : "/account/login"
                }
                className="flex"
              >
                <div>Notifications</div>
              </Link>
            </li>
            <li className="px-8 py-2 text-1xl hover:text-gray-500">
              <Link
                href={isLoggedIn == "true" ? "/cart" : "/account/login"}
                className="flex"
              >
                <div>Cart</div>
              </Link>
            </li>
            {/* Dropdown menu */}
            <li className="px-8 py-2 text-1xl group relative dropdown">
              <div className="flex hover:text-gray-500">
                <div>Account</div>
                {/* {isOpen ? ( */}
                <RiArrowDropDownLine size={30} className="h-8 m-[-2%] " />
                {/* ) : (
                <RiArrowDropUpLine size={30} className="h-8 m-[-2%]" />
              )} */}
              </div>
              <div
                className={
                  // isOpen ?
                  " hidden text-gray-700 px-4 group-hover:inline-block  bg-white"
                  // : "hidden"
                }
              >
                {isLoggedIn === "true" ? (
                  /* Logged in: - My Sales - Log out */
                  <div>
                    <div className="text-1xl hover:text-gray-500 py-1">
                      <Link href="/sell">Sell Books</Link>
                    </div>
                    <div className="text-1xl hover:text-gray-500 py-1 ">
                      <Link href="/account/profile">Profile</Link>
                    </div>

                    <div className="text-1xl hover:text-gray-500 py-1 ">
                      <Link href="/account/mybooks">My Books</Link>
                    </div>
                    <div className="text-1xl hover:text-gray-500 py-1 ">
                      <Link href="/account/verify">Verification</Link>
                    </div>
                    <div className="text-1xl hover:text-gray-500 py-1 ">
                      <Link href="/account/transactions">Transactions</Link>
                    </div>
                    <div className="text-1xl hover:text-gray-500 py-1">
                      {/* <Logout isLoggedIn={isLoggedIn} /> */}
                      <div onClick={logOut}>Log out </div>
                    </div>
                  </div>
                ) : (
                  /*Logged out: - Login - Register*/
                  <div>
                    <div className="text-1xl hover:text-gray-500 py-1 ">
                      <Link href="/account/login">Login</Link>
                    </div>
                    <div className="text-1xl hover:text-gray-500 py-1 ">
                      <Link href="/account/register">Register</Link>
                    </div>
                  </div>
                )}
              </div>
            </li>
            {/*---------- */}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
}
