import React from "react";
import SignUp from "../../components/auth/Sign-up";
import { altogic } from "../../helpers/client";

function SignUpPage() {
  return <SignUp></SignUp>;
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

export default SignUpPage;
