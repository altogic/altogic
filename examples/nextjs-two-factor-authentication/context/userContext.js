import React, { useEffect, useState, createContext, useContext } from "react";
import { altogic } from "../helpers/client";

// Create user context.
export const UserContext = createContext({
  user: null,
  session: null,
  allSessionsList: null,
});

export function UserContextProvider(props) {
  const [isAuth, setIsAuth] = useState(false);
  const [session, setSession] = useState();
  const [user, setUser] = useState();
  const [allSessionsList, setAllSessionsList] = useState(null);

  useEffect(() => {
    // Get the session and user from local storage.
    const session = altogic.auth.getSession();
    const user = altogic.auth.getUser();
    setSession(session);
    setUser(user);
    if (user && session) {
      //If there is a user, set the session and user in context.
      getAllSessionsFromAltogic(); //Get all sessions of the user.
    } else {
      altogic.auth.clearLocalData();
    }
  }, [isAuth]);

  function authStateChanged(newSession, newUser) {
    setSession(newSession);
    setUser(newUser);
    altogic.auth.setSession(newSession);
    altogic.auth.setUser(newUser);
  }

  async function getAllSessionsFromAltogic() {
    //This line returns all active sessions of a user.
    const { sessions } = await altogic.auth.getAllSessions();
    if (sessions) {
      setAllSessionsList(sessions);
      return sessions;
    }
  }

  async function profilePicChanged(profilePictureUrl, deleted) {
    let result;
    if (!deleted) {
      //Change the profile picture url.
      result = await altogic.db.model("users").object(user._id).update({
        profilePicture: profilePictureUrl,
      });
    } else {
      //Unset the profile picture url field.
      result = await altogic.db
        .model("users")
        .object(user._id)
        .updateFields([{ field: "profilePicture", updateType: "unset" }]);
    }
    authStateChanged(session, result.data);
  }

  const value = {
    session,
    user,
    allSessionsList,
    authStateChanged,
    getAllSessionsFromAltogic,
    profilePicChanged,
    setAllSessionsList,
    setIsAuth,
  };

  return <UserContext.Provider value={value} {...props} />;
}

// You can use this Hook to get the user context.
export function useUserContext() {
  const context = useContext(UserContext);
  return context;
}
