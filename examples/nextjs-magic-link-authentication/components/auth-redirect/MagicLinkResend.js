import { useState, useRef, useEffect } from "react";
import { altogic } from "../../helpers/client";
import ErrorMessage from "../ui/ErrorMessage";
import CustomButton from "../../components/ui/Button";

function MagicLinkResend(props) {
  const emailInputElement = useRef();
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function reSendMagicLinkHandler() {
    setLoading(true);
    try {
      const { errors } = await altogic.auth.sendMagicLinkEmail(
        emailInputElement.current.value
      );
      if (!errors) {
        setSuccessMessage("Your magic link email has been sent again.");
        emailInputElement.current.value = "";
      } else {
        setMessage(errors.items[0].message);
      }
    } catch (error) {
      setMessage(error.message.toString());
    }
    setLoading(false);
  }

  useEffect(() => {
    if (props.error) {
      setMessage(props.error);
    }
  }, [props]);

  return (
    <div className="mt-6 ">
      {successMessage !== "" ? (
        <p className="text-sm text-emerald-500 my-2 text-center">
          {successMessage}
        </p>
      ) : (
        <ErrorMessage message={message}></ErrorMessage>
      )}
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
          <CustomButton
            loading={loading}
            buttonValue={"Resend the magic link"}
            onClick={reSendMagicLinkHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default MagicLinkResend;
