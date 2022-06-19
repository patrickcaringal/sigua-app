import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOQ8AWVbqdihlz0Uh6vmWUWexV_Js_Z7c",
  authDomain: "sigua-app.firebaseapp.com",
  projectId: "sigua-app",
  storageBucket: "sigua-app.appspot.com",
  messagingSenderId: "297206039975",
  appId: "1:297206039975:web:b99d60e5abcb8d89d2a282",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export const auth = getAuth(app);
// const colRef = collection(db, "showList");

const logIn = async () => {
  try {
    const user = await signInWithEmailAndPassword(
      auth,
      "2@gmail.com",
      "123456"
    );
  } catch (error) {
    console.log(error);
  }
};

const logout = async () => {
  try {
    const user = await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};

const monitorAutState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("not logged in");
      return;
    }

    console.log(" logged in", user);
  });
};

// monitorAutState();
// register();
// logIn();
// setTimeout(() => {
//   logout();
// }, 3000);
