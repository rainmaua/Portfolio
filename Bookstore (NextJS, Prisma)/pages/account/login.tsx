import { Inter } from "@next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { use, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Head from "../../components/Head";
const inter = Inter({ subsets: ["latin"] });
Login.defaultProps = {
  errors: "",
};

type FormValues = {
  username: string;
  password: string;
  email: string;
};

export default function Login() {
  const router = useRouter();
  // form validation rules
  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required").min(6, "At least 6 characters"),
  });

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  const { errors } = formState;

  const [hidePassword, setHidePassword] = useState(true);
  const toggleHidePassword = () => {
    setHidePassword(hidePassword ? false : true);
  };

  const welcomeMessage =
    router.query.message == "regsuccess"
      ? "Successfully Registered! You will need to verify your email to make transactions."
      : "Welcome Back!";
  const [errorMessage, setErrorMessage] = useState("");

  function onSubmit(user) {
    return fetch("/api/user/authenticate", {
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
        (user) => {
          sessionStorage.setItem("loggedin", "true");
          sessionStorage.setItem("user", JSON.stringify(user));
          sessionStorage.setItem("clickedLoginBtn", "true");
          // router.reload(); // allows reloading and the redirect
          // redirect
          // router.push("/");
          router.replace("/");

          // router.reload();
        },
        () => {
          setErrorMessage("Username or Password is Incorrect");
        }
      );
  }

  // function handleClickedLoginBtn() {
  //   if (clickedLoginBtn == true) {
  //     setClickedLoginBtn(false);
  //     router.push("/");
  //   }
  // }

  return (
    <div className={inter.className}>
      <Head title="Log in" />
      <main className="flex flex-col items-center p-4">
        <Link href="/" className="text-customLogoColor text-xl m-6">
          &lt;- Back To Home
        </Link>
        <div className="text-lg mt-4 mb-8">
          <h1>{welcomeMessage}</h1>
        </div>
        <div className="flex flex-col items-center p-10 max-w-md border border-black dark:border-white">
          <form className="mb-12" onSubmit={handleSubmit(onSubmit)}>
            <div className="text-3xl mb-6">
              <label htmlFor="username">Username</label>
              <div className="float-right text-xl mt-1 text-red-600">
                {errors.username?.message}
              </div>
              <input
              className="px-3 py-2 w-full"
                type="text"
                name="username"
                id="username"
                {...register("username")}
              />
            </div>
            <div className="text-3xl mb-6 relative">
              <label htmlFor="password">Password</label>
              <div className="float-right text-xl mt-1 text-red-600">
                {errors.password?.message}
              </div>
              <input
                className="px-3 py-2 w-full"
                type={hidePassword ? "password" : "text"}
                name="password"
                id="password"
                {...register("password")}
              />
              <a className="absolute right-3 bottom-3" onClick={toggleHidePassword}>
                {hidePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </a>
            </div>
            <div className="flex justify-center">
              <button
                disabled={formState.isSubmitting}
                className="mt-4 text-customLogoColor text-2xl"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Sign In
              </button>
            </div>
          </form>
          <p className="text-lg">
            Don't have an account?{" "}
            <Link href="/account/register" className="text-customLogoColor">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="mt-6 text-red-600">
          <h2>{errorMessage}</h2>
        </div>
      </main>
    </div>
  );
}

function useEffect(arg0: () => void, arg1: undefined[]) {
  throw new Error("Function not implemented.");
}
