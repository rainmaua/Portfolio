import React from "react";

export default function Heading1({ text }: { text: String }) {
  return (
    <div className="text-customTitleColor text-2xl font-extrabold ">{text}</div>
  );
}
