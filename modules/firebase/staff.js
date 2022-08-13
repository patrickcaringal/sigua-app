import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  Timestamp,
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
  getFullName,
  getUniquePersonId,
  pluralize,
  sortBy,
} from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collRef = collection(db, "staffs");

const transformedFields = (doc) => ({
  name: getFullName(doc),
  birthdate: formatFirebasetimeStamp(doc.birthdate),
  nameBirthdate: getUniquePersonId(doc),
});

export const signInStaffReq = async ({ email, password }) => {
  try {
    // Authenticate
    const res = await signInWithEmailAndPassword(auth, email, password);

    // Get User Document
    const id = res?.user?.uid;
    const collRef = collection(db, "staffs");
    const q = query(collRef, where("id", "==", id));
    const querySnapshot = await getDocs(q);

    const exist = querySnapshot.docs.length === 1;
    if (!exist) throw new Error("Staff document not found");

    const document = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    };

    return { data: document, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const getStaffsReq = async ({ mapBranch }) => {
  try {
    // TODO: adjust when get branch needed
    // const q = query(collRef, where("branch", "==", branch));
    const q = query(collRef, where("deleted", "!=", true));
    const querySnapshot = await getDocs(q);

    let branches = {};
    if (mapBranch) {
      // Get Account list
      const docRef = doc(db, "branches", "list");
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Unable to get Account list doc");
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

export const getDeletedStaffsReq = async () => {
  try {
    // TODO: adjust when get branch needed
    // const q = query(collRef, where("branch", "==", branch));
    const q = query(collRef, where("deleted", "==", true));
    const querySnapshot = await getDocs(q);

    // Get Account list
    const docRef = doc(db, "branches", "list");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Unable to get Account list doc");
    }

    const branches = docSnap.data();

    const data = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          branchName: branches[data.branch],
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

export const addStaffReq = async ({ docs }) => {
  try {
    // Check email duplicate
    await checkDuplicate({
      collectionName: "staffs",
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
      collectionName: "staffs",
      whereClause: where(
        "nameBirthdate",
        "in",
        docs.map((i) => i.nameBirthdate)
      ),
      errorMsg: {
        noun: "Staff",
      },
    });

    const batch = writeBatch(db);

    // Bulk Create Auth Account
    for (let index = 0; index < docs.length; index++) {
      const staffDoc = { ...docs[index] };
      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        staffDoc.email,
        "12345678" // TODO: random generate
      );

      const docRef = doc(collRef);
      const id = docRef.id;
      staffDoc = {
        ...staffDoc,
        id,
        authId: uid,
        role: "staff",
        deleted: false,
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };

      batch.set(doc(db, "staffs", id), staffDoc);

      docs[index] = { ...staffDoc };
    }

    // Register staff name
    const { namesDocRef, names } = await registerNames({
      collectionName: "staffs",
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

export const updateStaffReq = async ({ staff }) => {
  try {
    // Check duplicate
    if (staff.name || staff.birthdate) {
      await checkDuplicate({
        collectionName: "staffs",
        whereClause: where("nameBirthdate", "==", staff.nameBirthdate),
        errorMsg: {
          noun: "Staff",
        },
      });
    }

    // Update
    const batch = writeBatch(db);
    const docRef = doc(db, "staffs", staff.id);
    const finalDoc = {
      ...staff,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register staff name
    if (staff.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: "staffs",
        names: { [staff.id]: staff.name },
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

export const deleteStaffReq = async ({ staff }) => {
  try {
    // NOTE: check delete assoc for staff

    // Update to deleted status
    const docRef = doc(db, "staffs", staff.id);
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

export const restoreStaffReq = async ({ docs }) => {
  try {
    // Bulk Update Document
    const batch = writeBatch(db);

    docs.forEach((d) => {
      const updatedFields = {
        deleted: false,
      };
      batch.update(doc(db, "staffs", d.id), updatedFields);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
