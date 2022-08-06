import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { duplicateMessage } from "../../components/common";
import { arrayStringify, pluralize, sortBy } from "../helper";
import { db, timestampFields } from "./config";

export const MEMBER_STATUS = {
  VERFIED: "VERFIED",
  FOR_VERIFICATION: "FOR_VERIFICATION",
  FOR_PHONE_VERIFICATION: "FOR_PHONE_VERIFICATION",
  FOR_APPROVAL: "FOR_APPROVAL",
  REJECTED: "REJECTED",
};

const collRef = collection(db, "patients");

export const getFamilyMembersReq = async (id) => {
  try {
    const q = query(
      collRef,
      where("accountId", "==", id),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => ({
        ...doc.data(),
      }))
      .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getPatientsForApprovalReq = async ({}) => {
  try {
    // Get Patients
    const q = query(
      collRef,
      where("status", "==", MEMBER_STATUS.FOR_APPROVAL),
      where("verified", "==", false),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    // Get Account list
    const docRef = doc(db, "accounts", "list");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Unable to get Account list doc");
    }

    // Map fields
    const accounts = docSnap.data();
    const data = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          accountName: accounts[data.accountId],
        };
      })
      .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addPatientReq = async ({ docs }) => {
  try {
    // Check fullname, birthdate duplicate
    const q = query(
      collRef,
      where(
        "nameBirthdate",
        "in",
        docs.map((i) => i.nameBirthdate)
      )
    );
    const querySnapshot = await getDocs(q);

    const duplicates = querySnapshot.docs.map((i) => i.data().name);
    if (duplicates.length) {
      throw new Error(
        duplicateMessage({
          noun: pluralize("Patient", duplicates.length),
          item: arrayStringify(duplicates),
        })
      );
    }

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
      batch.set(doc(db, "patients", id), mappedDoc);

      return mappedDoc;
    });

    // Register Patient name
    const docRef2 = doc(db, "patients", "list");
    const names = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});
    batch.update(docRef2, { ...names });

    await batch.commit();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const updatePatientReq = async ({ patient }) => {
  try {
    // Check fullname, birthdate duplicate
    if (patient.name || patient.birthdate) {
      const q = query(
        collRef,
        where("nameBirthdate", "==", patient.nameBirthdate)
      );
      const querySnapshot = await getDocs(q);

      const duplicates = querySnapshot.docs
        .filter((doc) => doc.id !== patient.id)
        .map((i) => i.data().name);
      if (duplicates.length) {
        throw new Error(
          duplicateMessage({
            noun: "Patient",
            item: arrayStringify(duplicates),
          })
        );
      }
    }

    // Update
    const docRef = doc(db, "patients", patient.id);
    const finalDoc = {
      ...patient,
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    // Register Patient name
    if (patient.name) {
      const docRef2 = doc(db, "patients", "list");
      const names = { [patient.id]: patient.name };
      await updateDoc(docRef2, { ...names });
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
