import axios from "axios";
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
import { getBaseApi } from "../env";
import { sortBy, sortByDate_Branch } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collRef = collection(db, "queues");

export const getAllQueuesReq = async () => {
  try {
    const q = query(collRef);
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortByDate_Branch("date", "branchName", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getQueuesByBranchReq = async ({ id }) => {
  try {
    const q = query(collRef, where("branchId", "==", id));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("date", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getQueuesTodayReq = async ({ today }) => {
  try {
    const q = query(
      collRef,
      where("queueDate", "==", today),
      where("openQueue", "==", true)
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("date", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getQueuesByBranchDateRangeReq = async ({ id, start, end }) => {
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
      .sort(sortBy("date", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getQueuesByDateRangeReq = async ({ id, start, end }) => {
  try {
    const q = query(
      collRef,
      where("dateCreated", ">=", start),
      where("dateCreated", "<=", end)
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({ ...doc.data() }))
      .sort(sortBy("date", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getQueueReq = async ({ id }) => {
  try {
    const q = doc(db, "queues", id);
    const querySnapshot = await getDoc(q);
    if (!querySnapshot.exists()) {
      throw new Error("Unable to get Queue doc");
    }

    const data = querySnapshot.data();

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

export const registerToQueueReq = async ({ id, document }) => {
  try {
    // Get latest queue
    const docRef = doc(db, "queues", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("Unable to get Queue doc");
    }

    const data = docSnap.data();
    document = {
      ...document,
      queueNo: data.nextQueueNo,
    };

    // Add to queue
    const docRef2 = doc(db, "queues", id);
    await updateDoc(docRef2, {
      queue: arrayUnion(document),
      nextQueueNo: increment(1),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const addQueueCounterReq = async ({ id, document }) => {
  try {
    // Add
    const docRef = doc(db, "queues", id);
    await updateDoc(docRef, {
      [`counters.${document.id}`]: document,
      doctors: arrayUnion(document.id),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateQueueRegStatusReq = async ({ document }) => {
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

export const updateQueueStatusReq = async ({ document }) => {
  try {
    const docRef = doc(db, "queues", document.id);
    const data = {
      openQueue: document.openQueue,
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

export const transferQueueItemReq = async ({ id, from, to, document }) => {
  try {
    // Update
    const docRef = doc(db, "queues", id);
    await updateDoc(docRef, {
      [to]: arrayUnion(document),
      [from]: arrayRemove(document),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const sendQueueSmsReq = async (payload) => {
  try {
    const res = await axios.post(getBaseApi("/queue-sms"), payload);

    return { success: true, data: res?.data };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

// Dev func
export const resetQueueReq = async ({ id }) => {
  try {
    const docRef = doc(db, "queues", id);
    await updateDoc(docRef, {
      queue: [],
      next: [],
      counters: {},
      skipped: [],
      done: [],
      doctors: [],
      nextQueueNo: 1,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
