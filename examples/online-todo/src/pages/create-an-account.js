import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Button from "../components/button";
import Input from "../components/inputs/input";
import Logo from "../components/logo";
import { authActions } from "../redux/auth/authSlice";
import useQuery from "../helpers/useQuery";
import { myRouter } from "../helpers/routes";

export default function CreateAnAccount() {
  const schema = new yup.ObjectSchema({
    name: yup
      .string()
      .required("Name is required ")
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(40, "Name must be at most 40 characters"),
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

  const emailQuery = useQuery("email");
  const workspaceIdQuery = useQuery("workspaceId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (emailQuery) setValue("email", emailQuery);
  }, [emailQuery]);

  const onSubmit = (data) => {
    setIsLoading(true);
    dispatch(
      authActions.registerRequest({
        userReq: data,
        emailQuery,
        workspaceIdQuery,
        onSuccess: (workspaceSlug) => {
          if (workspaceSlug) {
            navigate(myRouter.HOME(workspaceSlug));
          } else {
            navigate(`/email-verification/${data.email}`);
          }
          setIsLoading(false);
        },
        onFailure: (errorList) => {
          _.forEach(errorList.items, (err) => {
            switch (err?.details?.field) {
              case "name":
                setError("name", {
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
    <div className="relative h-screen">
      <div className="h-full">
        <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-lg lg:w-[360px]">
            <div className="flex flex-col items-center">
              <Logo primary />
              <h2 className="text-4xl font-bold text-slate-800">Register</h2>
              <p className="mt-3 text-base text-slate-600 tracking-sm">
                Plan your lists.
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Name"
                    id="name"
                    name="name"
                    placeholder="John"
                    register={register("name")}
                    error={errors.name}
                  />

                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    placeholder="johndoe@example.com"
                    disabled={!_.isNil(emailQuery)}
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
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                    className="font-medium text-indigo-700 tracking-sm hover:text-indigo-500"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
