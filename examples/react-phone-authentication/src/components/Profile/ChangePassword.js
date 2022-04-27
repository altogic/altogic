import { useContext, useState } from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { ModalContext } from "../../context/ModalContext";

const ChangePasswordForm = (props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [haveError, setHaveError] = useState(false);
  const modalContext = useContext(ModalContext);

  const handleNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleCurrentPassword = (event) => {
    setCurrentPassword(event.target.value);
  };

  const update = async (event) => {
    setHaveError(false);
    setMessage("");
    setLoading(true);
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    const resp = await props.context.changePassword(
      currentPassword,
      newPassword
    );
    if (resp.errors === null) {
      await modalContext.openModal(
        "Your password has been changed successfully!",
        "success"
      );
    } else {
      setHaveError(true);
      setMessage(resp.errors.items[0].message);
    }
  };

  return (
    <form>
      <div>
        <label className="block mt-2 text-sm font-medium text-slate-700">
          Current Password
        </label>
        <input
          type="password"
          name="text"
          className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-indigo-600 focus:ring-indigo-600 block w-full rounded-md sm:text-sm  mb-5 mt-1"
          placeholder="******"
          value={currentPassword}
          onChange={handleCurrentPassword}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          New Password
        </label>
        <input
          type="password"
          name="text"
          className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-indigo-600 focus:ring-indigo-600 block w-full rounded-md sm:text-sm  mb-7 mt-1"
          placeholder="******"
          value={newPassword}
          onChange={handleNewPassword}
        />
      </div>
      <div className="text-center">
        <PrimaryButton
          loading={loading}
          customClickEvent={update}
          content="Change Password"
          fullWidth={true}
        />
      </div>
      {haveError ? (
        <div className="mt-4 text-red-400 text-xs text-center">
          <FontAwesomeIcon icon={faCircleExclamation} />
          &nbsp;{message}
        </div>
      ) : (
        <></>
      )}
    </form>
  );
};

export default ChangePasswordForm;
