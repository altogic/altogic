import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useRef, useState } from "react";
import { altogic } from "../../helpers/client";
import CustomButton from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";

function SignUp() {
  const emailInputElement = useRef();
  const usernameInputElement = useRef();
  const passwordInputElement = useRef();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function signUpHandler() {
    setLoading(true);
    try {
      let email = emailInputElement.current.value;
      let password = passwordInputElement.current.value;
      let username = usernameInputElement.current.value;
      const { user, errors } = await altogic.auth.signUpWithEmail(
        email,
        password,
        username
      );
      if (user) {
        router.push("/auth/verification-sent");
      } else {
        setMessage(errors.items[0].message);
      }
    } catch (error) {
      setMessage(error.message.toString());
    }

    setLoading(false);
  }

  return (
    <div className=" min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8  ">
      <div className="max-w-sm space-y-8 px-12 py-12  border border-gray-300 shadow-lg ">
        <div className="mx-auto w-72 ">
          <h2 className="font-semibold text-center text-3xl text-gray-800">
            Welcome 🎉
          </h2>
        </div>
        <div className="">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-slate-700"
          >
            Username
          </label>
          <input
            ref={usernameInputElement}
            type="text"
            name="username"
            id="username"
            className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
            placeholder="johndoe"
          />
        </div>
        <div className="my-0">
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

        <div className="mt-6 ">
          <ErrorMessage message={message}></ErrorMessage>
          <CustomButton
            loading={loading}
            buttonValue={"Sign Up"}
            onClick={signUpHandler}
          />
        </div>
        <div className="mt-6 text-center px-8">
          <div className="text-center text-xs ">
            <p>
              Already have an account?
              <Link href="/auth/sign-in" className="text-blue-600">
                <a className="text-indigo-600 hover:text-indigo-500">
                  {" "}
                  Sign in
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
