import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function AuthRedirectView() {
  const { setAuth, setSession } = useAuthContext();
  const { search } = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(search);
  const access_token = query.get("access_token");

  const handleToken = async () => {
    const { user, session } = await altogic.auth.getAuthGrant(access_token);

    if (user) {
      setAuth(user);
      setSession(session);
      navigate("/profile");
    } else {
      navigate("/sign-in");
    }
  };

  useEffect(() => {
    handleToken();
  }, []);

  return (
    <div>
      <div>Redirecting...</div>
    </div>
  );
}

export default AuthRedirectView;
