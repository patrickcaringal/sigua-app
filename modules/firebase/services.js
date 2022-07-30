import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import lodash from "lodash";

import { pluralize } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";

const collRef = collection(db, "services");

export const getServicesReq = async () => {
  try {
    const querySnapshot = await getDocs(collRef);
    const data = querySnapshot.docs.map((doc, index) => ({
      id: doc.id,
      index,
      ...doc.data(),
    }));

    const map = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});

    return { data, map, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addServiceReq = async ({ docs }) => {
  try {
    const q = query(
      collRef,
      where(
        "name",
        "in",
        docs.map((i) => i.name)
      )
    );
    const querySnapshot = await getDocs(q);

    const isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      const duplicates = querySnapshot.docs.map((i) => i.data().name);
      throw new Error(
        `Duplicate ${pluralize(
          "Service",
          duplicates.length
        )}. ${duplicates.join(", ")}`
      );
    }

    // Bulk Create Service Document
    const batch = writeBatch(db);

    const data = docs.map((d) => {
      const docRef = doc(collRef);
      const id = docRef.id;

      const mappedDoc = {
        id,
        ...d,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };
      batch.set(doc(db, "services", id), mappedDoc);

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

export const updateServiceReq = async ({ service }) => {
  try {
    const { name } = service;
    // Check name duplicate
    const q = query(collRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    const isDuplicate =
      querySnapshot.docs.filter((doc) => doc.id !== service.id).length !== 0;
    if (isDuplicate) throw new Error(`Service ${name} already exist`);

    // Update
    const docRef = doc(db, "services", service.id);
    const finalDoc = {
      ...lodash.omit(service, ["id", "index", "dateCreated"]),
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const deleteServiceReq = async ({ service }) => {
  try {
    const { name } = service;
    // // Check name duplicate
    // const q = query(collRef, where("name", "==", name));
    // const querySnapshot = await getDocs(q);

    // const isDuplicate =
    //   querySnapshot.docs.filter((doc) => doc.id !== service.id).length !== 0;
    // if (isDuplicate) throw new Error(`Service ${name} already exist`);

    // Update to deleted status
    const docRef = doc(db, "services", service.id);
    const finalDoc = {
      deleted: true,
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
