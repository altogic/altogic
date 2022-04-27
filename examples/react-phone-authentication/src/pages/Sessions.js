import { useContext, useEffect, useState } from "react";
import SessionTable from "../components/SessionTable";
import { AuthenticationContext } from "../context/AuthenticationContext";
import PrimaryButton from "../components/Buttons/PrimaryButton";
const Sessions = () => {
  const context = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);

  // Sign out from all session with auth context
  const signOutAll = async (event) => {
    setLoading(true);
    event.preventDefault();
    await context.signOutAllSessions();
    setLoading(false);
  };
  return (
    <div className="grid">
      <div className="m-auto bg-white min-w-fit rounded border border-primaryBorder shadow-lg mt-10">
        <div className="relative border border-gray-200 overflow-x-auto m-auto bg-white min-w-fit rounded">
          {context.sessions !== null ? (
            <SessionTable sessions={context.sessions} />
          ) : (
            <></>
          )}
          <div className="text-center bg-slate-100">
            <PrimaryButton
              loading={loading}
              customClickEvent={signOutAll}
              content="Sign Out From All Sessions"
              fullWidth={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
