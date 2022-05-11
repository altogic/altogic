import React from "react";
import { altogic } from "../../helpers/client";

function SignInRedirect() {
  return <></>;
}

export async function getServerSideProps({ req, res }) {
  const { user } = await altogic.auth.getUserFromDBbyCookie(req, res);
  if (user) {
    return {
      redirect: { destination: "/profile", permanent: false },
    };
  } else {
    return {
      //If there is no user, redirect to sign-in page.
      redirect: { destination: "/auth/sign-in", permanent: false },
    };
  }
}

export default SignInRedirect;
