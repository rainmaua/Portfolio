import { Inter } from "@next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Head from "../../components/Head";
import ProductList from "../../components/ProductList";
import ProductItem from "../../components/ProductItem";
const inter = Inter({ subsets: ["latin"] });

export default function Profile() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false)
  const [updateButton, setUpdateButton] = useState(true);
  const toggleUpdateButton = () => {
    setUpdateButton(updateButton ? false : true);
  };
  const [token, setToken] = useState("");
  const [user, setUser] = useState({
    id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNum: "",
    verified: true
  });



  type FormValues = {
    first_name: string;
    last_name: string;
    username: string;
    // password: string;
    // email: string;
    phone_num: string;
  };

  async function checkVerified(newUser) {
    // if (await checkUserVerified(newUser.id)) {
    //   console.log("unverified")
    // } else {
    //   console.log("verified")
    // }

  }

  const getUser = async () => {
    try {
      const testUser = sessionStorage.getItem("user");
      const userObj = JSON.parse(testUser);
      return userObj;
    } catch {
      //router.push("/account/login");
      throw new Error("Error getting user");
    }
  };

  const validationSchema = Yup.object({
    first_name: Yup.string()
      .nullable()
      .transform((v, o) => (o === "" ? null : v)),
    last_name: Yup.string()
      .nullable()
      .transform((v, o) => (o === "" ? null : v)),
    username: Yup.string()
      .nullable()
      .transform((v, o) => (o === "" ? null : v)),
    // password: Yup.string()
    //   .nullable()
    //   .transform((v, o) => (o === "" ? null : v))
    //   .min(6, "At least 6 characters"),
    // email: Yup.string()
    //   .nullable()
    //   .transform((v, o) => (o === "" ? null : v))
    //   .email("Enter a Valid Address"),
    phone_num: Yup.string()
      .nullable()
      .transform((v, o) => (o === "" ? null : v))
      .matches(/^\d{3}-\d{3}-\d{4}$/, "###-###-####"),
  }).required();

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const [errorMessage, setErrorMessage] = useState("");

  const usernameMSG =
    "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`username`)";
  const emailMSG =
    "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`email`)";

  const [hidePassword, setHidePassword] = useState(true);
  const toggleHidePassword = () => {
    setHidePassword(hidePassword ? false : true);
  };

  function onSubmit(changes) {
    reset()
    Object.keys(changes).forEach((key) => {
      if (changes[key] == null) {
        delete changes[key];
      }
    });
    return fetch(`/api/user?id=${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(changes),
    })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .then(
        (userInfo) => {
          setUser(userInfo)
          // router.reload();
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
        }
      );
  }

  useEffect(() => {
    if (!sessionStorage.getItem("loggedin")) {
      router.push("/account/login");
    }
    getUser().then((response) => {
      if(response && response.token) {
        setToken(response.token);
      } else {
        router.push("/account/login");
        return
      }
      fetch(`/api/user?id=${response.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${response.token}`,
        },
      })
        .then((userInfo) => {
          if (!userInfo.ok) {
            return Promise.reject(userInfo);
          }
          return userInfo.json();
        })
        .then(
          (userInfo) => {
            setUser(userInfo);
            setLoaded(true)
          },
          (error) => {
            router.push("/account/login");
          }
        );
    },
    () => {
      router.push("/account/login");
    });
  }, []);

  return loaded ? (
    <div>
      <div className="flex flex-col w-fit items-center mx-auto border-2 border-black dark:border-white px-8 py-8 my-20">
        <h1 className="font-bold text-2xl mb-6">Your Profile</h1>
        <div className="w-64 flex flex-col items-start mb-3">
          <p>Username: {user.username}</p>
          <p>First Name: {user.firstName}</p>
          <p>Last Name: {user.lastName}</p>
          <p>Email: {user.email}</p>
          <p>Phone Number: {user.phoneNum}</p>
        </div>
        <div className={user.verified ? "hidden" : "mb-3 flex"}>
          <p className="text-red-600">Email is unverified.</p>
          <button
            onClick={() => router.push("/account/verify")}
            className="border rounded px-1 ml-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            Verify Email
          </button>
        </div>
        {updateButton ? (
          <div>
            <button
              onClick={toggleUpdateButton}
              className="border mt-2 rounded px-1 border-black dark:border-white hover:bg-white hover:text-black"
            >
              Update Info
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="">
                <p>Update Info</p>
                <label htmlFor="first_name">First Name</label>
                <div className="">{errors.first_name?.message}</div>
                <input
                  className="pl-1"
                  type="text"
                  name="first_name"
                  {...register("first_name")}
                />
              </div>
              <div className="">
                <label htmlFor="last_name">Last Name</label>
                <div className="">{errors.last_name?.message}</div>
                <input
                  className="pl-1"
                  type="text"
                  name="last_name"
                  {...register("last_name")}
                />
              </div>
              <div className="">
                <label htmlFor="username">Username</label>
                <div className="">{errors.username?.message}</div>
                <input
                  className="pl-1"
                  type="text"
                  name="username"
                  id="username"
                  {...register("username")}
                />
              </div>
              {/* <div className="relative" id="">
                <label htmlFor="password">Password</label>
                <div className="">{errors.password?.message}</div>
                <input
                  className="pl-1"
                  type={hidePassword ? "password" : "text"}
                  name="password"
                  id="password"
                  {...register("password")}
                />
                <a
                  onClick={toggleHidePassword}
                  className="absolute right-1 bottom-1"
                >
                  {hidePassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </a>
              </div>             */}
              {/* <div className="">
                <label htmlFor="email">Email</label>
                <div className="">{errors.email?.message}</div>
                <input
                  type="text"
                  name="email"
                  id="email"
                  {...register("email")}
                />
              </div> */}
              <div className="">
                <label htmlFor="phone_num">Phone Number</label>
                <div className="">{errors.phone_num?.message}</div>
                <input
                  className="pl-1"
                  type="tel"
                  name="phone_num"
                  id="phone_num"
                  placeholder="###-###-####"
                  {...register("phone_num")}
                />
              </div>
              <div className="">
                <button
                  disabled={formState.isSubmitting}
                  className="border mt-2 rounded px-1 hover text-green-600 hover:bg-green-600 hover:text-white border-green-600"
                >
                  {formState.isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Update
                </button>
                <button
                  className="border ml-2 mt-2 rounded px-1 border-red-600 hover:bg-red-600 hover:text-white text-red-600"
                  onClick={toggleUpdateButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
