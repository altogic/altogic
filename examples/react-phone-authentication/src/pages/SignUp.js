import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { CounterContext } from "../context/CounterContext";
const SignUp = () => {
  // Define states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [haveError, setHaveError] = useState(false);

  // We use useNavigate() method to switch routes
  const navigate = useNavigate();

  // Since we store all authentication related functions and variables in AuthenticationContext,
  // we will be using this functions and variables with context such as context.signUp()

  const context = useContext(AuthenticationContext);

  // Verification code will expire in 150 seconds after successful signup process. We will use countdown timer to handle it.
  const counterContext = useContext(CounterContext);

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  // When the user clicks the 'Sign Up' button, this function will be executed first.
  const signup = async (event) => {
    setLoading(true);
    event.preventDefault();

    // We call the function context.signUp() that we early defined in AuthenticationContext, and store the Altogic response in resp variable.
    const resp = await context.signUp(phoneNumber, password, name);
    if (resp.errors == null) {
      sessionStorage.setItem("canVerify", true);

      // Temporary variable for the text in Verification page
      sessionStorage.setItem("phoneNumber", phoneNumber);

      // We initiate time counter and navigate user to Verification page
      counterContext.initiateCounter();
      navigate("/verification");
    } else {
      // Error scenarios such as existing user, short password, etc.
      setHaveError(true);
      setMessage(resp.errors.items[0].message);
    }
    setLoading(false);
  };

  return (
    <div className="flex mt-10">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-lg py-1 px-16 ">
        <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-md w-full space-y-8">
            <div>
              <img
                className="mx-auto w-auto"
                src={require("../images/logo.png")}
                alt="logo"
              />
              <h2 className="mt-1 font-semibold text-3xl text-gray-900 text-center">
                Sign Up
              </h2>
            </div>
            <form className="mt-8">
              <div className="mb-5">
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 w-full rounded-md sm:text-sm"
                  defaultCountry="US"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                />
              </div>

              <div className="mt-3">
                <label className="block font-bold text-sm text-slate-700">
                  Password *
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    value={password}
                    onChange={handlePassword}
                    placeholder="******"
                    className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none w-full rounded-md sm:text-sm disabled:shadow-none"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="text-sm font-bold text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none w-full rounded-md sm:text-sm disabled:shadow-none"
                  placeholder="Luke Ryan"
                  value={name}
                  onChange={handleName}
                />
              </div>

              <div className="mt-10 text-xs w-full text-gray-500">
                ​By creating an account, you agree to accept receiving SMS
                messages.
              </div>
              <div
                className="text-center"
                title={
                  phoneNumber === "" || password === ""
                    ? "Phone number and password are mandatory!"
                    : ""
                }
              >
                <PrimaryButton
                  content="Sign Up"
                  customClickEvent={signup}
                  fullWidth={true}
                  loading={loading}
                  disabled={password === "" || phoneNumber === "" || loading}
                />
              </div>
            </form>
            {haveError ? (
              <div className="mt-4 text-red-400 text-xs text-center">
                <FontAwesomeIcon icon={faCircleExclamation} />
                &nbsp;{message}
              </div>
            ) : (
              <></>
            )}
            <div className="text-center text-gray-400 text-sm">
              <p>
                Already have an account?&nbsp;
                <Link to="/signin" className="text-blue-600">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
