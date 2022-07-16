import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// DEV
// const firebaseConfig = {
//   apiKey: "AIzaSyCOQ8AWVbqdihlz0Uh6vmWUWexV_Js_Z7c",
//   authDomain: "sigua-app.firebaseapp.com",
//   projectId: "sigua-app",
//   storageBucket: "sigua-app.appspot.com",
//   messagingSenderId: "297206039975",
//   appId: "1:297206039975:web:b99d60e5abcb8d89d2a282",
// };

// STAGING
const firebaseConfig = {
  apiKey: "AIzaSyBt7uvSGrLtmKKB7rOl6l6T4l7lJeqAIPA",
  authDomain: "sigua-medical-clinic.firebaseapp.com",
  projectId: "sigua-medical-clinic",
  storageBucket: "sigua-medical-clinic.appspot.com",
  messagingSenderId: "266652357376",
  appId: "1:266652357376:web:7689fe95d98b9dc8f259e5",
};

const app = initializeApp(firebaseConfig);
const secondaryApp = initializeApp(firebaseConfig, "Secondary");

export const db = getFirestore(app);
export const auth = getAuth(app);
export const secondaryAuth = getAuth(secondaryApp);
