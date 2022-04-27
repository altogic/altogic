import { useContext, useState } from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { CounterContext } from "../../context/CounterContext";

const ChangePhone = (props) => {
  const [phoneNumber, setPhoneNumber] = useState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [haveError, setHaveError] = useState(false);
  const handleCurrentPassword = (event) => {
    setCurrentPassword(event.target.value);
  };
  const counterContext = useContext(CounterContext);

  const navigate = useNavigate();
  const update = async (event) => {
    setLoading(true);
    event.preventDefault();

    // Auth context function that triggers Altogic Client Library function
    const resp = await props.context.updatePhoneNumber(
      currentPassword,
      phoneNumber
    );
    if (resp.errors === null) {
      sessionStorage.setItem("newPhoneNumber", phoneNumber);
      sessionStorage.setItem("canVerify", true);
      counterContext.initiateCounter();
      navigate("/changePhoneNumber");
    } else {
      setHaveError(true);
      setMessage(resp.errors.items[0].message);
    }
    setLoading(false);
  };

  return (
    <form>
      <div>
        <label className="block mt-2 text-sm font-medium text-slate-700">
          New Phone Number
        </label>
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-indigo-600  w-full rounded-md sm:text-sm focus:ring-1 mb-5 mt-1 disabled:shadow-none"
          defaultCountry="US"
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Current Password
        </label>
        <input
          type="password"
          name="text"
          className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-indigo-600 focus:ring-indigo-600 block w-full rounded-md sm:text-sm  mb-7 mt-1"
          placeholder="******"
          value={currentPassword}
          onChange={handleCurrentPassword}
        />
      </div>
      <div className="text-center">
        <PrimaryButton
          loading={loading}
          customClickEvent={update}
          content="Update Phone Number"
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

export default ChangePhone;
