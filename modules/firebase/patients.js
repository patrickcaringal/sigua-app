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

import { sortBy } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

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

export const getVerifiedFamilyMembersReq = async ({ id }) => {
  try {
    const q = query(
      collRef,
      where("accountId", "==", id),
      where("verifiedContactNo", "==", true),
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

export const getPatientReq = async ({ id }) => {
  try {
    // Get Patient
    const q = doc(db, "patients", id);
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.exists()) {
      throw new Error("Unable to get Patient doc");
    }

    const data = querySnapshot.data();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getAllPatientsReq = async () => {
  try {
    const q = query(collRef, where("verified", "==", true));
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

export const getPatientsReq = async () => {
  try {
    // Get Patients
    const q = query(
      collRef,
      where("verified", "==", true),
      where("deleted", "==", false)
    );
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

export const getPatientsByBranchReq = async ({ id }) => {
  try {
    // Get Patients
    const q = query(
      collRef,
      where("visitedBranch", "array-contains", id),
      where("verified", "==", true),
      where("deleted", "==", false)
    );
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
    // Check duplicate
    await checkDuplicate({
      collectionName: "patients",
      whereClause: where(
        "nameBirthdate",
        "in",
        docs.map((i) => i.nameBirthdate)
      ),
      errorMsg: {
        noun: "Patient",
      },
    });

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
    const { namesDocRef, names } = await registerNames({
      collectionName: "patients",
      names: data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {}),
    });
    batch.update(namesDocRef, names);

    await batch.commit();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const updatePatientReq = async ({ patient }) => {
  try {
    // Check duplicate
    if (patient.name || patient.birthdate) {
      await checkDuplicate({
        collectionName: "patients",
        whereClause: where("nameBirthdate", "==", patient.nameBirthdate),
        errorMsg: {
          noun: "Patient",
        },
      });
    }

    // Update
    const batch = writeBatch(db);
    const docRef = doc(db, "patients", patient.id);
    const finalDoc = {
      ...patient,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register Patient name
    if (patient.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: "patients",
        names: { [patient.id]: patient.name },
      });
      batch.update(namesDocRef, names);
    }

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const deletePatientReq = async ({ patient }) => {
  try {
    // // Check Branches associated
    // await checkDuplicate({
    //   collectionName: "branches",
    //   whereClause: where("servicesId", "array-contains", patient.id),
    //   customErrorMsg: associationMessage({
    //     verb: "delete",
    //     item: patient.name,
    //     noun: `some Branches`,
    //   }),
    // });
    const batch = writeBatch(db);

    // Update to deleted status
    const docRef = doc(db, "patients", patient.id);
    const finalDoc = {
      deleted: true,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Account Update to deleted status
    const docRef2 = doc(db, "accounts", patient.accountId);
    const finalDoc2 = {
      deleted: true,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef2, finalDoc2);

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const getDeletedPatientsReq = async () => {
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

export const restorePatientReq = async ({ docs }) => {
  try {
    // Bulk Update Document
    const batch = writeBatch(db);

    docs.forEach((d) => {
      const updatedFields = { deleted: false };
      batch.update(doc(db, "patients", d.id), updatedFields);
      batch.update(doc(db, "accounts", d.accountId), updatedFields);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
