import { useRef } from 'react';
import { useAuth } from '../contexts/Auth';
import { altogic } from '../helpers/altogic';

export function ResetPassword() {
  // Get current user and signOut function from context
  const { user, accessToken } = useAuth();
  const passwordRef = useRef();

  async function handleChangePassword() {
    // Ends user session
    let abc = await altogic.auth.resetPwdWithToken(
      accessToken,
      passwordRef.current.value
    );
    console.log(abc);

    // Redirects the user to Login page
  }

  return (
    <>
      <div style={{ margin: '20px 20px' }}>
        {/* Displays the user ID */}
        <p>Welcome, {user?.email} !</p>

        <h2> Reset Password</h2>
        {/* Input to collect new password */}
        <div>
          <label>New Password:</label>
          <input type="password" name="password" ref={passwordRef} />

          <input
            type="button"
            value="Reset password"
            onClick={handleChangePassword}
          />
        </div>

        <pre>{user && JSON.stringify(user, null, 3)}</pre>
      </div>
    </>
  );
}
