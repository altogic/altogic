import { auth, db, endpoint } from "../../configs/altogic";

const authService = {
  register(user) {
    return auth.signUpWithEmail(user.email, user.password, user);
  },
  checkUserName(userName, userId) {
    return endpoint.post("/user/userName", { userName, userId });
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
};

export default authService;
