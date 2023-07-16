"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRef } from "react";
import changePassword from "../lib/changePassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/Loader";

type Props = {};

const Protected = (props: Props) => {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Password is Required")
        .min(6, "Password must be 6 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter"),
      newPassword: Yup.string()
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

  // const {data: session } = useSession();
  // console.log(session);
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  async function submitHandler() {
    const oldPassword = oldPasswordRef.current?.value.toString();
    const newPassword = newPasswordRef.current?.value.toString();

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

    const result = await changePassword(
      oldPassword as string,
      newPassword as string
    );

    if (result?.message === "password changed successfully") {
      toast.success(`${result?.message}!`, {
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
    if (result?.message !== "password changed successfully") {
      toast.error(`${result?.message}!`, {
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

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <>
      <div>
        <form action="" className="m-5 p-5" onSubmit={formik.handleSubmit}>
          <h3 className="text-uppercase mb-2">change password</h3>
          <div>
            <label
              htmlFor="oldPassword"
              className={`form-label w-100 ${
                formik.errors.oldPassword && ["text-danger"]
              }`}
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              className={`form-control ${
                formik.errors.oldPassword
                  ? ["border border-2 border-danger"]
                  : ["border border-2 border-info"]
              }`}
              // onChange={(event) => setEmail(event.target.value)}
              ref={oldPasswordRef}
              {...formik.getFieldProps("oldPassword")}
            ></input>
            {formik.errors.oldPassword ? (
              <small className="text-danger ps-2">
                {formik.errors.oldPassword}
              </small>
            ) : null}
          </div>
          <div className="my-3">
            <label
              htmlFor="newPassword"
              className={`form-label w-100 ${
                formik.errors.newPassword && ["text-danger"]
              }`}
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className={`form-control ${
                formik.errors.newPassword
                  ? ["border border-2 border-danger"]
                  : ["border border-2 border-info"]
              }`}
              // onChange={(event) => setPassword(event.target.value.toString())}
              ref={newPasswordRef}
              {...formik.getFieldProps("newPassword")}
            ></input>
            {formik.errors.newPassword ? (
              <small className="text-danger ps-2">
                {formik.errors.newPassword}
              </small>
            ) : null}
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              change password
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

export default Protected;
