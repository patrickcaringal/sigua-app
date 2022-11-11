import {
  collection,
  deleteDoc,
  doc,
  getDoc,
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

const collectionName = "feedbacks";
const collRef = collection(db, collectionName);

export const getForApprovalFeedbacksReq = async () => {
  try {
    const q = query(collRef, where("approved", "==", false));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getApprovedFeedbacksReq = async () => {
  try {
    const q = query(collRef, where("approved", "==", true));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addFeedbackReq = async (feedback) => {
  try {
    const docRef = doc(collRef);
    const id = docRef.id;
    const d = {
      id,
      approved: false,
      ...feedback,
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };
    await setDoc(doc(db, collectionName, id), d);

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const approveFeedbackReq = async ({ id, ...rest }) => {
  try {
    const docRef = doc(db, collectionName, id);
    const finalDoc = {
      approved: true,
      ...rest,
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const rejectFeedbackReq = async ({ id }) => {
  try {
    await deleteDoc(doc(db, collectionName, id));

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

// export const deleteAnnouncementReq = async ({ announcement }) => {
//   try {
//     // Update to deleted status
//     const docRef = doc(db, collectionName, announcement.id);
//     const finalDoc = {
//       deleted: true,
//       ...timestampFields({ dateUpdated: true }),
//     };
//     await updateDoc(docRef, finalDoc);

//     return { success: true };
//   } catch (error) {
//     console.log(error);
//     const errMsg = getErrorMsg(error.code);
//     return { error: errMsg || error.message };
//   }
// };
