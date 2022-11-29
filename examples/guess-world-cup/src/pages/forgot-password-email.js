import { ArrowLeftIcon } from "@heroicons/react/outline";
import { KeyIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import AuthSidebar from "../components/auth-sidebar";
import useQuery from "../helpers/useQuery";

export default function ForgotPasswordEmail() {
  const email = useQuery("email");

  return (
    <div className="relative h-screen">
      <div className="grid xl:grid-cols-2 h-full">
        <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-lg lg:w-[360px]">
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 mb-6 ring-8 ring-pink-50">
                <KeyIcon className="w-7 h-7 text-pink-600" />
              </span>
              <h1 className="mb-4 text-3xl font-bold text-slate-800">
                Check your email
              </h1>
              <p className="mb-6 text-base tracking-sm text-slate-500">
                We sent a password reset link to <br />{" "}
                <span className="text-slate-700 font-semibold">{email}</span>
              </p>
              <div className="text-center mt-8">
                <Link
                  className="inline-flex items-center gap-2 text-sm font-medium tracking-sm text-slate-500"
                  to="/sign-in"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-slate-500" />
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
        <AuthSidebar />
      </div>
    </div>
  );
}
