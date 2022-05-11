import React from "react";
import ErrorMessage from "../ui/ErrorMessage";
import { useRef, useState, useContext } from "react";
import NotificationContext from "../../context/notificationContext";
import { altogic } from "../../helpers/client";
import CustomButton from "../ui/Button";

function ChangePassword() {
  const notificationContext = useContext(NotificationContext);
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const currentPasswordInputElement = useRef();
  const newPasswordInputElement = useRef();
  const [loading, setLoading] = useState(false);
  async function passwordChangeHandler() {
    setLoading(true);
    try {
      let newPassword = newPasswordInputElement.current.value;
      let currentPassword = currentPasswordInputElement.current.value;
      //This line changes the password.
      const { errors } = await altogic.auth.changePassword(
        newPassword,
        currentPassword
      );
      if (!errors) {
        notificationContext.showNotification({
          message: "Successfully changed your password!",
          status: "success",
        });
        setChangePasswordMessage("");
        newPasswordInputElement.current.value = null;
        currentPasswordInputElement.current.value = null;
      } else {
        setChangePasswordMessage(errors.items[0].message);
      }
    } catch (error) {
      setChangePasswordMessage(error.message.toString());
    }

    setLoading(false);
  }
  return (
    <div className="max-w-lg w-full space-y-8">
      <div className="mt-6">
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-slate-700"
        >
          Current password
        </label>
        <div className="mt-1">
          <input
            ref={currentPasswordInputElement}
            type="password"
            name="currentPassword"
            id="currentPassword"
            placeholder="******"
            className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500  w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
          />
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-slate-700"
        >
          New Password
        </label>
        <div className="mt-1">
          <input
            ref={newPasswordInputElement}
            type="password"
            name="newPassword"
            id="newPassword"
            placeholder="******"
            className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500  w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
          />
        </div>
      </div>
      <div className="mt-6 text-center">
        <ErrorMessage message={changePasswordMessage}></ErrorMessage>
        <CustomButton
          loading={loading}
          buttonValue={"Change your password"}
          onClick={passwordChangeHandler}
        />
      </div>
    </div>
  );
}

export default ChangePassword;
