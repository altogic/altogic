import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  todos: {},
  searchText: "",
  info: null, // object

  selectedStatus: "todo",
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    getTodosRequest() {},
    createTodoRequest() {},
    updateTodoRequest() {},
    updateFieldsTodoRequest() {},
    changeStatusTodoRequest() {},
    deleteTodoRequest() {},

    updateTodos(state, action) {
      state.todos[action.payload.key] = action.payload.value;
    },
    removeTodos(state, action) {
      delete state.todos[action.payload.key];
    },
    setTodos(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.todos = {
          ...state.todos,
          ...action.payload.newTodos,
        };
      } else {
        state.todos = action.payload.newTodos;
      }
    },
    setInfo(state, action) {
      state.info = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },

    setSelectedStatus(state, action) {
      state.selectedStatus = action.payload;
    },
  },
});

export const todoActions = todoSlice.actions;

export default todoSlice.reducer;
