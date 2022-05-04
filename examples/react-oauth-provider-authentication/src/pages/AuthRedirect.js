import { useContext, useEffect } from "react";
import altogic from "../helpers/altogic";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faSpinner } from "@fortawesome/free-solid-svg-icons";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const context = useContext(AuthenticationContext);
  useEffect(() => {
    // We define another function inside the useEffect hook to handle async functionalities.
    const getUrl = async () => {
      // Altogic client library function getAuthGrant() takes one parameter, which is access_token.It updates the session and user information on localStorage.
      // If you don't pass a parameter to getAuthGrant() function, it automatically fetches the access_token from the URL. If no access token present in URL,
      // it raises an error.
      const resp = await altogic.auth.getAuthGrant();
      if (resp.errors === null) {
        navigate("/profile");
        context.setIsAuth(true);
      }
    };
    getUrl();
  }, []);
  return (
    <>
      <div class="flex h-screen">
        <div class="m-auto">
          <FontAwesomeIcon
            icon={faSpinner}
            size="5x"
            className="text-indigo-600"
            spin
          />
        </div>
      </div>
    </>
  );
};

export default AuthRedirect;
