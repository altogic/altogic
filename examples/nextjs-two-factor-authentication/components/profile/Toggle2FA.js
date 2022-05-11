import { useState } from "react";
import { altogic } from "../../helpers/client";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import ErrorMessage from "../ui/ErrorMessage";
import Switch from "../ui/Switch";

function Toggle2FA(props) {
  const [enabled, setEnabled] = useState(props.user.twoFactorAuth);
  const [message, setMessage] = useState("");
  const context = useContext(UserContext);

  async function toggleFunction() {
    const { data, errors } = await altogic.db
      .model("users")
      .object(props.user._id)
      .update({
        twoFactorAuth: !enabled,
      });
    if (data) {
      setEnabled(!enabled);
      context.authStateChanged(context.session, data);
    } else {
      setMessage(errors.items[0].message);
    }
  }

  return (
    <div className="flex justify-between items-center mx-4">
      {enabled
        ? "Disable 2-Factor Authentication:"
        : "Enable 2-Factor Authentication:"}
      <Switch
        enabled={props.user.twoFactorAuth}
        onClick={toggleFunction}
      ></Switch>
      <ErrorMessage error={message}></ErrorMessage>
    </div>
  );
}

export default Toggle2FA;
