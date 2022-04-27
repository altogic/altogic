import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import altogic from "../helpers/altogic";
import { ModalContext } from "./ModalContext";
import { CounterContext } from "./CounterContext";

export const AuthenticationContext = createContext();

const AuthenticationProvider = ({ children }) => {
  // Define states
  const [sessions, setSessions] = useState(null);
  const [canVerify, setCanVerify] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const context = useContext(ModalContext);

  // We use useNavigate() method to switch routes
  let navigate = useNavigate();

  // Verification code will expire in 150 seconds after successful signup process. We will use countdown timer to handle it.
  // In the AuthenticationContext we will manipulate the countdown timer
  let counterContext = useContext(CounterContext);

  useEffect(() => {
    const sendReq = async () => {
      const resp = await getAllSessions();
      setSessions(resp.sessions);
    };

    // Fetches the session data to determine if the user is authenticated and updates the context
    if (altogic.auth.getSession()) {
      setIsAuth(true);
      sendReq();
    }
  }, [isAuth]);

  // Returns the response of the Altogic Client Library signUpWithPhone() function. SignUp component will handle the response itself
  const signUp = async (phoneNumber, password, name) => {
    try {
      return await altogic.auth.signUpWithPhone(phoneNumber, password, name);
    } catch (error) {
      console.error(error);
    }
  };

  // Returns the response of the Altogic Client Library signInWithPhone() function. SignIn component will handle the response itself
  const signIn = async (phoneNumber, password) => {
    sessionStorage.setItem("phoneNumber", phoneNumber);
    try {
      return await altogic.auth.signInWithPhone(phoneNumber, password);
    } catch (error) {
      console.error(error);
    }
  };

  // Signs out from the current session with Altogic Client Library signOut() function and updates isAuth state. We call this function in ProfileDropdown component
  const signOutCurrentSession = async () => {
    try {
      const resp = await altogic.auth.signOut();

      if (resp.errors === null) {
        setIsAuth(false);
        navigate("/signin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // This function will call same Altogic Client Library function with above signOutFromTheCurrentSession().
  // But the difference is, we call this function in Sessions component, not in ProfileDropdown
  const signOutSelectedSession = async (token) => {
    const flag = token === altogic.auth.getSession().token;

    try {
      const resp = await altogic.auth.signOut(token);
      if (resp.errors === null) {
        const temp = await getAllSessions();
        setSessions(temp.sessions);
        if (flag) {
          setIsAuth(false);
          navigate("/signin");
        } else {
          await context.openModal(
            "Signed out successfully from the selected session!",
            "success"
          );
        }
      } else {
        await context.openModal(resp.errors.items[0].message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Sign out from all sessions with AltogicClientLibrary signOutAll() function
  const signOutAllSessions = async () => {
    try {
      const resp = await altogic.auth.signOutAll();
      if (resp.errors === null) {
        setIsAuth(false);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call Altogic Client Library function resendVerificationCode() when phone number has not been verified yet
  const resendVerificationCode = async () => {
    try {
      const resp = await altogic.auth.resendVerificationCode(
        sessionStorage.getItem("phoneNumber")
      );
      if (resp.errors === null) {
        counterContext.initiateCounter();
        navigate("/verification");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call Altogic Client Library function changePassword() to update password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      return await altogic.auth.changePassword(newPassword, oldPassword);
    } catch (error) {
      console.error(error);
    }
  };

  // Get list of all active sessions with Altogic Client Library function getAllSessions()
  const getAllSessions = async () => {
    try {
      return await altogic.auth.getAllSessions();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Send reset code to users phone number with Altogic Client Library function sendResetPwdCode() when users forget their password
  const sendResetCode = async (phoneNumber) => {
    sessionStorage.setItem("phoneNumber", phoneNumber);
    try {
      const resp = await altogic.auth.sendResetPwdCode(phoneNumber);
      if (resp.errors === null) {
        navigate("/resetPassword/code");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Reseting password with codc comes to users phone number  with Altogic Client Library function resetPwdWithCode()
  const resetPassword = async (phoneNumber, password, code) => {
    try {
      const resp = await altogic.auth.resetPwdWithCode(
        phoneNumber,
        code,
        password
      );
      if (resp.errors === null) {
        navigate("/signin");
        await context.openModal(
          "Your password has been updated successfully!",
          "success"
        );
      } else {
        await context.openModal(resp.errors.items[0].message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Call Altogic Client Library function changePhone() to update phoneNumber
  const updatePhoneNumber = async (password, phoneNumber) => {
    try {
      return await altogic.auth.changePhone(password, phoneNumber);
    } catch (error) {
      console.error(error);
    }
  };

  // Verify phone number with Altogic Client Library function verifyPhone()
  const verifyPhoneNumber = async (phoneNumber, code) => {
    try {
      const resp = await altogic.auth.verifyPhone(phoneNumber, code);

      if (resp.errors == null) {
        if (isAuth) {
          const resp = await altogic.auth.getUserFromDB();
          altogic.auth.setUser(resp.user);
        }
        counterContext.terminateCounter();
        sessionStorage.removeItem("canVerify");
        setIsAuth(true);
        navigate("/profile");
      } else {
        await context.openModal(resp.errors.items[0].message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuth,
        setIsAuth,
        signIn,
        signUp,
        signOutCurrentSession,
        signOutSelectedSession,
        resendVerificationCode,
        changePassword,
        getAllSessions,
        signOutAllSessions,
        sendResetCode,
        resetPassword,
        updatePhoneNumber,
        canVerify,
        setCanVerify,
        sessions,
        verifyPhoneNumber,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
