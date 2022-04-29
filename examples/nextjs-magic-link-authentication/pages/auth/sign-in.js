import React from "react";
import SignIn from "../../components/auth/Sign-in";
import { checkCookies } from "cookies-next";

function SignInPage() {
  return <SignIn></SignIn>;
}

export async function getServerSideProps({ req, res }) {
  if (checkCookies("token", { req, res })) {
    return {
      redirect: { destination: "/profile", permanent: false },
    };
  } else {
    return {
      props: {},
    };
  }
}

export default SignInPage;
