"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container">
          <Link href={"/"} className="navbar-brand">
            Navbar
          </Link>

          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavId"
            aria-controls="collapsibleNavId"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse pb-1" id="collapsibleNavId">
            <ul className="navbar-nav me-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/auth-form">
                  AuthForm
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  href="/"
                  onClick={() => signOut()}
                >
                  Logout
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/protected">
                  Protected
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
