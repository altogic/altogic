import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  joinModal: false,
};

export const invitationSlice = createSlice({
  name: "invitation",
  initialState,
  reducers: {
    sendInvitationRequest() {},
    joinWorkspaceRequest() {},
  },
});

export const invitationActions = invitationSlice.actions;

export default invitationSlice.reducer;
