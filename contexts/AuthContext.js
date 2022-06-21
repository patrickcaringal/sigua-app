import { createContext, useContext, useEffect, useState } from "react";

import {
  auth,
  monitorAuthState,
  signInAnonymouslyReq,
  signInReq,
  signOutAnonymouslyReq,
  signOutReq,
  signUpReq,
} from "../modules/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = monitorAuthState(auth, (user) => {
      if (user) {
        setUser({
          id: user.uid,
          // usedoc
        });
        setUserSession(user);
      } else {
        setUser(null);
        setUserSession(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (user, cb) => {
    const res = await signUpReq(user, cb);
    return res;
  };

  const signIn = async (user, cb) => {
    await signInReq(user, cb);
  };

  const signInAnonymously = async (cb) => {
    await signInAnonymouslyReq(cb);
  };

  const signOut = async (cb) => {
    await signOutReq(cb);
  };

  const signOutAnonymously = async (session, cb) => {
    await signOutAnonymouslyReq(session, cb);
  };

  const value = {
    user,
    userSession,
    signOut,
    signUp,
    signIn,
    signInAnonymously,
    signOutAnonymously,
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
