import { useRef, useState } from "react";
import { useAuth } from "../contexts/Auth";
import { altogic } from "../helpers/altogic";

export function Profile() {
  const oldPassword = useRef();
  const newPassword = useRef();
  const newEmail = useRef();
  const email = useRef();
  const currentPassword = useRef();
  // Get current user and signOut function from context
  const { setUser, setSession, user } = useAuth();
  const [response, setResponse] = useState(null);
  const [responseReset, setResponseReset] = useState(null);
  const [changeEmailResponse, setChangeEmailResponse] = useState(null);

  // create async function to update password
  async function handleChangePassword(e) {
    e.preventDefault();
    // get password input values
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    console.log(oldPassword, newPassword);

    // call altogic client library `changePassword` function
    const response = await altogic.auth.changePassword(
      newPassword,
      oldPassword
    );
    setResponse(response);
    // set user in context
  }
  // create async function to update password
  async function handleResetPassword(e) {
    e.preventDefault();
    // get password input values
    const email = e.target.email.value;

    // call altogic client library `sendResetPwdEmail` function
    const changeEmailResponse = await altogic.auth.sendResetPwdEmail(email);
    setResponseReset(changeEmailResponse);
    // set user in context
    console.log(responseReset);
  }
  // create async function to change email address
  async function handleChangeEmail(e) {
    e.preventDefault();
    // get email and password input values
    const newEmail = e.target.newEmail.value;
    const currentPassword = e.target.currentPassword.value;

    // call altogic client library `changeEmail` function
    const responseReset = await altogic.auth.changeEmail(
      currentPassword,
      newEmail
    );
    setUser(altogic.auth.getUserFromDB());
    setSession(altogic.auth.getSession());
    console.log(response);
    setChangeEmailResponse(responseReset);
    console.log(responseReset);
  }

  return (
    <>
      <div style={{ margin: "20px 20px" }}>
        {/* Displays the user email */}
        <p>Welcome, {user?.email} !</p>

        <span>
          <p>
            Your email verification status:{" "}
            {user?.emailVerified ? "Verified" : "Not Verified"}
          </p>
        </span>

        {/* Create email input field and password input field to update email */}

        <pre>{user && JSON.stringify(user, null, 3)}</pre>
        <div>
          <h1>Change Password</h1>
          <form onSubmit={handleChangePassword}>
            <label>Old Password:</label>
            <input type="password" name="oldPassword" ref={oldPassword} />
            <label>New Password:</label>
            <input type="password" name="newPassword" ref={newPassword} />

            <input type="submit" value="Change Password" />
          </form>
          <pre>{response && JSON.stringify(response, null, 3)}</pre>
        </div>
        <div>
          <h1>Change Email</h1>
          <form onSubmit={handleChangeEmail}>
            <label>Password:</label>
            <input
              type="password"
              name="currentPassword"
              ref={currentPassword}
            />
            <label>New Email:</label>
            <input type="email" name="newEmail" ref={newEmail} />

            <input type="submit" value="Change Email" />
          </form>
          <pre>
            {changeEmailResponse &&
              JSON.stringify(changeEmailResponse, null, 3)}
          </pre>
        </div>
        <div>
          <h1>Reset Password</h1>
          <form onSubmit={handleResetPassword}>
            <label>Email:</label>
            <input type="email" name="email" ref={email} />

            <input type="submit" value="Send Reset Password Email" />
          </form>
          <pre>{responseReset && JSON.stringify(responseReset, null, 3)}</pre>
        </div>
      </div>
    </>
  );
}
