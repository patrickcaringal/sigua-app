import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
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
import medicalRecsJSON from "../../public/medicalRecs.json";
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

export const getRecordsByBranchDateRangeReq = async ({ id, start, end }) => {
  try {
    const q = query(
      collRef,
      where("branchId", "==", id),
      where("dateCreated", ">=", start),
      where("dateCreated", "<=", end)
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

export const getRecordsByDateRangeReq = async ({ start, end }) => {
  try {
    const q = query(
      collRef,
      where("dateCreated", ">=", start),
      where("dateCreated", "<=", end)
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

export const getAllRecordsReq = async () => {
  try {
    // const q = query(collRef, where("deleted", "==", false));
    const q = query(collRef, where("deleted", "==", false));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    // .sort(sortBy("dateCreated", "desc"));
    // console.log(medicalRecsJSON.concat(data));
    // const d = medicalRecsJSON.concat(data);
    const d = data;
    return { data: d, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
