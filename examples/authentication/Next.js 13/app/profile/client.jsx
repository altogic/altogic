"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import altogic from "../../configs/altogic";
import Avatar from "../components/Avatar";
import Sessions from "../components/Sessions";
import UserInfo from "../components/UserInfo";

function ProfileClient({ user: userProp, sessionList }) {
  const [user, setUser] = useState(userProp);
  const [sessions, setSessions] = useState(sessionList);

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signOut", {
        method: "POST",
      });
      const { errors } = await response.json();

      if (!response.ok) {
        throw errors;
      }
      altogic.auth.clearLocalData();
      router.push("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && sessionList) {
      const currentSession = sessionList.find((s) => s.isCurrent);
      altogic.auth.setUser(user);
      altogic.auth.setSession(currentSession);
    }
  }, []);

  return (
    <section className="h-screen py-4 space-y-4 flex flex-col text-center items-center">
      <Avatar user={user} setUser={setUser} />
      <UserInfo user={user} setUser={setUser} />
      <Sessions sessions={sessions} setSessions={setSessions} />

      <button
        className="bg-gray-400 rounded py-2 px-3 text-white"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </section>
  );
}

export default ProfileClient;
