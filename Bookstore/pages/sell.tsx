import Head from "../components/Head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import { getLayout } from "../components/SiteLayout";
import Heading1 from "../components/Heading1";
import GoogleAPISearch from "../components/GoogleAPISearch";
import { VerifyToast } from "../components/VerifyToast";

const inter = Inter({ subsets: ["latin"] });
type FormValues = {
  title: string;
  isbn: string;
  courseName: string;
  courseId: string;
  price: string;
};
export default function Sell() {
  const router = useRouter();


  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    isbn: Yup.string().required("Required"),
    courseName: Yup.string().required("Required"),
    price: Yup.number().required("Required"),
  }).required();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;
  const [errorMessage, setErrorMessage] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookISBN, setBookISBN] = useState("");
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  function handleTextChange(updatedISBN) {
    setBookISBN(updatedISBN);
  }

  async function onSubmit(book) {
    let isCourse = false;

    book.price = parseFloat(book.price);
    console.log(JSON.parse(sessionStorage.getItem('user')))
    const ownerId = JSON.parse(sessionStorage.getItem("user")).id;
    const isVerified = JSON.parse(sessionStorage.getItem("user")).verified;
    console.log('verification', isVerified)
    if (isVerified != true){
      setShowVerifyPopup(true)
      
      return
    }

    book["ownerId"] = ownerId;
    let courseId;

    //get user jwt
    const jwt = JSON.parse(sessionStorage.getItem("user")).token;
    console.log(jwt);

    //get courses
    const currentCourses = await fetch("/api/course/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!currentCourses.ok) {
      return currentCourses.statusText;
    }
    const coursesData = await currentCourses.json();

    let i = 0;
    while (i < coursesData.length) {
      if (book.courseName == coursesData[i]["name"]) {
        isCourse = true;
        courseId = coursesData[i]["id"];
      }
      i++;
    }

    if (!isCourse) {
      console.log("Course name not found, creating new course");

      const createCourse = await fetch("/api/course", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + jwt,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: book.courseName,
          university: "Washington University in St. Louis",
        }),
      });
      if (!createCourse.ok) {
        return createCourse.statusText;
      }
      const courseData = await createCourse.json();
      courseId = courseData.id;
    }

    book["courseId"] = courseId;
    delete book.courseName;

    return await fetch("/api/book", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
      credentials: "include",

      body: JSON.stringify(book),
    })
      .then((response) => {
        if (!response.ok) {
          console.log("problem", response.statusText);
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(() => {
        router.push("/?message=postsuccess");
      });
  }

  return (
    <div className={inter.className}>
      <Head title="Post a Book" />
      <Heading1 text="Post a Book" />
      <GoogleAPISearch setBookTitle={setBookTitle} setBookISBN={setBookISBN} />

      <main className={styles.main}>
        <div className="pt-20">
          <h1>Please Submit Book Information</h1>
        </div>
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formEntry}>
              <label htmlFor="title">Book Title</label>
              <div className={styles.invalidFeedback}>
                {errors.title?.message}
              </div>
              <input
                className="block w-full rounded-md border-0 py-1.5 px-3  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="title"
                defaultValue={bookTitle}
                placeholder="e.g. Learning Python "
                maxLength={100}
                {...register("title")}
              />
            </div>
            <div className={styles.formEntry}>
              <label htmlFor="isbn">ISBN</label>
              <div className={styles.invalidFeedback}>
                {errors.isbn?.message}
              </div>
              <input
                className="block w-full rounded-md border-0 py-1.5 pl-3 px-3  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="isbn"
                defaultValue={bookISBN}
                placeholder="e.g. 9781538101230"
                {...register("isbn")}
              />
            </div>
            <div className={styles.formEntry}>
              <label htmlFor="courseName">Course Name</label>
              <div className={styles.invalidFeedback}>
                {errors.courseId?.message}
              </div>
              <input
                className="block w-full rounded-md border-0 py-1.5 pl-3 px-3  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="courseName"
                placeholder="e.g. CSE 437"
                {...register("courseName")}
              />
            </div>
            <div className="relative mt-2 rounded-md shadow-sm">
              <label htmlFor="price">Price</label>
              <div className={styles.invalidFeedback}>
                {errors.price?.message}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 pt-6 ">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                className="block w-96 rounded-md border-0 py-1.5 pl-7 px-3  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="price"
                {...register("price")}
                placeholder="0.00"
              />
            </div>
            <div className={styles.submit}>
              <button
                disabled={formState.isSubmitting}
                className="mt-5 bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Submit
              </button>
            </div>
            {showVerifyPopup && <VerifyToast show={true}></VerifyToast>}
          </form>
        </div>
        <div className={styles.errorMessage}>
          <h2>{errorMessage}</h2>
        </div>
      </main>
    </div>
  );
}

Sell.getLayout = getLayout;

function useEffect(arg0: () => string, arg1: string[]) {
  throw new Error("Function not implemented.");
}
