import React from "react";
import SignIn from "../../components/auth/Sign-in";
import { altogic } from "../../helpers/client";

function SignInPage() {
  return <SignIn></SignIn>;
}

export async function getServerSideProps({ req, res }) {
  const { user } = await altogic.auth.getUserFromDBbyCookie(req, res);
  if (user) {
    return {
      //If there is a user, redirect to sign-in page.
      redirect: { destination: "/profile", permanent: false },
    };
  } else {
    return {
      props: {},
    };
  }
}

export default SignInPage;
