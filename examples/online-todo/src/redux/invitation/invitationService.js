import { endpoint } from "../../configs/altogic";

const invitationService = {
  sendInvitation(workspaceId, email) {
    return endpoint.put("/invitation", { workspaceId, email });
  },
  joinWorkspace(workspaceId, email) {
    return endpoint.put("/invitation/join", { workspaceId, email });
  },
};

export default invitationService;
