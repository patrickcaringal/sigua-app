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

import { duplicateMessage } from "../../components/common";
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

export const updatePatientReq = async ({ patient }) => {
  try {
    // Check fullname, birthdate duplicate
    const q = query(
      collRef,
      where("nameBirthdate", "==", getUniquePersonId(patient))
    );
    const querySnapshot = await getDocs(q);

    const isDuplicate =
      querySnapshot.docs.filter((doc) => doc.id !== staff.id).length !== 0;
    if (isDuplicate) {
      throw new Error(
        duplicateMessage({ noun: "Patient", item: getFullName(staff) })
      );
    }

    // Update
    const docRef = doc(db, "patients", patient.id);
    const finalDoc = {
      ...patient,
      ...transformedFields(patient),
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
