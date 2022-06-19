import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./config";
// auth/invalid-emai
// auth/email-already-in-use

export const signUpReq = async (
  { email, password },
  { successCb, errorCb }
) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    successCb();
  } catch (error) {
    errorCb(error.message);
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
    errorCb(error.message);
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
