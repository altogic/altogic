import React from "react";
import { useAuth } from "../contexts/Auth";

export function Account() {
  const { user } = useAuth();

  return (
    <div>
      {/* Display profile card at the center of the page with gradient background*/}

      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Account
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Display your profile and account information. You can also update
              your password and email address.
            </p>
          </div>
          {/* Create a container to display at the center */}

          <div className="mt-10">
            <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-col-3 justify-items-start w-full">
              <div className=" relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: profile */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Full name
                  </p>
                </dt>
                <dd className="ml-16 text-base text-gray-500">{user?.name}</dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: lightning-bolt */}
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Plan
                  </p>
                </dt>
                {/* If user.plan === 'Free plan' display upgrade plan button near the user.plan info */}
                <dd className="ml-16 text-base text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-100 border-gray-900 shadow-sm">
                    <p className="text-sm font-normal text-gray-800">
                      {user?.plan}
                    </p>
                  </span>
                  {user?.plan === "Free Plan" ? (
                    <button
                      className="bg-gray-700 hover:bg-gray-900 text-white text-xs font-normal px-2 py-1 rounded ml-2"
                      onClick={() => {
                        window.location.href = "/pricing";
                      }}
                    >
                      Upgrade Plan
                    </button>
                  ) : null}
                </dd>{" "}
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: email */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Email verification
                  </p>
                </dt>
                <dd className="ml-16 text-base text-gray-500">
                  {/* If user.emailVerified === true display verified tag */}
                  {user?.emailVerified ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800">
                      <p className="text-sm font-normal text-green-600">
                        Verified
                      </p>
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-100 text-red-800">
                      <p className="text-sm font-normal text-red-600">
                        Not verified
                      </p>
                    </span>
                  )}
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: email */}
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Email address
                  </p>
                </dt>
                <dd className="ml-16 text-base text-gray-500">{user?.email}</dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: email */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Customer ID
                  </p>
                </dt>
                <dd className="ml-16 text-base text-gray-500">
                  {user?.customerID}
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: email */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Phone verification
                  </p>
                </dt>
                <dd className="ml-16 text-base text-gray-500">
                  {/* If user.phoneVerified === true display verified tag */}
                  {user?.phoneVerified && user?.phoneVerified ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800">
                      <p className="text-sm font-normal text-green-600">
                        Verified
                      </p>
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-100 text-red-800">
                      <p className="text-sm font-normal text-red-600">
                        Not verified
                      </p>
                    </span>
                  )}
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: clock */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Last Login
                  </p>
                </dt>
                <dd className="ml-16 text-base text-gray-500">
                  {new Date(user?.lastLoginAt).toLocaleString()}
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: email */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Subscription ID
                  </p>
                </dt>
                <dd className="ml-16 text-base text-gray-500">
                  {user?.subscriptionID}
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 text-white">
                    {/* Heroicon name: clock */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    First Login
                  </p>
                </dt>
                <dd className="ml-16 text-base text-gray-500">
                  {new Date(user?.signUpAt).toLocaleString()}
                </dd>
              </div>
            </dl>
            {/* Display a button to navigate invoices page */}
            <div className="mt-10 flex flex-row mx-auto justify-center">
              <a
                href="/invoices"
                className="bg-gray-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                View invoices
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
