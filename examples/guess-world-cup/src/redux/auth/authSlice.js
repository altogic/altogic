import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../../configs/altogic";
// Initial state
const initialState = {
  user: auth.getUser(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerRequest() {},
    checkUserNameRequest() {},
    signInRequest() {},
    forgotPasswordRequest() {},
    signInWithTokenRequest() {},
    signOutRequest() {},
    updateUserFieldsRequest() {},
    uploadProfilePictureRequest() {},
    deleteProfilePictureRequest() {},
    changeEmailRequest() {},
    resendVerificationEmailRequest() {},
    changePasswordRequest() {},

    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
