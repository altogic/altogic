import { useRef, useState } from "react";
import { altogic } from "../../helpers/client";
import { useContext } from "react";
import NotificationContext from "../../context/notificationContext";
import CustomButton from "../ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";

function ChangeEmail() {
  const notificationContext = useContext(NotificationContext);
  const newEmailInputElement = useRef();
  const currentPassword2InputElement = useRef();
  const [changeEmailMessage, setChangeEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function emailChangeHandler() {
    setLoading(true);
    try {
      let currentPassword = currentPassword2InputElement.current.value;
      let newEmail = newEmailInputElement.current.value;
      //This line changes the email.
      const { user, errors } = await altogic.auth.changeEmail(
        currentPassword,
        newEmail
      );
      if (user) {
        currentPassword2InputElement.current.value = null;
        newEmailInputElement.current.value = null;
        setChangeEmailMessage("");
        notificationContext.showNotification({
          message: "Click the link in your email to confirm your new email.",
          status: "pending",
        });
      } else {
        setChangeEmailMessage(errors.items[0].message);
      }
    } catch (error) {
      setChangeEmailMessage(error.message.toString());
    }
    setLoading(false);
  }
  return (
    <div className="max-w-lg w-full space-y-8">
      <div className="mt-6">
        <label
          htmlFor="currentPassword2"
          className="block text-sm font-medium text-slate-700"
        >
          Current password
        </label>
        <div className="mt-1">
          <input
            ref={currentPassword2InputElement}
            type="password"
            name="currentPassword2"
            id="currentPassword2"
            placeholder="******"
            className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500  w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
          />
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="newEmail"
          className="block text-sm font-medium text-slate-700"
        >
          New email
        </label>
        <div className="mt-1">
          <input
            ref={newEmailInputElement}
            type="email"
            name="newEmail"
            id="newEmail"
            placeholder="example@example.com"
            className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500  w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <ErrorMessage message={changeEmailMessage}></ErrorMessage>
        <CustomButton
          loading={loading}
          buttonValue={"Change your email"}
          onClick={emailChangeHandler}
        />
      </div>
    </div>
  );
}

export default ChangeEmail;
