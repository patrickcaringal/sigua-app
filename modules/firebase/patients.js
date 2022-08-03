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
} from "firebase/firestore";
import { omit as omitFields } from "lodash";

import {
  formatDate,
  formatFirebasetimeStamp,
  getFullName,
  getUniquePersonId,
  pluralize,
} from "../helper";
import { db, timestampFields } from "./config";

const collRef = collection(db, "patients");

const transformedFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

export const getFamilyMembersReq = async (id) => {
  try {
    const q = query(
      collRef,
      where("accountId", "==", id),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
