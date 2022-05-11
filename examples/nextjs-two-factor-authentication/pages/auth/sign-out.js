import { useRouter } from "next/router";
import React from "react";
import { altogic } from "../../helpers/client";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function LogOut() {
  const context = useContext(UserContext);

  const router = useRouter();
  async function handleSignOut() {
    if (context != null && context.session != null) {
      fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(context.session.token),
        headers: { "Content-Type": "application/json" },
      });
    }
    await altogic.auth.signOut();
    context.setIsAuth(false);
    context.setAllSessionsList(null);
    context.authStateChanged(null, null);
    router.push("/");
  }
  useEffect(() => {
    if (context.user != null) handleSignOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-row items-center justify-center mt-72">
      <FontAwesomeIcon
        className="ml-2"
        icon={faSpinner}
        style={{ fontSize: 70 }}
        spin
      />
    </div>
  );
}

export default LogOut;
