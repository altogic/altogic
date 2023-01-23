import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MyHead from "../components/my-head";
import { pixelActions } from "../redux/pixel/pixelSlice";
import { MyRouter } from "../routes";

export default function JoinRedirect() {
  const router = useRouter();
  const { pixelId, email, isExist } = router.query;

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const joinPixel = () => {
    dispatch(
      pixelActions.joinPixelRequest({
        pixelId,
        email,
        onSuccess: (slug) => {
          toast.success("Joined succesfully");
          router.push(MyRouter.pixel(slug));
        },
        onFailure: (e) => {
          toast.error("Something Wrong!");
          router.push("/");
        },
      })
    );
  };

  useEffect(() => {
    if (!_.isEmpty(router.query)) {
      if (user) {
        joinPixel();
      } else {
        if (isExist === "true") router.push(MyRouter.signIn(email, pixelId));
        else router.push(MyRouter.createAnAccount(email, pixelId));
      }
    }
  }, [router.query]);

  return (
    <div>
      <MyHead />
      <div>Redirecting...</div>
    </div>
  );
}
