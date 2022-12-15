import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useQuery from "../helpers/useQuery";
import { authActions } from "../redux/auth/authSlice";

export default function AuthRedirect() {
  const accessToken = useQuery("access_token");
  const action = useQuery("action");
  const status = useQuery("status");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const signInWithToken = () => {
    dispatch(
      authActions.signInWithTokenRequest({
        accessToken,
        onSuccess: (signedUser) => {
          navigate("/");
        },
        onFailure: (e) => {
          if (user) {
            navigate("/");
          } else {
            navigate("/sign-in");
          }
        },
      })
    );
  };

  useEffect(() => {
    if (action === "reset-pwd" && status === "200") {
      navigate(`/reset-password/${accessToken}`);
    } else {
      signInWithToken();
    }
  }, []);

  return (
    <div>
      <div>Redirecting...</div>
    </div>
  );
}
