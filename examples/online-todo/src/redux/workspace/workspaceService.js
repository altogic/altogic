import { db, endpoint } from "../../configs/altogic";

const workspaceService = {
  getWorkspaceList({ userId, searchText, page = 1, limit = 12 }) {
    let query = `user == '${userId}'`;
    if (searchText)
      query += ` && INCLUDES(TOLOWER(workspaceName), TOLOWER('${searchText}'))`;
    return db
      .model("user_workspace_connections")
      .filter(query)
      .lookup({ field: "workspace" })
      .page(page)
      .limit(limit)
      .get(true);
  },
  getWorkspaceBySlug(userId, slug) {
    return db
      .model("user_workspace_connections")
      .filter(`user == '${userId}' && workspaceSlug == "${slug}"`)
      .lookup({ field: "workspace" })
      .getSingle();
  },
  createWorkspace(body) {
    return endpoint.put("/workspace", body);
  },
  updateWorkspace(body) {
    return endpoint.post("/workspace", body);
  },
  deleteWorkspace(workspaceId) {
    return endpoint.delete("/workspace", { workspaceId });
  },
  getWorkspaceMembers({ workspaceSlug, searchText, page = 1, limit = 12 }) {
    let query = `workspaceSlug == "${workspaceSlug}"`;
    if (searchText)
      query += ` && INCLUDES(TOLOWER(user.name), TOLOWER('${searchText}'))`;
    return db
      .model("user_workspace_connections")
      .filter(query)
      .lookup({ field: "user" })
      .page(page)
      .limit(limit)
      .get(true);
  },
  deleteMember(workspaceId, memberId) {
    return endpoint.delete("/workspace/member", { workspaceId, memberId });
  },
  getWorkspaceListBySlug(workspaceSlug, userId) {
    return endpoint.get("/workspace/bySlug", { workspaceSlug, userId });
  },
  isMemberWorkspace(workspaceSlug) {
    return endpoint.get("/workspace/isMember", { workspaceSlug });
  },
};

export default workspaceService;
