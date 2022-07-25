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

import { formatTimeStamp, getFullName, pluralize } from "../helper";
import { getErrorMsg } from "./auth";
import { auth, db, secondaryAuth, timestampFields } from "./config";

const collRef = collection(db, "staffs");

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

export const getStaffsReq = async ({ branch }) => {
  try {
    // TODO: adjust when get branch needed
    // const q = query(collRef, where("branch", "==", branch));
    const querySnapshot = await getDocs(collRef);

    const data = querySnapshot.docs.map((doc, index) => ({
      index,
      ...doc.data(),
    }));

    return { data, success: true };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
};

export const addStaffReq = async ({ staffs }) => {
  try {
    // Check email duplicate
    let q = query(
      collRef,
      where(
        "email",
        "in",
        staffs.map((i) => i.email)
      )
    );
    let querySnapshot = await getDocs(q);

    let isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      const duplicates = querySnapshot.docs.map((i) => i.data().email);
      throw new Error(
        `Duplicate ${pluralize(
          "Staff email",
          duplicates.length
        )}. ${duplicates.join(", ")}`
      );
    }

    // Check fullname duplicate
    q = query(
      collRef,
      where(
        "name",
        "in",
        staffs.map((i) => getFullName(i))
      )
    );
    querySnapshot = await getDocs(q);

    isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) {
      const duplicates = querySnapshot.docs.map((i) => i.data().name);
      throw new Error(
        `Duplicate ${pluralize("Staff", duplicates.length)}. ${duplicates.join(
          ", "
        )}`
      );
    }

    const batch = writeBatch(db);

    // Bulk Create Auth Account
    for (let index = 0; index < staffs.length; index++) {
      const staffdoc = { ...staffs[index] };
      const { birthdate, email } = staffdoc;

      const {
        user: { uid },
      } = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        "12345678"
      );

      staffdoc = {
        ...staffdoc,
        id: uid,
        name: getFullName(staffdoc),
        birthdate: Timestamp.fromDate(new Date(birthdate)),
        // formatDate(birthdate)
        role: "staff",
        ...timestampFields({ dateCreated: true, dateUpdated: true }),
      };

      batch.set(doc(db, "staffs", uid), staffdoc);

      staffs[index] = { ...staffdoc };
    }

    // Bulk Create Account Document
    await batch.commit();

    return { data: staffs, success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};

export const updateStaffReq = async ({ staff }) => {
  try {
    // Check fullname duplicate
    const q = query(collRef, where("name", "==", getFullName(staff)));
    const querySnapshot = await getDocs(q);

    const isDuplicate =
      querySnapshot.docs.filter((doc) => doc.id !== staff.id).length !== 0;
    if (isDuplicate) {
      throw new Error(`Duplicate Staff. ${getFullName(staff)}`);
    }

    // Update
    const docRef = doc(db, "staffs", staff.id);
    await updateDoc(docRef, { ...lodash.omit(staff, ["id", "index"]) });

    return { success: true };
  } catch (error) {
    const errMsg = getErrorMsg(error.code);
    return { error: errMsg || error.message };
  }
};
