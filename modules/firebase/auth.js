import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./config";

const getErrorMsg = (code) => {
  const errorMap = {
    "auth/user-not-found": "Invalid email or password",
    "auth/wrong-password": "Invalid email or password",
    "auth/email-already-in-use": "Email already in use",
  };

  return errorMap[code];
};

export const signUpReq = async (
  { email, password },
  { successCb, errorCb }
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    successCb();
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    errorCb(errMsg);
    console.log(error);
  }
};

export const signInReq = async (
  { email, password },
  { successCb, errorCb }
) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    successCb();
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    errorCb(errMsg);
    console.log(error);
  }
};

export const signOutReq = async ({ successCb }) => {
  try {
    await signOut(auth);
    successCb();
  } catch (error) {
    console.log(error);
  }
};

export const monitorAuthState = onAuthStateChanged;
