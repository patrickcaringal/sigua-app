import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
