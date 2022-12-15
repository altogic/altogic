import { db, endpoint } from "../../configs/altogic";

const listService = {
  getLists({ workspaceSlug, userId, page = 1, limit = 40 }) {
    return endpoint.get("/lists", { workspaceSlug, userId, page, limit });
  },
  getListBySlug(listSlug, userId) {
    return endpoint.get("/lists/slug", { listSlug, userId });
  },
  createList(body) {
    return endpoint.put("/lists", body);
  },
  deleteList(listId) {
    return endpoint.delete("/lists", { listId });
  },
  updateList(body) {
    return endpoint.post("/lists", body);
  },
  updateListFields(listId, fields) {
    return db.model("lists").updateFields(fields);
  },
};

export default listService;
