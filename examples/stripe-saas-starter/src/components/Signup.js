import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { altogic } from "../helpers/altogic";

export function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // Get email and password input values
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Calls `signUpWithEmail` function from the Altogic client library
    const { errors, user } = await altogic.auth.signUpWithEmail(
      email,
      password,
      {
        name: "John Doe",
      }
    );
    setLoading(false);
    // If error occurs, set error state
    if (errors) return setError(errors);

    // If user.emailVerified is false, redirect to verification page else redirect to home page

    if (user.emailVerified === false) {
      console.log("Email verification status:", user.emailVerified);
      navigate("/verification");
    } else {
      navigate("/account");
    }
  }

  return (
    // Create signup form with email, password, and submit button
    <div>
      <div className="min-h-screen bg-white flex justify-center">
        <div className="flex-0 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Sign up a new account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                <a
                  href="#/login"
                  className="font-medium text-gray-700 hover:text-gray-900"
                >
                  Welcome to SaaS starter kit
                </a>
              </p>
            </div>
            {errors && ( // If errors is not null or undefined
              <div className="mt-6">
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        There {errors.length > 1 ? "were" : "was"}{" "}
                        {errors.items.length}{" "}
                        {errors.length > 1 ? "errors" : "error"} with your
                        submission
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {errors.items.map((error, index) => (
                            <li key={index}>{error.message}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-18">
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        /* type="email" */
                        autoComplete="email"
                        ref={emailRef}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        ref={passwordRef}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-800 focus:border-gray-800 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember_me"
                        name="remember_me"
                        type="checkbox"
                        className="h-4 w-4 text-gray-900 focus:ring-gray-800 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember_me"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a
                        href="#/github"
                        className="font-medium text-gray-800 hover:text-gray-900"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    {/* Display spinning circle near the sign in text when the loading state is true*/}

                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                      {loading && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-50"
                            cx="12"
                            cy="12"
                            r="8"
                            stroke="currentColor"
                            strokeWidth="2"
                          ></circle>
                        </svg>
                      )}
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg
                          className="h-5 w-5 text-gray-800 group-hover:text-gray-900"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1545079968-1feb95494244?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
