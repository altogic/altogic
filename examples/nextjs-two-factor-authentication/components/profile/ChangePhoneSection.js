import { useState, useContext } from "react";
import { altogic } from "../../helpers/client";
import CustomButton from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/router";
import { CounterContext } from "../../context/CounterContext";

function ChangePhoneSection(props) {
  const [phoneNumber, setPhoneNumber] = useState();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const context = useContext(CounterContext);

  async function phoneChangeHandler() {
    setLoading(true);
    try {
      // Send a request to /users/set-phone endpoint with a null request body
      // and phone number as the query string parameter.
      const { errors } = await altogic.endpoint.post("/users/set-phone", null, {
        phoneNumber: phoneNumber,
      });
      if (errors) {
        setMessage(errors.items[0].message);
      } else {
        // Initiate the counter.
        context.initiateCounter();
        // Go to the screen for SMS code verification.
        router.push({
          pathname: "change-phone-verification",
          query: { phoneNumber: phoneNumber, canVerify: true },
        });
      }
    } catch (error) {
      setMessage(error.message.toString());
    }

    setLoading(false);
  }

  return (
    <div className="max-w-lg w-full space-y-8">
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-slate-700"
        >
          New phone number
        </label>
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-indigo-600  w-full rounded-md sm:text-sm focus:ring-1 mb-5 mt-1 disabled:shadow-none"
          defaultCountry="TR"
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
      </div>
      <div className="mt-6 text-center">
        <ErrorMessage message={message}></ErrorMessage>
        <CustomButton
          loading={loading}
          buttonValue={
            props.user.phone ? "Change your phone" : "Set your phone"
          }
          onClick={phoneChangeHandler}
        />
      </div>
    </div>
  );
}

export default ChangePhoneSection;
