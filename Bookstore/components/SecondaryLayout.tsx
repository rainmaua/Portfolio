import React from "react";
import { PropsWithChildren, useState, ReactNode } from "react";
import Head from "./Head";

type Props = {
  children?: ReactNode;
  title?: string;
};
export default function SecondaryLayout({ children }: Props) {
  return (
    <>
      <div>
        <main className="pt-20 px-10">{children}</main>
      </div>

      <footer className="pt-20"></footer>
    </>
  );
}

export const getLayout = (page) => <SecondaryLayout>{page}</SecondaryLayout>;
