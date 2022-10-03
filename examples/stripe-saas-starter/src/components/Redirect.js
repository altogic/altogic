import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import { altogic } from "../helpers/altogic";

const Redirect = () => {
  // Create countdown from 3 to 0
  const [countdown, setCountdown] = React.useState(3);
  // Redirect to dashboard after 3 seconds
  const navigate = useNavigate();
  const { session, setSession, setUser, setAccessToken } = useAuth();
  const [errors, setError] = useState(null);

  const [searchParams] = useSearchParams();
  let queryParam = searchParams.get("action");

  // async fetch to get the access token from the backend
  // countdown is used to redirect to dashboard after 3 seconds

  useEffect(() => {
    async function fetchData() {
      if (queryParam === "change-email") {
        alert("Email changed successfully!");
        let { user } = await altogic.auth.getUserFromDB();
        setUser(user);
        navigate("/");
      } else if (queryParam === "reset-pwd") {
        let accessToken = searchParams.get("access_token");
        setAccessToken(accessToken ?? null);
        navigate("/reset-password");
      } else {
        let { session, user, errors } = await altogic.auth.getAuthGrant();
        setSession(session);
        setUser(user);
        // If error occurs, set error state
        if (errors) return setError(errors);
      }
    }

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // use setInterval and countdown from 3 to 0 and redirect to dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);
    if (countdown === 0) {
      clearInterval(interval);
      navigate("/");
    }
    return () => clearInterval(interval);
  }, [countdown, navigate]);

  return session ? (
    <div>
      {/* Display the redirecting page at the center of page and countdown from 3 to 0 */}
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3
              className="text-lg leading-6 font-medium text-gray-900"
              id="modal-headline"
            >
              Redirecting...
            </h3>
            {/* Display redirecting message to the user */}
            <div className="mt-2">
              <p className="text-sm text-gray-500 w-96">
                You will be redirected to the dashboard in{" "}
                <span className="font-bold">{countdown}</span> seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3
            className="text-lg leading-6 font-medium text-gray-900"
            id="modal-headline"
          >
            Error
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 w-96">
              {errors?.items?.map((error) => (
                // display span with error message and color
                <span key={error.message} className="text-red-500">
                  {error?.message}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Redirect;
