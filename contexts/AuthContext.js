import { createContext, useContext, useEffect, useState } from "react";

import {
  auth,
  monitorAuthState,
  signInReq,
  signOutReq,
  signUpReq,
} from "../modules/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = monitorAuthState(auth, (user) => {
      if (user) {
        const { uid } = user;
        setUser({
          id: uid,
        });
      } else {
        setUser(null);
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

  const signOut = async (cb) => {
    await signOutReq(cb);
  };

  // console.log("context", user);

  const value = { user, signOut, signUp, signIn };
  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
