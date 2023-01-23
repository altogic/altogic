import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Logo from "../components/logo";
import Button from "../components/button";
import Input from "../components/input";
import { authActions } from "../redux/auth/authSlice";
import { MyRouter } from "../routes";
import { useRouter } from "next/router";
import Link from "next/link";
import MyHead from "../components/my-head";

export default function SignIn() {
  const schema = new yup.ObjectSchema({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters")
      .required("Password is required"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { email: emailQuery, pixelId: pixelIdQuery } = router.query;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (emailQuery) setValue("email", emailQuery);
  }, [emailQuery]);

  const onSubmit = ({ email, password }) => {
    setIsLoading(true);
    dispatch(
      authActions.signInRequest({
        email,
        password,
        emailQuery,
        pixelIdQuery,
        onSuccess: (pixelSlug) => {
          if (pixelSlug) {
            router.push(MyRouter.pixel(pixelSlug));
          } else {
            router.push("/");
          }
          setIsLoading(false);
        },
        onFailure: (errorList) => {
          _.forEach(errorList.items, (err) => {
            switch (err?.details?.field) {
              case "email":
                setError("email", {
                  type: "manuel",
                  message: err?.message,
                });
                break;
              case "password":
                setError("password", {
                  type: "manuel",
                  message: err?.message,
                });
                break;

              default:
                setError("email", {
                  type: "manuel",
                  message: err?.message,
                });
                break;
            }
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
              <div className="flex flex-col items-center">
                <Logo primary w="20px" />
                <h2 className="text-4xl font-bold text-slate-800">
                  Welcome Back!
                </h2>
                <p className="mt-3 text-base text-slate-600 tracking-sm">
                  Welcome back! Please enter your details.
                </p>
              </div>

              <div className="mt-8">
                <div className="mt-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                      label="Email"
                      id="email"
                      name="email"
                      disabled={!_.isNil(emailQuery)}
                      register={register("email")}
                      error={errors.email}
                      placeholder="johndoe@example.com"
                    />

                    <div className="space-y-1">
                      <Input
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        register={register("password")}
                        error={errors.password}
                      />
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="text-sm">
                        <Link
                          className="font-medium text-violet-700 tracking-sm hover:text-violet-500"
                          href="/forgot-password"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        type="submit"
                        className="w-full flex mb-4 justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        loading={isLoading}
                      >
                        Sign in
                      </Button>
                    </div>
                  </form>
                  <p className="text-center mt-8 text-sm text-slate-500">
                    Don&apos;t have an account yet?{" "}
                    <Link
                      href="/create-an-account"
                      className="font-medium text-violet-700 tracking-sm hover:text-violet-500"
                    >
                      Create an account.
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
