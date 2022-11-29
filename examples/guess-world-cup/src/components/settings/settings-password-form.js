import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { authActions } from "../../redux/auth/authSlice";
import Button from "../button";
import Input from "../inputs/input";

export default function SettingsPasswordForm() {
  const schema = new yup.ObjectSchema({
    currentPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
    newPassword: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = ({ currentPassword, newPassword }) => {
    setIsLoading(true);
    dispatch(
      authActions.changePasswordRequest({
        currentPassword,
        newPassword,
        onSuccess: () => {
          toast.success("Password changed successfully");
          setIsLoading(false);
          clearErrors();
        },
        onFailure: (errorList) => {
          _.forEach(errorList.items, (err) => {
            if (err.message.includes("current password")) {
              setError("currentPassword", {
                type: "manuel",
                message: "Current password is wrong.",
              });
            } else {
              setError("newPassword", {
                type: "manuel",
                message: err?.message,
              });
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
              Change Password
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <Input
                label="Current Password"
                id="currentPassword"
                name="currentPassword"
                type="password"
                register={register("currentPassword")}
                error={errors.currentPassword}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <Input
                label="New Password"
                id="newPassword"
                name="newPassword"
                type="password"
                register={register("newPassword")}
                error={errors.newPassword}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <Input
                label="Confirm New Password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                register={register("confirmNewPassword")}
                error={errors.confirmNewPassword}
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
