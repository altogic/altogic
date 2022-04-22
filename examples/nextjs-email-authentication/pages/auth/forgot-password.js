import { useRef, useState } from "react";
import { Fragment } from "react";
import { altogic } from "../../helpers/client";
import CustomButton from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { checkCookies } from "cookies-next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";

function ForgotPassword() {
  const emailInputElement = useRef();
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function resetPasswordHandler() {
    setLoading(true);
    try {
      let email = emailInputElement.current.value;
      //This line sends a password recovery email to specified email address.
      const { errors } = await altogic.auth.sendResetPwdEmail(email);
      if (errors) {
        setErrorMessage(errors.items[0].message);
      } else {
        setEmailSent(true);
        setSuccessMessage("Password reset email has been sent.");
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage(error.message.toString());
    }
    setLoading(false);
  }
  return (
    <div className=" min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8">
        {!emailSent ? (
          <Fragment>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                ref={emailInputElement}
                type="email"
                name="email"
                id="email"
                className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 block w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="mt-6 text-center">
              {!emailSent && (
                <ErrorMessage message={errorMessage}></ErrorMessage>
              )}
              <CustomButton
                loading={loading}
                buttonValue={"Change password"}
                onClick={resetPasswordHandler}
              />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <ErrorMessage message={errorMessage}></ErrorMessage>
            <div className=" min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8  ">
              <div className="max-w-lg space-y-8 px-12 py-12 border border-gray-100 shadow-lg ">
                <FontAwesomeIcon
                  className="flex items-center justify-center mx-auto"
                  icon={faEnvelopeCircleCheck}
                  size={"5x"}
                  color="green"
                />
                <p className="text-xl text-center font-semibold leading-6 ">
                  {successMessage}
                </p>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}
export async function getServerSideProps({ req, res }) {
  if (checkCookies("token", { req, res })) {
    return {
      redirect: { destination: "/profile", permanent: false },
    };
  } else {
    return {
      props: {},
    };
  }
}
export default ForgotPassword;
