import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/Auth.context";

function PrivateRoute({ children }) {
  const { auth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth === null) {
      // Navigate to sign in, if the user has not session
      navigate("/sign-in");
    }
  }, [auth]);

  return (
    <div>
      {auth === undefined ? (
        <div>Loading...</div>
      ) : auth ? (
        children
      ) : (
        <div>You are redirecting to the login...</div>
      )}
    </div>
  );
}

export default PrivateRoute;
