import React from "react";
import empty_image from "../images/no_thumbnail_image.png";
import Image from "next/image";
import Link from "next/link";
import { isTSMethodSignature } from "@babel/types";

export default function ProductItem({ item }) {
  let bookImage: string;
  if (item.imageLink) {
    // console.log(
    //   "productitem title: " + item.title + " imageLink : " + item.imageLink
    // );
  } else {
    bookImage = "";
  }

  return (
    <div className=" h-70 py-2 overflow-hidden text-center bg-white rounded-lg  hover:text-gray-500 hover:shadow-[0_5px_15px_-0px_rgba(0,0,0,0.15)]">
      <Link href={`/books/${item.id}`}>
        <div className="  mx-auto justify-center items-center w-40 h-52 object-center object-cover  overflow-hidden  rounded   ">
          {/* aspect-w-1 aspect-h-1 overflow-hidden xl:aspect-w-7 xl:aspech-8 bg-gray-100 group-hover:opacity-75 */}
          <Image
            className="mx-auto  " //w-min-32 w-max-56
            src={item.imageLink === "" ? empty_image : item.imageLink} //`https://${bookImage}`
            alt={item.title}
            height={250}
            width={160}
          />
        </div>
        {/* <div className="flex"> */}
        {/* {bookSummary && bookSummary.length > 400
              ? bookSummary.substring(0, 400) + "..."
              : ""} */}
        <p className=" mb-2 p-1 text-sm font-semibold h-10  ">
          {item.title.substring(0, 50)}
        </p>
        <p className="mx-2 text-sm bg-[#d9f99d]">${item.price}</p>
        {/* </div> */}
      </Link>
    </div>
  );
}
