import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout({ isLoggedIn }) {
  const router = useRouter();

  function logOut() {
    console.log("clicked logout");
    console.log("router: ", router.asPath);
    sessionStorage.removeItem("loggedin");
    sessionStorage.removeItem("user");
    localStorage.removeItem("loggedin");
    localStorage.removeItem("user");
    isLoggedIn = "false";
    // router.push("/");
    router.replace(router.asPath);
    // router.reload();
  }

  return <div onClick={logOut}>Log out </div>;
}
