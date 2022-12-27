import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useInivitationRealtime from "../../helpers/useInivitationRealtime";
import { invitationActions } from "../../redux/invitation/invitationSlice";
import JoinModal from "../modals/join-team-modal";

export default function WrapApp({ children }) {
  const [invitation, setInvitation] = useInivitationRealtime();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(({ auth }) => auth.user);
  const [isLoading, setIsLoading] = useState(false);

  const joinWorkspace = () => {
    setIsLoading(true);
    dispatch(
      invitationActions.joinWorkspaceRequest({
        workspaceId: invitation?.workspaceId,
        email: user?.email,
        onSuccess: (slug) => {
          navigate("/");
          setInvitation(null);
          setIsLoading(false);
        },
        onFailure: (e) => {
          navigate("/");
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
          workspaceName={invitation?.workspaceName}
          isLoading={isLoading}
          onReject={() => setInvitation(null)}
          onJoin={joinWorkspace}
        />
      )}
    </>
  );
}
