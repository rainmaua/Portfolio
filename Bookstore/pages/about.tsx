import React from "react";
import Heading1 from "../components/Heading1";
import { getLayout } from "../components/SiteLayout";

export default function About() {
  return (
    <div>
      <Heading1 text="About" />
      <p>
        WuBook is a digital marketplace for students of Washu to trade their
        used textbooks. We hope that this project solves the following problems:
        some students often have textbooks from old classes that they no longer
        need sitting around collecting dust, while other students are often
        required to buy new textbooks at high prices. This is wasteful and our
        service aims to allow new students to buy old textbooks at lower prices
        from their peers who want to get rid of their textbooks without throwing
        them away.
      </p>
      <p style={{ marginTop: "2rem" }}>
        When you request to buy a book from our website, we will forward that
        request to the seller who posted the book and allow you to further
        communicate offline. We do this to connect students who are taking the
        same classes with one another.
      </p>
    </div>
  );
}

About.getLayout = getLayout;
