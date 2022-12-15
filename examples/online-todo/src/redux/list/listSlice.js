import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  lists: {},
  searchText: "",
  info: null, // object
};

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    getListsRequest() {},
    getListBySlugRequest() {},
    createListRequest() {},
    deleteListRequest() {},
    updateListRequest() {},

    updateLists(state, action) {
      state.lists[action.payload.key] = action.payload.value;
    },
    removeLists(state, action) {
      delete state.lists[action.payload.key];
    },
    setLists(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.lists = {
          ...state.lists,
          ...action.payload.newLists,
        };
      } else {
        state.lists = action.payload.newLists;
      }
    },
    setInfo(state, action) {
      state.info = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
    setTodoSize(state, action) {
      const list = state.lists[action.payload.key];
      if (list && action.payload.type === "increase") {
        list.todoSize++;
      } else {
        list.todoSize--;
      }
    },
    setCompletedSize(state, action) {
      const list = state.lists[action.payload.key];
      if (list && action.payload.type === "increase") {
        list.completedSize++;
      } else if (list) {
        list.completedSize--;
      }
    },
  },
});

export const listActions = listSlice.actions;

export default listSlice.reducer;
