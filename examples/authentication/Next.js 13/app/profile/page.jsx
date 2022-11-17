import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { altogicWithToken } from "../../configs/altogic";
import ProfileClient from "./client";

async function ProfileView() {
  const { user, sessionList, token } = await getUser();

  return <ProfileClient user={user} sessionList={sessionList} token={token} />;
}

async function getUser() {
  const nextCookies = cookies();
  const session_token = nextCookies.get("session_token")?.value;

  const { user, errors } = await altogicWithToken(
    session_token
  ).auth.getUserFromDB();

  if (errors) redirect("/sign-in");

  const { sessions } = await altogicWithToken(
    session_token
  ).auth.getAllSessions();
  const sessionList = sessions.map((session) =>
    session.token === session_token ? { ...session, isCurrent: true } : session
  );
  return {
    user,
    sessionList,
    token: session_token,
  };
}

export default ProfileView;
