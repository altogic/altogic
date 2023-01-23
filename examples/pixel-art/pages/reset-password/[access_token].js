import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { KeyIcon } from "@heroicons/react/solid";
import { authActions } from "../../redux/auth/authSlice";
import Button from "../../components/button";
import Input from "../../components/input";
import Link from "next/link";
import MyHead from "../../components/my-head";

export default function ResetPassword() {
  const schema = new yup.ObjectSchema({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
    passwordConfirmation: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const { access_token } = router.query;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = ({ password }) => {
    setIsLoading(true);
    dispatch(
      authActions.resetPasswordRequest({
        accessToken: access_token,
        newPassword: password,
        onSuccess: () => {
          router.push("/reset-password-successful");
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
                  Reset password
                </h1>
                <p className="mt-4 text-base tracking-sm text-slate-600">
                  Must be at least 8 characters.
                </p>
              </div>

              <div className="mt-8">
                <div className="mt-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      label="New Password"
                      id="password"
                      type="password"
                      name="password"
                      register={register("password")}
                      error={errors.password}
                      placeholder="New Password"
                    />

                    <Input
                      label="New Password Confirm"
                      id="passwordConfirmation"
                      type="password"
                      name="passwordConfirmation"
                      register={register("passwordConfirmation")}
                      error={errors.passwordConfirmation}
                      placeholder="New Password Confirm"
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
