import { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import PrimaryButton from "../components/Buttons/PrimaryButton";
function ResetPasswordCode(props) {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const context = useContext(AuthenticationContext);
  const handleCode = (event) => {
    setCode(event.target.value);
  };

  const handleNewPassword = (event) => {
    setNewPassword(event.target.value);
  };

  const reset = async (event) => {
    setLoading(true);
    event.preventDefault();
    await context.resetPassword(
      sessionStorage.getItem("phoneNumber"),
      newPassword,
      code
    );
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
  };

  return (
    <div className="flex bg-gray-bg1 my-8 mb-20">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-lg py-1 px-16">
        <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-md w-full space-y-8">
            <div>
              <img
                className="mx-auto h-24 w-auto"
                src={require("../images/logo.png")}
                alt="logo"
              />
              <h2 className="mt-8 font-semibold  text-center text-3xl text-gray-900 mb-">
                Reset Your Password
              </h2>
            </div>
            <form className="mt-8 space-y-6">
              <div className="mt-2">
                <label className="block text-sm font-bold text-slate-700">
                  Reset Code:
                </label>
                <input
                  value={code}
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
                  onChange={handleCode}
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-bold text-slate-700">
                  New Password:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
                  onChange={handleNewPassword}
                />
              </div>
              <div className="text-center">
                <PrimaryButton
                  loading={loading}
                  customClickEvent={reset}
                  content="Update Password"
                  fullWidth={true}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ResetPasswordCode;
