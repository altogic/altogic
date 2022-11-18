import { useEffect } from "react";
import { useHistory } from "react-router";
import { useAuthContext } from "../contexts/Auth.context";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useAuthContext();
  const history = useHistory();

  useEffect(() => {
    if (context?.auth === null) {
      //   Navigate to sign in, if the user has not session
      history.push("/sign-in");
    }
  }, [context?.auth]);

  return (
    <div>
      {context?.auth === undefined ? (
        <div>Loading...</div>
      ) : context?.auth ? (
        children
      ) : (
        <div>You are redirecting to the login...</div>
      )}
    </div>
  );
};

export default PrivateRoute;
