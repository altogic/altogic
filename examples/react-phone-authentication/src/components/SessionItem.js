import { useContext, useState } from "react";
import altogic from "../helpers/altogic";
import { AuthenticationContext } from "../context/AuthenticationContext";
import SecondaryButton from "./Buttons/SecondaryButton";

const SessionItem = (props) => {
  const context = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);

  const humanReadableDate = (datetime) => {
    return new Date(datetime).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: "false",
      minute: "2-digit",
    });
  };

  const killSession = async (event) => {
    setLoading(true);
    event.preventDefault();
    await context.signOutSelectedSession(props.session.token);
    setLoading(false);
  };

  const isCurrentSession =
    props.session.token === altogic.auth.getSession().token;

  return (
    <tr className="bg-white border-b hover:bg-slate-100">
      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        {humanReadableDate(props.session.creationDtm)}
      </td>
      <td className="px-6 py-4">{props.session.userAgent.family}</td>
      <td className="px-6 py-4">{props.session.userAgent.os.family}</td>
      <td className="px-6 py-4">
        <SecondaryButton
          loading={loading}
          customClickEvent={killSession}
          content="Sign Out"
        />
        {isCurrentSession ? (
          <p className="text-indigo-700 ml-auto"> (Current Session)</p>
        ) : (
          <></>
        )}
      </td>
    </tr>
  );
};

export default SessionItem;
