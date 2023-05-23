import Head from "../components/Head";
import styles from "../styles/Home.module.css";
import { getLayout } from "../components/SiteLayout";
export default function Checkout() {
  return (
    <>
      <Head title="Checkout" />
      <nav>
        <a href="/"> Home </a>
        <a href="/cart"> Back to Cart </a>
      </nav>
      <main className={styles.main}>
        <h1>Your buy request has been submitted to the seller, please check your notifications page for updates</h1>
      </main>
    </>
  );
}

Checkout.getLayout = getLayout;
