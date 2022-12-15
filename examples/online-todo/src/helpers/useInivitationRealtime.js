import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import realtimeService from "../redux/realtime/realtimeService";

export const InvitationEventType = {
  INVITE_MEMBER: "INVITE_MEMBER",
};

export default function useInivitationRealtime() {
  const user = useSelector(({ auth }) => auth.user);
  const [invitePopup, setInvitePopup] = useState(false);

  const inviteMember = ({ message }) => {
    const { workspaceId, workspaceName } = message;

    setInvitePopup({
      workspaceId,
      workspaceName,
    });
  };

  const listen = () => {
    realtimeService.listen(InvitationEventType.INVITE_MEMBER, inviteMember);
  };

  const removeListen = () => {
    realtimeService.removeListen(
      InvitationEventType.INVITE_MEMBER,
      inviteMember
    );
  };

  useEffect(() => {
    if (user?.email) {
      realtimeService.join(user?.email);

      listen();

      return () => {
        removeListen();
        realtimeService.leave(user?.email);
      };
    }
  }, [user?.email]);

  return [invitePopup, setInvitePopup];
}
