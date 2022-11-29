import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useQuery from "../helpers/useQuery";
import { authActions } from "../redux/auth/authSlice";

export default function AuthRedirect() {
  const accessToken = useQuery("access_token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleToken = () => {
    dispatch(
      authActions.signInWithTokenRequest({
        accessToken,
        onSuccess: (signedUser) => {
          const hasLeague =
            signedUser?.leagues && !_.isEmpty(signedUser?.leagues);
          navigate(
            hasLeague ? `/league/${_.first(signedUser?.league).slug}` : "/"
          );
        },
        onFailure: () => {
          if (user) {
            const hasLeague = user?.leagues && !_.isEmpty(user?.leagues);
            navigate(
              hasLeague ? `/league/${_.first(user?.leagues).slug}` : "/"
            );
          } else {
            navigate("/sign-in");
          }
        },
      })
    );
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
