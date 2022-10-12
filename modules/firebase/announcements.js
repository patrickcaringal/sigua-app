import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { associationMessage } from "../../components/common";
import { sortBy } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collectionName = "announcements";
const collRef = collection(db, collectionName);

export const getAnnouncementsReq = async () => {
  try {
    const q = query(collRef, where("deleted", "!=", true));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated"));

    const map = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});

    return { data, map, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getDeletedAnnouncementsReq = async () => {
  try {
    const q = query(collRef, where("deleted", "==", true));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const map = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});

    return { data, map, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addAnnouncementReq = async ({ docs }) => {
  try {
    // Bulk Create Document
    const batch = writeBatch(db);

    const data = docs.map((d) => {
      const docRef = doc(collRef);
      const id = docRef.id;
      const mappedDoc = {
        id,
        ...d,
        deleted: false,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };
      batch.set(doc(db, collectionName, id), mappedDoc);

      return mappedDoc;
    });

    await batch.commit();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateAnnouncementReq = async ({ announcement }) => {
  try {
    const batch = writeBatch(db);

    // Update
    const docRef = doc(db, collectionName, announcement.id);
    const finalDoc = {
      ...announcement,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const deleteAnnouncementReq = async ({ announcement }) => {
  try {
    // Update to deleted status
    const docRef = doc(db, collectionName, announcement.id);
    const finalDoc = {
      deleted: true,
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

export const restoreAnnouncementReq = async ({ docs }) => {
  try {
    // Bulk Update Document
    const batch = writeBatch(db);

    docs.forEach((d) => {
      const updatedFields = {
        deleted: false,
      };
      batch.update(doc(db, collectionName, d.id), updatedFields);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
