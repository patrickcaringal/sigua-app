import bcrypt from "bcryptjs";
import {
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
import { omit as omitFields } from "lodash";

import { duplicateMessage } from "../../components/common";
import {
  formatDate,
  formatFirebasetimeStamp,
  getFullName,
  getUniquePersonId,
  pluralize,
} from "../helper";
import { db, timestampFields } from "./config";

const collRef = collection(db, "patients");

const transformedFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

export const getFamilyMembersReq = async (id) => {
  try {
    const q = query(
      collRef,
      where("accountId", "==", id),
      where("deleted", "==", false)
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addPatientReq = async ({ docs }) => {
  try {
    // const docRef = doc(db, "accounts", id);
    // const docSnap = await getDoc(docRef);

    // // Check Duplicates
    // let duplicates = [];
    // if (docSnap.exists()) {
    //   const old = docSnap.data().familyMembers;
    //   familyMembers.forEach((n) => {
    //     const exist = old.filter((o) => getFullName(o) === getFullName(n));

    //     if (exist.length) duplicates.push(getFullName(n));
    //   });
    // }

    // if (duplicates.length) {
    //   throw new Error(
    //     `Duplicate ${pluralize(
    //       "Family Member",
    //       duplicates.length
    //     )}. ${duplicates.join(", ")}`
    //   );
    // }

    // // Insert default fields
    // familyMembers = familyMembers.map((i) => ({
    //   ...i,
    //   id: doc(collRef).id,
    //   accountId: id,
    //   birthdate: formatDate(i.birthdate),
    //   verified: false,
    //   verifiedContactNo: false,
    //   verificationAttachment: null,
    // }));

    // // Update document
    // await updateDoc(docRef, {
    //   familyMembers: [...docSnap.data().familyMembers, ...familyMembers],
    // });

    // Bulk Create Document
    const batch = writeBatch(db);

    // // Bulk Create Auth Account
    // for (let index = 0; index < patients.length; index++) {
    //   const doc = { ...patients[index] };

    //   const docRef = doc(collection(db, "patients"));
    //   doc = {
    //     ...doc,
    //     id: uid,
    //     verified: false,
    //     verifiedContactNo: false,
    //     verificationAttachment: null,
    //     deleted: false,
    //     ...transformedFields(doc),
    //     ...timestampFields({ dateCreated: true, dateUpdated: true }),
    //   };

    //   batch.set(docRef, doc);

    //   patients[index] = { ...doc };
    // }

    const data = docs.map((d) => {
      const docRef = doc(collRef);
      const id = docRef.id;
      const mappedDoc = {
        id,
        ...d,
        verified: false,
        verifiedContactNo: false,
        verificationAttachment: null,
        ...transformedFields(d),
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
        deleted: false,
      };
      batch.set(doc(db, "patients", id), mappedDoc);

      return mappedDoc;
    });

    await batch.commit();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const updatePatientReq = async ({ patient }) => {
  try {
    // // Check fullname, birthdate duplicate
    // const q = query(
    //   collRef,
    //   where("nameBirthdate", "==", getUniquePersonId(patient))
    // );
    // const querySnapshot = await getDocs(q);

    // const isDuplicate =
    //   querySnapshot.docs.filter((doc) => doc.id !== patient.id).length !== 0;
    // if (isDuplicate) {
    //   throw new Error(
    //     duplicateMessage({ noun: "Patient", item: getFullName(patient) })
    //   );
    // }

    // Update
    const docRef = doc(db, "patients", patient.id);
    const finalDoc = {
      ...patient,
      ...timestampFields({ dateUpdated: true }),
    };
    await updateDoc(docRef, finalDoc);

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
