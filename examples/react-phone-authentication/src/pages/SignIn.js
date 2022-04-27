import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const SignIn = () => {
  // Define state variables
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [haveError, setHaveError] = useState(false);

  // We use useNavigate() method to switch routes
  const navigate = useNavigate();

  // Since we store all authentication related functions and variables in AuthenticationContext,
  // we will be using this functions and variables with context such as context.signin()
  const context = useContext(AuthenticationContext);

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  // When the user clicks the 'Sign In' button, this function will be executed first.
  const signin = async (event) => {
    setLoading(true);
    event.preventDefault();

    // We call the function context.signIn() that we early defined in AuthenticationContext,
    // and store the Altogic response in resp variable.
    const resp = await context.signIn(phoneNumber, password);
    if (resp.errors === null) {
      // isAuth state stores the data of is the user authenticated or not.
      //This state is setted false by default. After the successful login attempt, isAuth state is updated as true.
      // and we push router to /profile page.
      context.setIsAuth(true);
      navigate("/profile");
    } else {
      if (resp.errors.items[0].code === "phone_not_verified") {
        // Phone Not Verified have some router constraints.
        // It is unreachable from any page except login page. We set 'canVerify' variable as true to unlock Phone Not Verified page.
        sessionStorage.setItem("canVerify", true);
        navigate("/phone_not_verified");
      }
      setLoading(false);
      setHaveError(true);
      setMessage(resp.errors.items[0].message);
    }
  };

  return (
    <div className="flex mt-10">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-lg py-1 px-16">
        <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-md w-full space-y-8">
            <div className=" text-center">
              <img
                className="mx-auto w-auto"
                src={require("../images/logo.png")}
                alt="logo"
              />
              <h2 className="mt-1 font-semibold text-3xl text-gray-900 ">
                Sign In
              </h2>
              <p className="text-gray-400 text-md">
                Welcome! Please sign in to continue.
              </p>
            </div>

            <form className="mt-8">
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700">
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

              <div className="mt-1">
                <label className="block text-sm font-bold text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={handlePassword}
                  placeholder="******"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none  w-full rounded-md sm:text-sm invalid:border-red-500 invalid:text-red-600 disabled:shadow-none"
                />
              </div>
              <div className="text-right text-sm mb-4">
                <Link to="/resetPassword" className="text-blue-600 text-xs">
                  Forgot password?
                </Link>
              </div>
              <div
                className="my-3"
                title={
                  phoneNumber === "" || password === ""
                    ? "Phone number and password are mandatory!"
                    : ""
                }
              >
                <PrimaryButton
                  fullWidth={true}
                  loading={loading}
                  customClickEvent={signin}
                  content="Sign In"
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

            <div className="text-center text-gray-400  text-sm">
              <p>
                Don't have an account?&nbsp;
                <Link to="/signup" className="text-blue-600">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
