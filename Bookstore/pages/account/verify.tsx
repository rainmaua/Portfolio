import { Inter } from "@next/font/google";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { use, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Head from "../../components/Head";
import Image from "next/image";
import emailImage from "../../images/email_sent3.png";

const inter = Inter({ subsets: ["latin"] });

Verify.defaultProps = {
  errors: "",
};

type FormValues = {
  code: string;
};

export default function Verify() {
  const [token, setToken] = useState("");
  const router = useRouter();
  // form validation rules
  const validationSchema = Yup.object({
    code: Yup.string().required("Required").min(6, "At least 6 numbers"),
  });

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function sayHello() {
    alert("You clicked me!");
  }

  const getToken = async () => {
    try {
      const testUser = sessionStorage.getItem("user");
      const userObj = JSON.parse(testUser);
      return userObj.token;
    } catch {
      router.push("/account/login");
    }
  };

  function onSubmit(code) {
    console.log(code);
    return fetch("/api/user/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(code),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .then(
        (code) => {
          const prevData = JSON.parse(sessionStorage.getItem('user'))
          prevData.verified = true
          sessionStorage.setItem('user', JSON.stringify(prevData))
          setSuccessMessage("Email has been verified.");
          setErrorMessage("");
        },
        () => {
          setSuccessMessage("");
          setErrorMessage("Verification code is incorrect");
        }
      );
  }

  const onInvalid = (errors) => console.error(errors);

  useEffect(() => {
    getToken().then((response) => {
      setToken(response);
    });
  });

  return (
    <div className={inter.className}>
      <Head title="Log in" />
      <main className="flex flex-col items-center p-4">
        <div className="flex flex-col items-center p-10 max-w-md border border-black rounded bg-white dark:border-white">
          <Image
            className=""
            src={emailImage}
            alt="Banner Image"
            priority={true}
            width={200}
          />
          <form className="mb-12" onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <div className="my-6 text-center">
              <label className="text-2xl" htmlFor="username">
                Verify your email
              </label>
              <div className="my-5">
                Check the email that is associated with your account for the
                verification code
              </div>
              <div className="float-right text-xl mt-1 text-red-600">
                {errors.code?.message}
              </div>
              <input
                placeholder="Verification code"
                className="px-3 py-2 w-full border-2 border-black rounded"
                type="text"
                name="code"
                id="code"
                {...register("code")}
              />
            </div>
            <div className="flex justify-center">
              <button
                disabled={formState.isSubmitting}
                className="bg-customLogoColor hover:bg-green-700 text-white font-bold py-2 px-4 w-full rounded"
                type="submit"
              >
                {formState.isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Verify
              </button>
            </div>
          </form>
        </div>
        <div className="mt-6 text-red-600">
          <h2>{errorMessage}</h2>
        </div>
        <div className="mt-6 text-green-600">
          <h2>{successMessage}</h2>
        </div>
      </main>
    </div>
  );
}
