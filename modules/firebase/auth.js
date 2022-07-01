import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./config";

const getErrorMsg = (code) => {
  const errorMap = {
    "auth/user-not-found": "Invalid email or password",
    "auth/wrong-password": "Invalid email or password",
    "auth/email-already-in-use": "Email already in use",
    "auth/network-request-failed": "Internet Error",
  };

  return errorMap[code];
};

export const signUpReq = async (
  { email, password },
  { successCb = () => {}, errorCb = () => {} }
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
  { successCb = () => {}, errorCb = () => {} }
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

export const signInAnonymouslyReq = async () => {
  try {
    await signInAnonymously(auth);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const signOutReq = async ({
  successCb = () => {},
  errorCb = () => {},
}) => {
  try {
    await signOut(auth);
    successCb();
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};

export const signOutAnonymouslyReq = async (session) => {
  try {
    await deleteUser(session);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const monitorAuthState = onAuthStateChanged;
