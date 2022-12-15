import { CheckIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";

export default function ResetPasswordSuccessfull() {
  return (
    <div className="relative h-screen">
      <div className="h-full">
        <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-lg lg:w-[360px]">
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 mb-6 ring-8 ring-indigo-50">
                <CheckIcon className="w-7 h-7 text-indigo-600" />
              </span>
              <h1 className="text-3xl font-semibold text-slate-800">
                Password Reset
              </h1>
              <p className="mt-4 mb-11 text-base tracking-sm text-slate-600">
                Your password has been reset successfully.
              </p>
              <Link to="/sign-in">
                <span className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Continue to login
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
