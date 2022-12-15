import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  workspaces: {},
  searchText: "",
  info: null, // object

  members: {},
  memberSearchText: "",
  memberInfo: null, // object

  workspaceList: {},
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    getWorkspaceListRequest() {},
    createWorkspaceRequest() {},
    searchWorkspaceListRequest() {},
    getWorkspaceBySlugRequest() {},
    updateWorkspaceRequest() {},
    deleteWorkspaceRequest() {},
    getWorkspaceMembersRequest() {},
    deleteMemberRequest() {},
    getWorkspaceListBySlugRequest() {},
    getIsMemberWorkspaceRequest() {},

    updateWorkspaces(state, action) {
      state.workspaces[action.payload.key] = action.payload.value;
    },
    removeWorkspaces(state, action) {
      delete state.workspaces[action.payload.key];
    },
    setWorkspaces(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.workspaces = {
          ...state.workspaces,
          ...action.payload.newWorkspaces,
        };
      } else {
        state.workspaces = action.payload.newWorkspaces;
      }
    },
    setInfo(state, action) {
      state.info = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },

    updateMembers(state, action) {
      state.members[action.payload.key] = action.payload.value;
    },
    removeMembers(state, action) {
      delete state.members[action.payload.key];
    },
    setMembers(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.members = {
          ...state.members,
          ...action.payload.newMembers,
        };
      } else {
        state.members = action.payload.newMembers;
      }
    },
    setMemberInfo(state, action) {
      state.memberInfo = action.payload;
    },
    setMemberSearchText(state, action) {
      state.memberSearchText = action.payload;
    },

    setWorkspaceList(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.workspaceList = {
          ...state.workspaceList,
          ...action.payload.newWorkspaceList,
        };
      } else {
        state.workspaceList = action.payload.newWorkspaceList;
      }
    },
    updateWorkspaceList(state, action) {
      state.workspaceList[action.payload.key] = action.payload.value;
    },
    removeWorkspaceList(state, action) {
      delete state.workspaceList[action.payload.key];
    },
  },
});

export const workspaceActions = workspaceSlice.actions;

export default workspaceSlice.reducer;
