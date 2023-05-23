import React from "react";
import { PropsWithChildren, useState, ReactNode } from "react";
import Head from "./Head";
import Footer from "./Footer";
// import Navbar from "./Navbar";
import dynamic from "next/dynamic";

// With no SSR
// To dynamically load a component on the client side,
// you can use the ssr option to disable server-rendering.
// This is useful if an external dependency or component relies on
// browser APIs like window.
// const Navbar = dynamic(() => import("./Navbar"), {
//   ssr: false,
// });
type Props = {
  children?: ReactNode;
  title?: string;
};
export default function SiteLayout({ children, title = "" }: Props) {
  return (
    <div className="antialiased">
      <Head title={title} />
      {/* <div>
        <Navbar />
      </div> */}

      <div className="flex flex-col min-h-screen ">
        <main className="flex-1 pt-20  px-10 pb-10">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
export const getLayout = (page) => <SiteLayout>{page}</SiteLayout>;
