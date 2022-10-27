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
    const q = query(collRef, where("deleted", "==", false));
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

export const addDoctorReq = async ({ docs }) => {
  try {
    // Check email duplicate
    await checkDuplicate({
      collectionName: collectionName,
      whereClause: where(
        "email",
        "in",
        docs.map((i) => i.email)
      ),
      duplicateOutputField: "email",
      errorMsg: {
        noun: "Email",
      },
    });

    // Check name duplicate
    await checkDuplicate({
      collectionName: collectionName,
      whereClause: where(
        "nameBirthdate",
        "in",
        docs.map((i) => i.nameBirthdate)
      ),
      errorMsg: {
        noun: "Doctor",
      },
    });

    const batch = writeBatch(db);

    // Bulk Create Auth Account
    for (let index = 0; index < docs.length; index++) {
      const doctorDoc = { ...docs[index] };
      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        doctorDoc.email,
        "12345678" // TODO: random generate
      );

      const docRef = doc(collRef);
      const id = docRef.id;
      doctorDoc = {
        ...doctorDoc,
        id,
        authId: uid,
        role: "doctor",
        deleted: false,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };

      batch.set(doc(db, collectionName, id), doctorDoc);

      docs[index] = { ...doctorDoc };
    }

    // Register doctor name
    const { namesDocRef, names } = await registerNames({
      collectionName: collectionName,
      names: docs.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {}),
    });
    batch.update(namesDocRef, names);

    // Bulk Create Account Document
    await batch.commit();

    return { data: docs, success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateDoctorReq = async ({ doctor }) => {
  try {
    // Check duplicate
    if (doctor.name || doctor.birthdate) {
      await checkDuplicate({
        collectionName: collectionName,
        whereClause: where("nameBirthdate", "==", doctor.nameBirthdate),
        errorMsg: {
          noun: "Doctor",
        },
      });
    }

    // Update
    const batch = writeBatch(db);
    const docRef = doc(db, collectionName, doctor.id);
    const finalDoc = {
      ...doctor,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register doctor name
    if (doctor.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: collectionName,
        names: { [doctor.id]: doctor.name },
      });
      batch.update(namesDocRef, names);
    }

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const deleteDoctorReq = async ({ doctor }) => {
  try {
    // NOTE: check delete assoc for doctor

    // Update to deleted status
    const docRef = doc(db, "doctors", doctor.id);
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

export const getDoctorsReq = async ({ mapBranch }) => {
  try {
    // TODO: adjust when get branch needed
    // const q = query(collRef, where("branch", "==", branch));
    const q = query(
      collRef,
      where("deleted", "==", false),
      where("role", "==", "doctor")
    );
    const querySnapshot = await getDocs(q);

    let branches = {};
    if (mapBranch) {
      // Get Account list
      const docRef = doc(db, collectionName, "list");
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Unable to get Doctor list doc");
      }
      branches = docSnap.data();
    }

    const data = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return mapBranch
          ? {
              ...data,
              branchName: branches[data.branch],
            }
          : data;
      })
      .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getDoctorReq = async ({ id }) => {
  try {
    // Get Doctor
    const q = doc(db, collectionName, id);
    const querySnapshot = await getDoc(q);

    if (!querySnapshot.exists()) {
      throw new Error("Unable to get Doctor doc");
    }

    const data = querySnapshot.data();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getDeletedDoctorsReq = async () => {
  try {
    // TODO: adjust when get branch needed
    // const q = query(collRef, where("branch", "==", branch));
    const q = query(
      collRef,
      where("deleted", "==", true),
      where("role", "==", "doctor")
    );
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
        };
      })
      .sort(sortBy("dateCreated"));

    // const data = querySnapshot.docs
    //   .map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }))
    //   .sort(sortBy("dateCreated"));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const restoreDoctorReq = async ({ docs }) => {
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

export const diagnosePatientReq = async ({ queue, medicalRecord }) => {
  try {
    const batch = writeBatch(db);

    // Update queue
    const { id, from, document } = queue;
    const docRef = doc(db, "queues", id);
    batch.update(docRef, {
      done: arrayUnion(document),
      [from]: arrayRemove(document),
    });

    // Create Medical Record
    const docRef2 = doc(collection(db, "medicalRecords"));
    const data = {
      id: docRef2.id,
      ...medicalRecord,
      deleted: false,
      date: formatTimeStamp(Timestamp.now()),
      ...timestampFields({ dateCreated: true, dateUpdated: true }),
    };
    batch.set(docRef2, data);

    // Update patient visit
    const docRef3 = doc(db, "patients", medicalRecord.patientId);
    batch.update(docRef3, {
      visitedBranch: arrayUnion(medicalRecord.branchId),
    });

    await batch.commit();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};
