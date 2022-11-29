import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../components/button";
import Input from "../components/inputs/input";
import Logo from "../components/logo";
import AuthSidebar from "../components/auth-sidebar";
import { authActions } from "../redux/auth/authSlice";

export default function CreateAnAccount() {
  const schema = new yup.ObjectSchema({
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters")
      .required("Password is required"),
    userName: yup
      .string()
      .required("Username is required ")
      .matches(/^[a-zA-Z0-9_]+$/, "Only alphabets are allowed for this field ")
      .min(3, "Username must be at least 3 characters")
      .max(15, "Username must be at most 15 characters"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const checkUserName = (e) => {
    const userName = e.target.value;
    dispatch(
      authActions.checkUserNameRequest({
        userName,
        onSuccess: (isAvailable) => {
          if (isAvailable) {
            clearErrors("userName");
          } else {
            setError("userName", {
              type: "manuel",
              message: "This username already exists.",
            });
          }
        },
      })
    );
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    dispatch(
      authActions.registerRequest({
        userReq: data,
        onSuccess: () => {
          navigate(`/email-verification/${data.email}`);
          setIsLoading(false);
        },
        onFailure: (errorList) => {
          _.forEach(errorList.items, (err) => {
            switch (err?.details?.field) {
              case "userName":
                setError("userName", {
                  type: "manuel",
                  message: err?.message,
                });
                break;
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
                if (err.message.includes("userName")) {
                  setError("userName", {
                    type: "manuel",
                    message: "This username already exists.",
                  });
                } else {
                  setError("email", {
                    type: "manuel",
                    message: err?.message,
                  });
                }
                break;
            }
          });
          setIsLoading(false);
        },
      })
    );
  };

  return (
    <div className="relative h-screen">
      <div className="grid xl:grid-cols-2 h-full">
        <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-lg lg:w-[360px]">
            <div className="flex flex-col items-center">
              <Logo primary />
              <h2 className="text-4xl font-bold text-slate-800">Register</h2>
              <p className="mt-3 text-base text-slate-600 tracking-sm">
                Start enjoying.
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Username"
                    id="userName"
                    name="userName"
                    placeholder="johndoe"
                    onBlur={checkUserName}
                    register={register("userName")}
                    error={errors.userName}
                  />

                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    placeholder="johndoe@example.com"
                    register={register("email")}
                    error={errors.email}
                  />

                  <div className="space-y-1">
                    <div className="mt-1">
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

                      <span className="inline-block text-slate-500 mt-2 text-sm tracking-sm">
                        Must be at least 8 characters.
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    loading={isLoading}
                  >
                    Get Started
                  </Button>
                  <div className="mt-6 relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                  </div>
                </form>
                <p className="text-center text-sm text-slate-500 mt-10">
                  You have already an account?{" "}
                  <Link
                    to="/sign-in"
                    className="font-medium text-pink-700 tracking-sm hover:text-pink-500"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <AuthSidebar />
      </div>
    </div>
  );
}
