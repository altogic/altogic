import React from "react";
import SignUp from "../../components/auth/Sign-up";
import { checkCookies } from "cookies-next";

function SignUpPage() {
  return <SignUp></SignUp>;
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

export default SignUpPage;
