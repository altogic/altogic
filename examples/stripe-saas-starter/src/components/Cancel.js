import React from "react";
import { useAuth } from "../contexts/Auth";
import { altogic } from "../helpers/altogic";
import { useNavigate } from "react-router-dom";
export function Cancel() {
  const { session, setUser } = useAuth();
  const [countdown, setCountdown] = React.useState(3);
  const [errors, setError] = React.useState(null);
  const navigate = useNavigate();

  // get user info from DB and set user state
  React.useEffect(() => {
    const getUserInfo = async () => {
      const { user } = await altogic.auth.getUserFromDB();
      setUser(user);
      console.log(user);
      if (errors) return setError(errors);
    };
    getUserInfo();
  }, [errors, setUser]);

  // countdown from 3 to 0 and redirect to subscriptions page
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);
    if (countdown === 0) {
      clearInterval(interval);
      navigate("/pricing");
    }
    return () => clearInterval(interval);
  }, [countdown, navigate]);

  return session ? (
    <div>
      {/* Display the redirecting page at the center of page and countdown from 3 to 0 */}
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
              You have cancelled the payment...
            </h3>
            {/* Display redirecting message to the user */}
            <div className="mt-2">
              <p className="text-sm text-gray-500 w-96">
                You will be redirected to the pricing page in{" "}
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
                // display error items received from the server
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
}
