import "../styles/globals.css";
import type { AppProps } from "next/app";
import SiteLayout from "../components/SiteLayout";
import SecondaryLayout from "../components/SecondaryLayout";
import Navbar from "../components/Navbar";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

// Reference: https://nextjs.org/docs/basic-features/layouts
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ?? ((page) => <SiteLayout children={page} />);
  return getLayout(
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

// import "../styles/globals.css";
// import type { AppProps } from "next/app";
// import Layout from "../components/SiteLayout";
// import Navbar from "../components/Navbar";

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <>
//       <Navbar />
//       <Component {...pageProps} />
//     </>
//   );
// }
