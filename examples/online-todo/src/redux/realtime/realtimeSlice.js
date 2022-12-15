import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// Initial state
const initialState = {
  realtimeKey: uuidv4(),
  workspaceSlug: null,
  listSlug: null,
  statusSlug: null,
};

export const realtimeSlice = createSlice({
  name: "realtime",
  initialState,
  reducers: {
    workspaceNameChangeRequest() {},
    joinedWorkspaceRequest() {},
    leftWorkspaceRequest() {},
    newListRequest() {},
    updateListRequest() {},
    deleteListRequest() {},
    newTodoRequest() {},
    updateTodoRequest() {},
    changeStatusTodoRequest() {},
    deleteTodoRequest() {},
    deletedWorkspaceRequest() {},

    setWorkspaceSlug(state, action) {
      state.workspaceSlug = action.payload;
    },
    setListSlug(state, action) {
      state.listSlug = action.payload;
    },
    setStatusSlug(state, action) {
      state.statusSlug = action.payload;
    },
  },
});

export const realtimeActions = realtimeSlice.actions;

export default realtimeSlice.reducer;
