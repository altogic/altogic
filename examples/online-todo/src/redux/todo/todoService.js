import { db, endpoint } from "../../configs/altogic";

const todoService = {
  async getTodoList({
    listSlug,
    status,
    searchText = null,
    page = 1,
    limit = 50,
  }) {
    return endpoint.get("/todo", {
      listSlug,
      status,
      searchText,
      page,
      limit,
    });
  },
  createTodo(body) {
    return endpoint.post("/todo", body);
  },
  updateFieldsTodo(todoId, field) {
    return db.model("todos").object(todoId).updateFields(field);
  },
  changeStatusTodo(todoId, newStatus) {
    return endpoint.put("/todo/changeStatus", { todoId, newStatus });
  },
  updateTodo(body) {
    return endpoint.put("/todo", body);
  },
  deleteTodo(todoId) {
    return endpoint.delete("/todo", { todoId });
  },
};

export default todoService;
