import {
  collection,
  doc,
  getDocs,
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

const collRef = collection(db, "queues");

export const getQueuesReq = async () => {
  try {
    // TODO: date range , where("deleted", "!=", true)
    const q = query(collRef);
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("date", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addQueueReq = async ({ docs }) => {
  try {
    const docRef = doc(collRef);
    const id = docRef.id;
    const data = {
      id,
      ...docs,
      deleted: false,
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };
    await setDoc(docRef, data);

    return { data, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const openQueueReq = async ({ document }) => {
  try {
    const docRef = doc(db, "queues", document.id);
    const data = {
      openForRegistration: document.openForRegistration,
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, data);

    return { data, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
