import _ from "lodash";
import { auth, db, endpoint } from "../../configs/altogic";

const authService = {
  register(user, emailQuery) {
    return auth.signUpWithEmail(user.email, user.password, {
      ...user,
      emailVerified: !_.isNil(emailQuery),
    });
  },
  signIn(email, password) {
    return auth.signInWithEmail(email, password);
  },
  forgotPassword(email) {
    return auth.sendResetPwdEmail(email);
  },
  signInWithToken(accessToken) {
    return auth.getAuthGrant(accessToken);
  },
  signOut() {
    return auth.signOut();
  },
  getUserFromDB() {
    return auth.getUserFromDB();
  },
  setUser(user) {
    auth.setUser(user);
  },
  updateUserFields(userId, fields) {
    return db.model("users").object(userId).update(fields);
  },
  changeEmail(newEmail, password) {
    return auth.changeEmail(password, newEmail);
  },
  resendVerificationEmail(email) {
    return auth.resendVerificationEmail(email);
  },
  changePassword(currentPassword, newPassword) {
    return auth.changePassword(newPassword, currentPassword);
  },
  setUserFields(userId, fields) {
    return db.model("users").object(userId).updateFields(fields);
  },
  resetPassword(accessToken, newPassword) {
    return auth.resetPwdWithToken(accessToken, newPassword);
  },
  updateName(name) {
    return endpoint.post("/user/name", { name });
  },
  updateProfilePicture(photoPublicPath) {
    return endpoint.post("/user/profilePicture", { photoPublicPath });
  },
  isEmailExist(email) {
    return db.model("users").filter(`email == ${email}`).getSingle();
  },
  searchEmailOrName(searchText) {
    return endpoint.get("/user/search", { searchText });
  },
  search(userId, workspaceId, searchText) {
    return db
      .model("users")
      .lookup({
        modelName: "invitations",
        name: "isSent",
        query: `lookup.workspace == '${workspaceId}' && lookup.email == this.email`,
      })
      .lookup({
        modelName: "user_workspace_connections",
        name: "isMember",
        query: `lookup.workspace == '${workspaceId}' && lookup.user == this._id`,
      })
      .filter(
        `(INCLUDES(name, '${searchText}') || INCLUDES(email, '${searchText}')) && _id != '${userId}' && !EXISTS(isMember) && !EXISTS(isSent)`
      )
      .get();
  },
};

export default authService;
