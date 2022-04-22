import { useRouter } from "next/router";
import React from "react";
import { checkCookies, removeCookies } from "cookies-next";

function SignInRedirect() {
  const router = useRouter();
  router.push("/auth/sign-in");
  return <></>;
}

export async function getServerSideProps({ req, res }) {
  let tokenFromCookie;
  if (checkCookies("token", { req, res })) {
    removeCookies("token", {
      req,
      res,
      sameSite: "none",
      httpOnly: true,
      secure: true,
    });
  }
  return {
    redirect: { destination: "/auth/sign-in", permanent: false },
  };
}

export default SignInRedirect;
