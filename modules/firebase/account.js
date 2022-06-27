import bcrypt from "bcryptjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { omit as omitFields } from "lodash";

import { formatDate } from "../helper";
import { db } from "./config";

const collRef = collection(db, "accounts");

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(6);
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

export const comparePassword = (password, hashedPassword) => {
  const isMatched = bcrypt.compareSync(password, hashedPassword);
  return isMatched;
};

export const createAccountReq = async (
  newDocument,
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    const docRef = doc(collRef);

    // Transform Document
    const { firstName, middleName, lastName, suffix, birthdate, password } =
      newDocument;
    let mappedNewDocument = {
      ...newDocument,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      suffix: suffix,
      birthdate: formatDate(birthdate),
      password: hashPassword(password),
      familyMembers: [],
    };
    // Add Default Memeber
    mappedNewDocument.familyMembers = [
      {
        accountId: docRef.id,
        verified: true,
        ...omitFields(mappedNewDocument, ["password", "familyMembers"]),
      },
    ];

    // Create Document
    await setDoc(docRef, mappedNewDocument);

    // remove password field
    delete document.password;

    successCb({ id: docRef.id, ...mappedNewDocument });
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};

export const checkAccountDuplicateReq = async (
  contactNo,
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    const q = query(collRef, where("contactNo", "==", contactNo));

    const querySnapshot = await getDocs(q);

    const isDuplicate = querySnapshot.docs.length !== 0;
    if (isDuplicate) throw new Error("Contact No already used.");

    // TODO: check duplication on patient

    successCb();
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};

export const checkAccountCredentialReq = async (
  { contactNo, password },
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    const q = query(collRef, where("contactNo", "==", contactNo));
    const querySnapshot = await getDocs(q);

    // Check if account exist
    const exist = querySnapshot.docs.length === 1;
    if (!exist) throw new Error("Invalid contact number or password");

    // Check if correct password
    const document = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    };
    const correctPass = comparePassword(password, document.password);
    if (!correctPass) throw new Error("Invalid contact number or password");

    // remove password field
    delete document.password;

    successCb(document);
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};

export const getFamilyMembersReq = async (
  id,
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    const docRef = doc(db, "accounts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      successCb(docSnap.data().familyMembers);
    } else {
      successCb([]);
    }
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};

export const addFamilyMembersReq = async (
  { id, familyMembers },
  { successCb = () => {}, errorCb = () => {} }
) => {
  try {
    // console.log("addFamilyMembersReq", { id, familyMembers });
    const mappedFamMembers = familyMembers.map((i) => {
      return {
        ...i,
        ...(!i.contact && { verified: false }),
      };
    });
    console.log(JSON.stringify(mappedFamMembers, null, 4));

    // const docRef = doc(db, 'accounts', id);
    // await setDoc(docRef, { familyMembers }, { merge: true });
    successCb();
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};

// export const getUser = async () => {
//   try {
//     const q = query(collRef, where("contactNo", "==", "09994441760"));

//     const querySnapshot = await getDocs(q);
//     const document = querySnapshot.docs[0].data();

//     console.log({ document, x: querySnapshot.docs[0].id });
//   } catch (error) {
//     // errorCb(error.message);
//     console.log(error);
//   }
// };
