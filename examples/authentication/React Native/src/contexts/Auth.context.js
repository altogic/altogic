import React, { useContext, useEffect, useState } from 'react';
import storage from '../configs/storage';

const Context = React.createContext(null);

const useFetchAuth = () => {
  const [fetchedAuth, setFetchedAuth] = useState(undefined);
  const [fetchedSession, setFetchedSession] = useState(undefined);

  useEffect(() => {
    // Check if session and user information is exist in storage
    storage
      .get(storage.KEY_AUTH)
      .then((authFromStorage) => {
        setFetchedAuth(authFromStorage || null);
      })
      .catch(() => setFetchedAuth(null));

    storage
      .get(storage.KEY_SESSION)
      .then((sessionFromStorage) => {
        setFetchedSession(sessionFromStorage || null);
      })
      .catch(() => setFetchedSession(null));
  }, []);

  return { fetchedAuth, fetchedSession };
};

const Provider = ({ children }) => {
  const { fetchedAuth, fetchedSession } = useFetchAuth();

  const [auth, setAuth] = useState(fetchedAuth);
  const [session, setSession] = useState(fetchedSession);

  useEffect(() => {
    // Set user information to auth state if it's exist in storage
    setAuth(fetchedAuth);
  }, [fetchedAuth]);
  useEffect(() => {
    // Set user information to storage when auth state's changed
    if (auth) storage.set(storage.KEY_AUTH, auth);
    else if (auth === null) storage.remove(storage.KEY_AUTH);
  }, [auth]);

  useEffect(() => {
    // Set session information to auth state if it's exist in storage
    setSession(fetchedSession);
  }, [fetchedSession]);
  useEffect(() => {
    // Set session information to storage when auth state's changed
    if (session) storage.set(storage.KEY_SESSION, session);
    else if (auth === null) storage.remove(storage.KEY_SESSION);
  }, [session]);

  return (
    <Context.Provider
      value={{
        auth,
        setAuth,
        session,
        setSession
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(Context);
  return context;
};

export default Provider;
