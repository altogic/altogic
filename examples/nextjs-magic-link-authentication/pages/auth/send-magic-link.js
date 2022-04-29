import { useState, useRef, useEffect } from "react";
import { altogic } from "../../helpers/client";
import ErrorMessage from "../../components/ui/ErrorMessage";
import CustomButton from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { checkCookies } from "cookies-next";

function SendMagicLink() {
  const emailInputElement = useRef();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function sendMagicLinkHandler() {
    setLoading(true);
    try {
      let email = emailInputElement.current.value;
      // Send the magic link email to specified email.
      const { errors } = await altogic.auth.sendMagicLinkEmail(email);
      if (errors) {
        setMessage(errors.items[0].message);
      } else {
        setEmailSent(true);
        setMessage("");
      }
    } catch (error) {
      setMessage(error.message.toString());
    }
    setLoading(false);
  }

  return (
    <div className=" min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8">
        <div className="my-6 ">
          {emailSent ? (
            <>
              <FontAwesomeIcon
                className="flex items-center justify-center mx-auto"
                icon={faEnvelopeCircleCheck}
                size={"5x"}
                color="green"
              />
              <p className="text-xl text-center font-semibold leading-6 ">
                Magic link is sent to your email. You need to click the link to
                sign-in.
              </p>
            </>
          ) : (
            <div className="mt-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Your email
              </label>
              <div className="mt-1">
                <input
                  ref={emailInputElement}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@example.com"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500  w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
                />
              </div>
              <div className="mt-6 text-center">
                <ErrorMessage message={message}></ErrorMessage>
                <CustomButton
                  loading={loading}
                  buttonValue={"Send the magic link"}
                  onClick={sendMagicLinkHandler}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  // If user is already signed in, redirect them to profile.
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

export default SendMagicLink;
