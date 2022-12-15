import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { myRouter } from "../helpers/routes";
import useQuery from "../helpers/useQuery";
import { invitationActions } from "../redux/invitation/invitationSlice";

export default function JoinRedirect() {
  const { email, workspaceId } = useParams();
  const isExist = useQuery("isExist");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const joinWorkspace = () => {
    dispatch(
      invitationActions.joinWorkspaceRequest({
        workspaceId,
        email,
        onSuccess: (slug) => {
          toast.success("Joined succesfully");
          navigate("/");
        },
        onFailure: (e) => {
          toast.error("Something Wrong!");
          navigate("/");
        },
      })
    );
  };

  useEffect(() => {
    if (user) {
      joinWorkspace();
    } else {
      if (isExist === "true") navigate(myRouter.SIGN_IN(email, workspaceId));
      else navigate(myRouter.CREATE_AN_ACCOUNT(email, workspaceId));
    }
  }, []);

  return (
    <div>
      <div>Redirecting...</div>
    </div>
  );
}
