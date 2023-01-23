import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// Initial state
const initialState = {
  realtimeKey: uuidv4(),
  pixelSlug: null,
};

export const realtimeSlice = createSlice({
  name: "realtime",
  initialState,
  reducers: {
    joinRequest() {},
    leaveRequest() {},
    drawRequest() {},
    getMembersRequest() {},

    setPixelSlug(state, action) {
      state.pixelSlug = action.payload;
    },
  },
});

export const realtimeActions = realtimeSlice.actions;

export default realtimeSlice.reducer;
