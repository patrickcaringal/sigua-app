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

import { associationMessage } from "../../components/common";
import { sortBy } from "../helper";
import { getErrorMsg } from "./auth";
import { db, timestampFields } from "./config";
import { checkDuplicate, registerNames } from "./helpers";

const collRef = collection(db, "branches");

export const getBranchesReq = async () => {
  try {
    const q = query(collRef, where("deleted", "!=", true));
    const querySnapshot = await getDocs(q);

    // Get Account list
    const docRef = doc(db, "services", "list");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Unable to get Account list doc");
    }

    // Map fields
    const services = docSnap.data();
    const data = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          services: data.servicesId.map((i) => services[i]),
        };
      })
      .sort(sortBy("dateCreated"));

    const map = data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {});

    return { data, map, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const getDeletedBranchesReq = async () => {
  try {
    const q = query(collRef, where("deleted", "==", true));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addBranchReq = async ({ docs }) => {
  try {
    // Check duplicate
    await checkDuplicate({
      collectionName: "branches",
      whereClause: where(
        "name",
        "in",
        docs.map((i) => i.name)
      ),
      errorMsg: {
        noun: "Branch",
        suffix: "es",
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
      batch.set(doc(db, "branches", id), mappedDoc);

      return mappedDoc;
    });

    // Register branch name
    const { namesDocRef, names } = await registerNames({
      collectionName: "branches",
      names: data.reduce((acc, i) => ({ ...acc, [i.id]: i.name }), {}),
    });
    batch.update(namesDocRef, names);

    await batch.commit();

    return { data, success: true };
  } catch (error) {
    console.log(error);
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateBranchReq = async ({ branch }) => {
  try {
    // Check duplicate
    if (branch.name) {
      await checkDuplicate({
        collectionName: "branches",
        whereClause: where("name", "==", branch.name),
        errorMsg: {
          noun: "Branch",
        },
      });
    }
    const batch = writeBatch(db);

    // Update
    const docRef = doc(db, "branches", branch.id);
    const finalDoc = {
      ...branch,
      ...timestampFields({ dateUpdated: true }),
    };
    batch.update(docRef, finalDoc);

    // Register branch name
    if (branch.name) {
      const { namesDocRef, names } = await registerNames({
        collectionName: "branches",
        names: { [branch.id]: branch.name },
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

export const deleteBranchReq = async ({ branch }) => {
  try {
    // Check Branches associated
    await checkDuplicate({
      collectionName: "staffs",
      whereClause: where("branch", "==", branch.id),
      customErrorMsg: associationMessage({
        verb: "delete",
        item: branch.name,
        noun: `some Staffs`,
      }),
    });

    // Update to deleted status
    const docRef = doc(db, "branches", branch.id);
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

export const restoreBranchReq = async ({ docs }) => {
  try {
    // Bulk Update Document
    const batch = writeBatch(db);

    docs.forEach((d) => {
      const updatedFields = {
        deleted: false,
      };
      batch.update(doc(db, "branches", d.id), updatedFields);
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
