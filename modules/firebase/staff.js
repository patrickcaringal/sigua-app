import bcrypt from "bcryptjs";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
  zxc,
} from "firebase/firestore";
import { omit as omitFields } from "lodash";

import { formatDate } from "../helper";
import { db, secondaryAuth } from "./config";

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
    // Bulk Create Auth Account
    for (let index = 0; index < staffs.length; index++) {
      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        staffs[index].email,
        "12345678"
      );

      staffs[index] = { ...staffs[index], id: uid };
    }

    // Bulk Create Account Document
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
