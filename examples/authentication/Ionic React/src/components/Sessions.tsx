import type { Session } from "altogic";
import { useEffect, useState } from "react";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

interface MySession extends Session {
  isCurrent: boolean | undefined;
}

const Sessions = () => {
  const context = useAuthContext();
  const [sessions, setSessions] = useState<MySession[]>([]);

  const getAllSessions = async () => {
    const { sessions } = await altogic.auth.getAllSessions();

    if (sessions) {
      const sessionList = sessions.map((session) =>
        session.token === context?.session?.token
          ? { ...session, isCurrent: true }
          : { ...session, isCurrent: false }
      );
      setSessions(sessionList);
    }
  };

  const logoutSession = async (session: MySession) => {
    const { errors } = await altogic.auth.signOut(session.token);
    if (!errors) {
      setSessions(sessions.filter((s) => s.token !== session.token));
    }
  };

  useEffect(() => {
    getAllSessions();
  }, []);

  return (
    <div className="border p-4 space-y-4">
      <p className="text-3xl">All Sessions</p>
      <ul className="flex flex-col gap-2">
        {sessions?.map((session) => (
          <li key={session.token} className="flex justify-between gap-12">
            <div>
              {session.isCurrent && <span> Current Session </span>}
              <span>
                {" "}
                <strong>Device name: </strong>
                {session?.userAgent.device.family}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                {new Date(session.creationDtm).toLocaleDateString("en-US")}
              </span>
              {!session.isCurrent && (
                <button
                  onClick={() => logoutSession(session)}
                  className="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
                >
                  X
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sessions;
