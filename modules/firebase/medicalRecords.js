import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { associationMessage } from "../../components/common";
import { sortBy } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collectionName = "medicalRecords";
const collRef = collection(db, collectionName);

export const getPatientRecordReq = async ({ id }) => {
  try {
    const q = query(
      collRef,
      where("patientId", "==", id),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("dateCreated", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
