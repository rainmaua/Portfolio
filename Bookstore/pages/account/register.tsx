import { Inter } from "@next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Layout from "../../components/SiteLayout";
const inter = Inter({ subsets: ["latin"] });

type FormValues = {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  phone_num: string;
};

export default function Register() {
  const router = useRouter();

  /*form validation rules*/
  const validationSchema = Yup.object({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required").min(6, "At least 6 characters"),
    email: Yup.string().required("Required").email("Enter a Valid Address"),
    phone_num: Yup.string()
      .required("Required")
      .matches(/^\d{3}-\d{3}-\d{4}$|^\d{10}$/, "Enter A Valid Phone #"),
  }).required();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const [hidePassword, setHidePassword] = useState(true);
  const toggleHidePassword = () => {
    setHidePassword(hidePassword ? false : true);
  };

  const [errorMessage, setErrorMessage] = useState("");

  const usernameMSG =
    "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`username`)";
  const emailMSG =
    "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`email`)";

  function onSubmit(user) {
    return fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user),
    })
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return response.json();
    })
    .then(
      () => {
        router.push("/account/login?message=regsuccess");
      },
      (err) => {
        err.json().then((json) => {
          const jsonMSG = json.message ?? "NoMessage";
          if (Object.is(jsonMSG, usernameMSG)) {
            setErrorMessage("That Username is Taken");
          }
          if (Object.is(jsonMSG, emailMSG)) {
            setErrorMessage("That Email is Taken");
          }
        });
    });
  }

  return (
    <div className={inter.className}>
      <main className="flex flex-col items-center p-4 pb-0">
        <Link
          href="/account/login"
          className="text-customLogoColor text-xl"
        >
          &lt;- Back To Login
        </Link>
        <div className="my-6">
          <h1>Register for an Account</h1>
        </div>
        <div className="max-w-md p-9 pb-4 pt-6 border border-black dark:border-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 text-xl">
              <label htmlFor="first_name">First Name</label>
              <div className="float-right text-base text-red-600 mt-0.5">
                {errors.first_name?.message}
              </div>
              <input
                className="w-full text-lg px-2 py-1"
                type="text"
                name="first_name"
                {...register("first_name")}
              />
            </div>
            <div className="mb-4 text-xl">
              <label htmlFor="last_name">Last Name</label>
              <div className="float-right text-base text-red-600 mt-0.5">
                {errors.last_name?.message}
              </div>
              <input 
                className="w-full text-lg px-2 py-1"
                type="text" 
                name="last_name" 
                {...register("last_name")} />
            </div>
            <div className="mb-4 text-xl">
              <label htmlFor="username">Username</label>
              <div className="float-right text-base text-red-600 mt-0.5">
                {errors.username?.message}
              </div>
              <input
                className="w-full text-lg px-2 py-1"
                type="text"
                name="username"
                id="username"
                {...register("username")}
              />
            </div>
            <div className="mb-4 text-xl relative">
              <label htmlFor="password">Password</label>
              <div className="float-right text-base text-red-600 mt-0.5">
                {errors.password?.message}
              </div>
              <input
                className="w-full text-lg px-2 py-1"
                type={hidePassword ? "password" : "text"}
                name="password"
                id="password"
                {...register("password")}
              />
              <a className="text-2xl absolute right-2 bottom-1.5" onClick={toggleHidePassword}>
                {hidePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </a>
            </div>
            <div className="mb-4 text-xl">
              <label htmlFor="email">Email</label>
              <div className="float-right text-base text-red-600 mt-0.5">
                {errors.email?.message}
              </div>
              <input
                className="w-full text-lg px-2 py-1"
                type="text"
                name="email"
                id="email"
                {...register("email")}
              />
            </div>
            <div className="mb-4 text-xl">
              <label htmlFor="phone_num">Phone Number</label>
              <div className="float-right text-base text-red-600 mt-0.5">
                {errors.phone_num?.message}
              </div>
              <input
                className="w-full text-lg px-2 py-1"
                type="tel"
                name="phone_num"
                id="phone_num"
                placeholder="###-###-####"
                {...register("phone_num")}
              />
            </div>
            <div className="flex justify-center">
              <button
                disabled={formState.isSubmitting}
                className="text-customLogoColor mt-1 text-lg"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Register
              </button>
            </div>
          </form>
        </div>
        <div className="mt-6 text-red-500">
          <h2>{errorMessage}</h2>
        </div>
      </main>
    </div>
  );
}

/* credit: https://jasonwatmore.com/post/2021/08/19/next-js-11-user-registration-and-login-tutorial-with-example-app
https://codesandbox.io/s/showhide-password-on-toggle-in-react-hooks-95qcz?file=/src/App.js
*/
