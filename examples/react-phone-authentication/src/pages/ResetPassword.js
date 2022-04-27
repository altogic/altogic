import { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const ResetPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const context = useContext(AuthenticationContext);

  const sendCode = async (event) => {
    setLoading(true);
    event.preventDefault();
    await context.sendResetCode(phoneNumber);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);
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
                Type your phone number to reset your password:
              </h2>
            </div>
            <form className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 rounded-md"
                  defaultCountry="US"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                />
              </div>
              <PrimaryButton
                loading={loading}
                customClickEvent={sendCode}
                content="Send Verification Code"
                fullWidth={true}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
