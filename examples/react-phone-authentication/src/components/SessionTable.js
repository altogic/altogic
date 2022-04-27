import { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import SessionItem from "./SessionItem";
import PrimaryButton from "./Buttons/PrimaryButton";

const SessionTable = (props) => {
  const context = useContext(AuthenticationContext);

  return (
    <table className="table-fixed text-sm text-left text-gray-500">
      <thead className="text-xs uppercase bg-gray-700 text-gray-100">
        <tr>
          <th className="px-6 py-3">Creation Date</th>
          <th className="px-6 py-3">Browser</th>
          <th className="px-6 py-3">Operating System</th>
          <th className="px-6 py-3">Sign Out Session</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {props.sessions !== null ? (
          props.sessions.map((session, index) => {
            return <SessionItem session={session} key={session.token} />;
          })
        ) : (
          <p>There is no active session right now!</p>
        )}
      </tbody>
    </table>
  );
};

export default SessionTable;
