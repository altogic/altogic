import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyHead from "../components/my-head";
import { authActions } from "../redux/auth/authSlice";

export default function AuthRedirect() {
  const router = useRouter();
  const { access_token: accessToken, action, status } = router.query;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const signInWithToken = () => {
    dispatch(
      authActions.signInWithTokenRequest({
        accessToken,
        onSuccess: (signedUser) => {
          router.push("/");
        },
        onFailure: (e) => {
          if (user) {
            router.push("/");
          } else {
            router.push("/sign-in");
          }
        },
      })
    );
  };

  useEffect(() => {
    if (action === "reset-pwd" && status === "200") {
      router.push(`/reset-password/${accessToken}`);
    } else {
      signInWithToken();
    }
  }, []);

  return (
    <div>
      <MyHead />
      <div>Redirecting...</div>
    </div>
  );
}
