import { createContext, useContext, useEffect, useState } from "react";

import { useLocalStorage } from "../hooks";
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
  const [localStorageUser, setLocalStorageUser] = useLocalStorage("user", null);
  const [user, setUser] = useState(localStorageUser);
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = monitorAuthState(auth, (user) => {
      if (user) {
        setUserSession(user);
        // set user doc if not anonymous account
        // if (user?.email) {
        //   console.log("auto set");
        //   setUser({
        //     id: user.uid,
        //     // usedoc
        //   });
        // }
      } else {
        // setUser(null);
        setUserSession(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const manualSetUser = (doc) => {
    setUser(doc);
    setLocalStorageUser(doc);
  };

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
    isAdmin: user?.role === "superadmin",
    isLoggedIn: user && userSession,
    userSession,
    signOut,
    signUp,
    signIn,
    signInAnonymously,
    signOutAnonymously,
    manualSetUser,
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
