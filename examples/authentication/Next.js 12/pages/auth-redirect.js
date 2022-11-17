import Link from "next/link";
import { useRouter } from "next/router";
import altogic from "../configs/altogic";

function AuthRedirectView() {
  return (
    <div>
      <div>Redirecting...</div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { access_token } = context.query;
  const { user, session } = await altogic.auth.getAuthGrant(access_token);

  if (user) {
    altogic.auth.setSessionCookie(session.token, context.req, context.res);
    altogic.auth.setSession(session);

    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/sign-in",
      permanent: false,
    },
  };
}

export default AuthRedirectView;
