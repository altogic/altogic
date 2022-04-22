import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { altogic } from "../../helpers/client";
import CustomButton from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";

function PasswordReset(props) {
  const passwordInputElement = useRef();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.access_token == null) {
      setMessage(props.error);
    }
  }, [props]);

  async function resetPasswordHandler() {
    setLoading(true);
    try {
      let password = passwordInputElement.current.value;
      let access_token = props.access_token;
      //This line resets the password with the token we obtain from URL.
      const { errors } = await altogic.auth.resetPwdWithToken(
        access_token,
        password
      );
      if (errors) {
        setMessage(errors.items[0].message);
      } else {
        router.replace("/auth/sign-in");
      }
    } catch (error) {
      setMessage(error.message.toString());
    }
    setLoading(false);
  }

  return (
    <div className="mt-6">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-slate-700"
      >
        Your new password
      </label>
      <div className="mt-1">
        <input
          ref={passwordInputElement}
          type="password"
          name="password"
          id="password"
          placeholder="******"
          className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500  w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
        />
      </div>
      <div className="mt-6 text-center">
        <ErrorMessage message={message}></ErrorMessage>
        <CustomButton
          loading={loading}
          buttonValue={"Change password"}
          onClick={resetPasswordHandler}
        />
      </div>
    </div>
  );
}

export default PasswordReset;
