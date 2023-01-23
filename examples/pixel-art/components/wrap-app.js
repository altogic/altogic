import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInivitationRealtime from "../functions/hooks/useInivitationRealtime";
import JoinModal from "./modals/join-team-modal";
import { pixelActions } from "../redux/pixel/pixelSlice";
import { MyRouter } from "../routes";
import { useRouter } from "next/router";

export default function WrapApp({ children }) {
  const [invitation, setInvitation] = useInivitationRealtime();

  const router = useRouter();
  const { pixelSlug } = router.query;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const joinPixel = () => {
    setIsLoading(true);
    dispatch(
      pixelActions.joinPixelRequest({
        pixelId: invitation?.pixelId,
        email: user?.email,
        onSuccess: (slug) => {
          if (pixelSlug === slug) {
            window.location.reload();
          } else {
            router.push(MyRouter.pixel(slug));
          }
          setInvitation(null);
          setIsLoading(false);
        },
        onFailure: (e) => {
          router.push(MyRouter.pixel("/"));
          setInvitation(null);
          setIsLoading(false);
        },
      })
    );
  };

  return (
    <>
      {children}

      {invitation && (
        <JoinModal
          pixelName={invitation?.pixelName}
          isLoading={isLoading}
          onReject={() => setInvitation(null)}
          onJoin={joinPixel}
        />
      )}
    </>
  );
}
