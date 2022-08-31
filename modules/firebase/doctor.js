import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  Timestamp,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import lodash from "lodash";

import {
  arrayStringify,
  formatFirebasetimeStamp,
  formatTimeStamp,
  getFullName,
  getUniquePersonId,
  pluralize,
  sortBy,
} from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collectionName = "doctors";
const collRef = collection(db, collectionName);

const transformedFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

export const getBranchDoctorsReq = async ({ branchId }) => {
  try {
    // Super Admin Doctor
    const q = query(collRef, where("role", "==", "superadmin"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // .sort(sortBy("date", "desc"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const diagnosePatientReq = async ({ queue, medicalRecord }) => {
  try {
    const batch = writeBatch(db);

    // Update queue
    const { id, from, document } = queue;
    // const docRef = doc(db, "queues", id);
    // batch.update(docRef, {
    //   done: arrayUnion(document),
    //   [from]: arrayRemove(document),
    // });

    // // Create Medical Record
    // const docRef2 = doc(collection(db, "medicalRecords"));
    // const data = {
    //   id: docRef2.id,
    //   ...medicalRecord,
    //   deleted: false,
    //   date: formatTimeStamp(Timestamp.now()),
    //   ...timestampFields({ dateCreated: true, dateUpdated: true }),
    // };
    // batch.set(docRef2, data);

    const docRef3 = doc(db, "patients", medicalRecord.patientId);
    batch.update(docRef3, {
      visitedBranch: arrayUnion(medicalRecord.branchId),
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
