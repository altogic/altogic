import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { authActions } from "../../redux/auth/authSlice";
import Button from "../button";
import Input from "../inputs/input";

export default function SettingsEmailForm() {
  const schema = new yup.ObjectSchema({
    newEmail: yup.string().email().required("Email is required"),
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
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.email) setValue("currentEmail", user?.email);
  }, [user]);

  const onSubmit = ({ newEmail, password }) => {
    setIsLoading(true);
    dispatch(
      authActions.changeEmailRequest({
        newEmail,
        password,
        onSuccess: () => {
          navigate(`/email-verification/${newEmail}?operation=change`);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Change Email
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <Input
                label="Current Email"
                id="currentEmail"
                name="currentEmail"
                register={register("currentEmail")}
                disabled
                placeholder="johndoe@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <Input
                label="New Email"
                id="newEmail"
                name="newEmail"
                register={register("newEmail")}
                error={errors.newEmail}
                placeholder="johndoe@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                register={register("password")}
                error={errors.password}
              />
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Button
            type="submit"
            className="bg-pink-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
