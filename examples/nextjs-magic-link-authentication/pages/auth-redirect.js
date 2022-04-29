import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState, useContext } from "react";
import EmailConfirmResend from "../components/auth-redirect/EmailConfirmResend";
import MagicLinkResend from "../components/auth-redirect/MagicLinkResend";
import PasswordReset from "../components/auth-redirect/PasswordReset";
import { UserContext } from "../context/userContext";
import { altogic } from "../helpers/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { checkCookies } from "cookies-next";

function AuthRedirect(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isResetScreen, setIsResetScreen] = useState(false);
  const [isMagicLinkScreen, setIsMagicLinkScreen] = useState(false);
  const router = useRouter();
  const context = useContext(UserContext);

  async function setNewUser() {
    //Set the user's new data in context and in local storage.
    const activeSession = altogic.auth.getSession();
    if (activeSession) {
      const newUserData = await altogic.auth.getUserFromDB();
      context.authStateChanged(activeSession, newUserData.user);
      router.push("/profile");
    } else {
      router.push("/auth/email-change-confirm");
    }
  }
  async function checkProps() {
    if (props.action == "email-confirm") {
      if (props.error) {
        //There is no valid token.
        setIsLoading(false);
      } else {
        //Send a request to /api/login route to set the cookie for SSR.
        //Only needed if you are going to do SSR.
        await fetch("/api/login", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ token: props.session.token }),
          headers: { "Content-Type": "application/json" },
        });
        context.setIsAuth(true);
        //Email has been verified on the server side.
        context.authStateChanged(props.session, props.user);
        router.push("/profile");
      }
    } else if (props.action === "reset-pwd") {
      //Show the reset password screen.
      setIsResetScreen(true);
      setIsLoading(false);
    } else if (props.action === "change-email") {
      //Change email is successfull.
      setNewUser();
      return;
    } else if (props.action === "magic-link") {
      if (props.error) {
        setIsLoading(false);
        // Resend the magic link screen.
        setIsMagicLinkScreen(true);
      } else {
        //Send a request to /api/login route to set the cookie for SSR.
        //Only needed if you are going to do SSR.
        await fetch("/api/login", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ token: props.session.token }),
          headers: { "Content-Type": "application/json" },
        });
        context.setIsAuth(true);
        context.authStateChanged(props.session, props.user);
        router.push("/profile");
      }
    }
  }

  useEffect(() => {
    checkProps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    //Email change confirm page. It confirms automatically.
    <FontAwesomeIcon
      className="flex items-center justify-center w-full max-w-md mx-auto my-20 overflow-hidden"
      icon={faSpinner}
      size={"3x"}
      spin
    />
  ) : (
    <div className=" min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8">
        {isMagicLinkScreen ? (
          //Magic link didn't work. Resending the magic link screen.
          <MagicLinkResend error={props.error}></MagicLinkResend>
        ) : !isResetScreen ? (
          //Email confirm page. If it can't confirm automatically, it shows a form where you can resend the email.
          <EmailConfirmResend error={props.error}></EmailConfirmResend>
        ) : (
          <PasswordReset
            access_token={props.access_token}
            error={props.error}
          ></PasswordReset>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let req = context.req;
  let res = context.res;

  // context.query returns the query parameters in the url.
  // When Altogic redirects to auth-redirect, it also sends some values as query parameters.
  if (context.query.action === "reset-pwd") {
    if (context.query.status === "200") {
      //Token is valid, you can reset the password.
      return {
        props: {
          action: context.query.action,
          error: null,
          access_token: context.query.access_token,
        },
      };
    } else {
      return {
        props: {
          action: context.query.action,
          error: context.query.error,
        },
      };
    }
  } else if (context.query.action === "change-email") {
    return {
      props: {
        action: context.query.action,
        error: null,
      },
    };
  } else if (context.query.action === "magic-link") {
    if (checkCookies("token", { req, res })) {
      // Check if there is a token between the browser and the server.
      // Redirect to the profile page and check there if token belongs to this user or not.
      return {
        redirect: { destination: "/profile", permanent: false },
      };
    }
    if (context.query.status === "400") {
      //If token is invalid, return the error message in the URL.
      return {
        props: {
          action: context.query.action,
          error: context.query.error,
        },
      };
    }
    try {
      const { user, session, errors } = await altogic.auth.getAuthGrant(
        context.query.access_token
      );
      if (session) {
        return {
          props: {
            action: context.query.action,
            error: null,
            user: user,
            session: session,
          },
        };
      } else {
        return {
          props: {
            action: context.query.action,
            error: errors.items[0].message,
          },
        };
      }
    } catch (error) {
      return {
        props: {
          action: context.query.action,
          error: error.message,
        },
      };
    }
  } else if (context.query.action === "email-confirm") {
    let response;
    if (context.query.status === "200") {
      //We get the session and the user from the token using getAuthGrant()
      response = await altogic.auth.getAuthGrant(context.query.access_token);
      if (response.user) {
        // Successfully verified the email.
        return {
          props: {
            action: context.query.action,
            error: null,
            user: response.user,
            session: response.session,
          },
        };
      } else {
        return {
          props: {
            action: context.query.action,
            error: response.errors.items[0].message,
          },
        };
      }
    } else {
      //Email couldn't be verified.
      return {
        props: { action: context.query.action, error: context.query.error },
      };
    }
  } else {
    return { props: {} };
  }
}

export default AuthRedirect;
