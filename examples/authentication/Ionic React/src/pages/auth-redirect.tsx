import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

const AuthRedirectView: React.FC<RouteComponentProps> = ({
  location,
  history,
}) => {
  const query = new URLSearchParams(location.search);
  const access_token = query.get("access_token");
  const context = useAuthContext();

  const handleToken = async () => {
    if (access_token) {
      const { user, session } = await altogic.auth.getAuthGrant(access_token);
      if (user) {
        context?.setAuth(user);
        context?.setSession(session);
        history.push("/profile");
      } else {
        history.push("/sign-in");
      }
    }
  };

  useEffect(() => {
    handleToken();
  }, [access_token]);

  return (
    <div>
      <div>Redirecting...</div>
    </div>
  );
};

export default AuthRedirectView;
