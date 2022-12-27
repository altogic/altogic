import { endpoint } from "../../configs/altogic";

const invitationService = {
  sendInvitation(workspaceId, email) {
    return endpoint.post("/invitation", { workspaceId, email });
  },
  joinWorkspace(workspaceId, email) {
    return endpoint.post("/invitation/join", { workspaceId, email });
  },
};

export default invitationService;
