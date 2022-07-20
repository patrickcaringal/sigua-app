import { collection, doc, getDocs, writeBatch } from "firebase/firestore";

import { getErrorMsg } from "./auth";
import { db } from "./config";

const collRef = collection(db, "services");

export const getServicesReq = async () => {
  try {
    const querySnapshot = await getDocs(collRef);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addServiceReq = async ({ services }) => {
  try {
    // Bulk Create Service Document
    const batch = writeBatch(db);

    services.forEach((serviceDoc) => {
      const docRef = doc(collRef);
      const mappedDoc = { ...serviceDoc };

      batch.set(doc(db, "services", docRef.id), mappedDoc);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
