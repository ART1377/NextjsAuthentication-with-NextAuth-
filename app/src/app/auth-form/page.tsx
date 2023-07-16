"use client";
import { useRef, useState } from "react";
import createUser from "../lib/createUser";
import { useSession, signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/Loader";

const AuthForm = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is Required"),
      password: Yup.string()
        .required("Password is Required")
        .min(6, "Password must be 6 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter"),
      // .matches(/[^\w]/, 'Password requires a symbol')
    }),
    onSubmit: () => {
      submitHandler()
    },
  });
  const { data: session, status } = useSession();

  const [login, setLogin] = useState(true);

  async function submitHandler() {


    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (Object.values(formik.errors).length !== 0) {
      for (let value of Object.values(formik.errors)) {
        toast.error(`${value}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      return;
    }

    if (login) {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      console.log("login result", result);
      if (!result?.error) {
        toast.success("you are logged in!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      if (result?.error) {
        toast.error(`${result?.error}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      try {
        const result = await createUser(email!, password!);
        if (result?.message === "Created User") {
          toast.success("you are Signed Up!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          throw new Error(result?.message);
        }
      } catch (error) {
        let errorMessage = error?.toString().split(" ").splice(1).join(" ");
        console.log(errorMessage);
        toast.error(`${errorMessage}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  if (status === "loading") {
    return <Loader />;
  }
  return (
    <>
      <div>
        <form action="" className="m-5 p-5" onSubmit={formik.handleSubmit}>
          <h3 className="text-uppercase mb-2">{login ? "Login" : "SignUp"}</h3>
          <div>
            <label
              htmlFor="email"
              className={`form-label w-100 ${
                formik.errors.email && ["text-danger"]
              }`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${
                formik.errors.email
                  ? ["border border-2 border-danger"]
                  : ["border border-2 border-info"]
              }`}
              // onChange={(event) => setEmail(event.target.value)}
              ref={emailRef}
              {...formik.getFieldProps("email")}
            />
            {formik.errors.email ? (
              <small className="text-danger ps-2">{formik.errors.email}</small>
            ) : null}
          </div>
          <div className="my-3">
            <label
              htmlFor="password"
              className={`form-label w-100 ${
                formik.errors.password && ["text-danger"]
              }`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`form-control ${
                formik.errors.password
                  ? ["border border-2 border-danger"]
                  : ["border border-2 border-info"]
              }`}
              // onChange={(event) => setPassword(event.target.value.toString())}
              ref={passwordRef}
              {...formik.getFieldProps("password")}
            />
            {formik.errors.password ? (
              <small className="text-danger ps-2">
                {formik.errors.password}
              </small>
            ) : null}
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              {login ? "login" : "create account"}
            </button>
            <button
              type="button"
              className="btn btn-danger mx-2"
              onClick={() => setLogin((prev) => !prev)}
            >
              {login ? "create account" : "already have an account?"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
};

export default AuthForm;
