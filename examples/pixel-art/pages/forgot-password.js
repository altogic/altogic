import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { KeyIcon } from "@heroicons/react/solid";
import { authActions } from "../redux/auth/authSlice";
import Button from "../components/button";
import Input from "../components/input";
import Link from "next/link";
import { useRouter } from "next/router";
import MyHead from "../components/my-head";

export default function ForgotPassword() {
  const schema = new yup.ObjectSchema({
    email: yup.string().email().required("Email is required"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = ({ email }) => {
    setIsLoading(true);
    dispatch(
      authActions.forgotPasswordRequest({
        email,
        onSuccess: () => {
          router.push(`/forgot-password-email?email=${email}`);
          setIsLoading(false);
        },
        onFailure: (errorList) => {
          _.forEach(errorList.items, (err) => {
            setError("email", {
              type: "manuel",
              message: err?.message,
            });
          });
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
                  Forgot password?
                </h1>
                <p className="mt-4 text-base tracking-sm text-slate-600">
                  No worries, we’ll send you reset instructions.
                </p>
              </div>

              <div className="mt-8">
                <div className="mt-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      label="Email"
                      id="email"
                      name="email"
                      placeholder="johndoe@example.com"
                      register={register("email")}
                      error={errors.email}
                    />
                    <div>
                      <Button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        loading={isLoading}
                      >
                        Reset password
                      </Button>
                    </div>
                  </form>
                  <div className="text-center mt-8">
                    <Link
                      className="inline-flex items-center gap-2 text-sm font-medium tracking-sm text-slate-500"
                      href="/sign-in"
                    >
                      <ArrowLeftIcon className="w-5 h-5 text-slate-500" />
                      Back to login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
