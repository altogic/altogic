import { useRef, useState, useContext, useEffect } from "react";
import NotificationContext from "../../context/notificationContext";
import { altogic } from "../../helpers/client";
import CustomButton from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";

function NameSection(props) {
  const nameInputElement = useRef();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);
  const notificationContext = useContext(NotificationContext);

  useEffect(() => {
    if (!nameChanged && props.user.name)
      nameInputElement.current.value = props.user.name;
  }, [props, nameChanged]);

  async function nameChangeHandler() {
    setLoading(true);
    try {
      const { data, errors } = await altogic.db
        .model("users")
        .object(props.user._id)
        .update({
          name: nameInputElement.current.value,
          //Set the name field required in the user model.
        });
      if (data) {
        setNameChanged(true);
        notificationContext.showNotification({
          message: "Successfully updated your username!",
          status: "success",
        });
        setMessage("");
      } else {
        setMessage(errors.items[0].message);
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
          htmlFor="username"
          className="block text-sm font-medium text-slate-700"
        >
          New username
        </label>
        <input
          ref={nameInputElement}
          type="text"
          name="username"
          id="username"
          placeholder="John Doe"
          className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-500  w-full rounded-md sm:text-sm focus:ring-1 invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 disabled:shadow-none"
        />
      </div>
      <div className="mt-6 text-center">
        <ErrorMessage message={message}></ErrorMessage>
        <CustomButton
          loading={loading}
          buttonValue={"Change your username"}
          onClick={nameChangeHandler}
        />
      </div>
    </div>
  );
}

export default NameSection;
