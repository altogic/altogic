import { UserContext, useUserContext } from "../../context/userContext";
import { altogic } from "../../helpers/client";

function SessionItem(props) {
  const { creationDtm, userAgent, token } = props.session;
  const { session, getAllSessionsFromAltogic } = useUserContext(UserContext);

  var humanReadableDate = new Date(creationDtm).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    hour12: "false",
    minute: "2-digit",
  });

  async function deleteHandler() {
    await altogic.auth.signOut(token);
    await getAllSessionsFromAltogic();
  }

  return (
    <tr className=" mx auto">
      <td className="px-6 py-4 text-xs text-gray-900">{humanReadableDate}</td>
      <td className="px-6 py-4 text-xs text-gray-900">{userAgent.family}</td>

      <td className="px-6 py-4 text-xs text-gray-900">
        {session.token === token ? (
          "This session."
        ) : (
          <button
            className="bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs leading-5 rounded-md font-semibold text-white "
            onClick={deleteHandler}
          >
            Sign out
          </button>
        )}
      </td>
    </tr>
  );
}

export default SessionItem;
