import bcrypt from "bcryptjs";
import { format as formatDate } from "date-fns";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { omit as omitFields } from "lodash";

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
      firstName: firstName.toLowerCase(),
      middleName: middleName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      suffix: suffix.toLowerCase(),
      birthdate: formatDate(new Date(birthdate), "yyyy-MM-dd"),
      password: hashPassword(password),
      familyMembers: [],
    };
    // Add Default Memeber
    mappedNewDocument.familyMembers = [
      {
        accountId: docRef.id,
        ...omitFields(mappedNewDocument, ["password", "familyMembers"]),
      },
    ];

    // Create Document
    await setDoc(docRef, mappedNewDocument);
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
    if (isDuplicate)
      throw new Error("Based on Contact No, account already exist.");

    // TODO: check duplication on patient

    successCb();
  } catch (error) {
    errorCb(error.message);
    console.log(error);
  }
};
