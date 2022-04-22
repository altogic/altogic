import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useContext, useState, useRef } from "react";
import { UserContext } from "../../context/userContext";
import { altogic } from "../../helpers/client";
import CustomButton from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
function SignIn() {
  const emailInputElement = useRef();
  const passwordInputElement = useRef();
  const router = useRouter();
  const { authStateChanged, setIsAuth } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function reSendVerificationMailHandler() {
    try {
      let email = emailInputElement.current.value;
      const { errors } = await altogic.auth.resendVerificationEmail(email);
      if (errors) {
        setMessage(errors.items[0].message);
      } else {
        router.push("/auth/verification-sent");
      }
    } catch (error) {
      setMessage(error.message.toString());
    }
  }
  async function signInHandler() {
    setLoading(true);
    try {
      let email = emailInputElement.current.value;
      let password = passwordInputElement.current.value;
      const { user, session, errors } = await altogic.auth.signInWithEmail(
        email,
        password
      );
      if (user) {
        setMessage("");
        //Send a request to /api/login route to set the cookie for SSR.
        //Only needed if you are going to do SSR.
        await fetch("/api/login", {
          method: "POST",
          credentials: "same-origin",
          body: JSON.stringify({ token: session.token }),
          headers: { "Content-Type": "application/json" },
        });
        authStateChanged(session, user);
        setIsAuth(true);
        router.push("/profile");
      } else {
        setMessage(errors.items[0].message);
        setLoading(false);
      }
    } catch (error) {
      setMessage(error.message.toString());
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-sm space-y-8 px-12 py-12  border border-gray-300 shadow-lg ">
        <div className="mx-auto w-72">
          <h2 className="font-semibold text-center text-3xl text-gray-800">
            Welcome back 🥳
          </h2>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            ref={emailInputElement}
            type="email"
            name="email"
            id="email"
            className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              ref={passwordInputElement}
              type="password"
              name="password"
              id="password"
              placeholder="******"
              className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500  w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
            />
          </div>
        </div>

        <div className="text-sm">
          <Link href="/auth/forgot-password">
            <a className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <ErrorMessage message={message}></ErrorMessage>
          {message === "The email address has not been verified yet." ? (
            <CustomButton
              buttonValue={"Resend the verification mail"}
              onClick={reSendVerificationMailHandler}
            />
          ) : (
            <></>
          )}
          <CustomButton
            loading={loading}
            buttonValue={"Sign In"}
            onClick={signInHandler}
          />
        </div>
        <div className="mt-6 text-center px-8">
          <div className="text-center text-xs ">
            If you don&apos;t have an account,
            <Link href="/auth/sign-up">
              <a className="text-indigo-600 hover:text-indigo-500"> sign up.</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
