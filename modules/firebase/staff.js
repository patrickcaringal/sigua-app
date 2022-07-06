import bcrypt from "bcryptjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { omit as omitFields } from "lodash";

import { formatDate } from "../helper";
import { db } from "./config";

const collRef = collection(db, "staffs");

export const getStaffsReq = async ({ branch }) => {
  try {
    const q = query(collRef, where("branch", "==", branch));

    const querySnapshot = await getDocs(q);

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

export const addStaffReq = async ({ staffs }) => {
  try {
    const batch = writeBatch(db);

    staffs.forEach((staffdoc) => {
      const { birthdate } = staffdoc;
      const docRef = doc(collRef);

      const mappedDoc = {
        ...staffdoc,
        birthdate: formatDate(birthdate),
        role: "staff",
      };

      batch.set(doc(db, "staffs", docRef.id), mappedDoc);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.log("batch", error);
    return { error: error.message };
  }
};
