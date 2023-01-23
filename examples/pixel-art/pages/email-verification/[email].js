import { useRouter } from "next/router";
import { KeyIcon } from "@heroicons/react/solid";
import _ from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Button from "../../components/button";
import { authActions } from "../../redux/auth/authSlice";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import MyHead from "../../components/my-head";

export default function EmailVerification() {
  const router = useRouter();
  const { email, operation } = router.query;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const resendVerificationEmail = () => {
    setIsLoading(true);
    dispatch(
      authActions.resendVerificationEmailRequest({
        email,
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Email sent successfully.");
        },
        onFailure: (errorList) => {
          toast.error(_.get(errorList, "items[0].message"));
          setIsLoading(false);
        },
      })
    );
  };

  return (
    <>
      <MyHead />
      <div className="relative h-screen">
        <div className="h-full">
          <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-lg lg:w-[360px]">
              <div className="text-center">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-100 mb-6 ring-8 ring-violet-50">
                  <KeyIcon className="w-7 h-7 text-violet-600" />
                </span>
                <h1 className="text-3xl font-semibold text-slate-800">
                  Check your email
                </h1>
                <p className="mt-4 text-base tracking-sm text-slate-600">
                  We sent a verification link to <br />{" "}
                  <span className="text-slate-700">{email}</span>
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                {operation !== "change" && (
                  <p className="mb-8 text-center text-sm text-slate-500 tracking-sm">
                    Didn’t receive the email?{" "}
                    <Button
                      className="border-0"
                      onClick={resendVerificationEmail}
                      disabled={isLoading}
                    >
                      <span className="font-medium text-violet-700 tracking-sm hover:text-violet-500">
                        Click to resend
                      </span>
                    </Button>
                  </p>
                )}
                <div className="text-center mt-8">
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-medium tracking-sm text-slate-500"
                    href={operation !== "change" ? "/sign-in" : "/"}
                  >
                    <ArrowLeftIcon className="w-5 h-5 text-slate-500" />
                    Back to {operation !== "change" ? "login" : "home"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
